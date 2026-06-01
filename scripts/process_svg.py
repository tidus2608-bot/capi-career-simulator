#!/usr/bin/env python3
"""Extract embedded PNG from a Drive-downloaded SVG base64 file and save as WebP."""
import sys, json, re, base64, io, os
from PIL import Image

def process(temp_file_path, output_path):
    with open(temp_file_path, 'r') as f:
        raw = f.read(8_000_000)  # read up to 8MB

    # Extract base64 content from JSON
    m = re.match(r'\{"content":"([^"]*)', raw)
    if not m:
        print(f"ERROR: Could not find content in {temp_file_path}")
        return False

    b64_svg = m.group(1)
    try:
        svg = base64.b64decode(b64_svg + '==').decode('utf-8', errors='replace')
    except Exception as e:
        print(f"ERROR decoding SVG: {e}")
        return False

    # Find embedded PNG base64
    di = svg.find('data:image/png;base64,')
    if di == -1:
        print(f"WARNING: No embedded PNG in {temp_file_path}, trying JPEG")
        di = svg.find('data:image/jpeg;base64,')
        if di == -1:
            print(f"ERROR: No embedded image found in {temp_file_path}")
            return False
        mime_start = 22
    else:
        mime_start = 22

    # Find end of base64 data (closing quote)
    end = svg.find('"', di + mime_start)
    if end == -1:
        end = svg.find("'", di + mime_start)
    if end == -1:
        print(f"ERROR: Could not find end of image data")
        return False

    png_b64 = svg[di + mime_start:end]
    try:
        png_data = base64.b64decode(png_b64 + '==')
    except Exception as e:
        print(f"ERROR decoding PNG: {e}")
        return False

    img = Image.open(io.BytesIO(png_data))
    # Crop to the left illustration panel (width ~597/1440 of canvas)
    # The pattern fills a 597-wide rect on a 1440-wide canvas
    # PNG is 784px wide (original hi-res), so we keep it as-is
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'WEBP', quality=82, method=4)
    size_kb = os.path.getsize(output_path) / 1024
    print(f"OK: {output_path} ({img.size[0]}x{img.size[1]}, {size_kb:.1f}KB)")
    return True

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: process_svg.py <temp_file_path> <output_webp_path>")
        sys.exit(1)
    ok = process(sys.argv[1], sys.argv[2])
    sys.exit(0 if ok else 1)
