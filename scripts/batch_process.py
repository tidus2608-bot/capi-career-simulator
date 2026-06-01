#!/usr/bin/env python3
"""Batch process downloaded SVG temp files into WebP illustrations."""
import os, re, json, base64, io, glob
from PIL import Image

TOOL_RESULTS_DIR = "/root/.claude/projects/-home-user-capi-career-simulator/a17a81ba-6e9b-42d5-ac42-65e8a6094cb1/tool-results"
OUTPUT_DIR = "/home/user/capi-career-simulator/public/illos"

# Map Drive file ID → (mission_id, question_num)
FILE_ID_MAP = {
    # Mission 1 - Hệ thống Tái chế
    "1D-sIAPGZTmC1nsn6TZmoexJ3VtBl3Yoa": (1, 1),
    "1QSyf8dcLcbKleKg6konoXo4DFjfiFMXd": (1, 2),
    "1aZQ5V7V64DORbmdqn1-jXWzx7zevJGA8": (1, 3),
    "1ro1mk6BIKa_hbJgOffqetdCXBWyV9k4e": (1, 4),
    "1sU7JncB853okUvcfkc-uyVr4LR1o0RIQ": (1, 5),
    "159XWE5j7noed25KElSKPdHqyud_6UUAd": (1, 6),
    "1mNqoUrz2I7xVI58zx-4jAEl0eO53iTGM": (1, 7),
    "1-BJmPka7-8n9wxvFW4_S6MYXcd6ZeEbC": (1, 8),
    "1mS_sRTmqAXPP5HRRHEvki4bMMualRLbA": (1, 9),
    "1YOQHr91ulWJ5iMUOAT8H7io5OclSo2x1": (1, 10),
    "1p0K3vaIMAsQ-xKL-xY4JjYmG1tlctiBf": (1, 11),
    "1xSM99FWHJ7rWpNPX2KRtDt_fT2aOAsvT": (1, 12),
    "1FF6bdPCuD2K1IV17yDIqPJfO6GZJr4iW": (1, 13),
    "14MND56HwKkKfJ_-ol5Ehxr88SuiFNRPa": (1, 14),
    "1WDnx33-ucQZqiq4fCbxuYzjpwQ6PkAU6": (1, 15),
    "1qruue4wremGLCRmu9fbwlftNSiQk-PaI": (1, 16),
    "1yWAcyRlFG6u27ldAxGFjqpTaG3lwVcPG": (1, 17),
    "1zCffPWJ5B_cTSL7jXedoODIooo49bakb": (1, 18),
    "18TNiH4CJRZ5W8xi-NQhYJFpWY-6OWW-5": (1, 19),
    "1NALSuBKjkdBdxxwdYzgCPSE7aKAmOYdN": (1, 20),
    # Mission 2 - Trạm Y tế AI
    "1cgCWMVnmgQZyEUhrWahe4RdCsJXs3wce": (2, 1),
    "1wN-qVlZHIjfiCJ_udfmv1lOlcsnvpumd": (2, 2),
    "1oR4rWnJ4pJ9JQ4TBlYaqYf23Vl5saP5y": (2, 3),
    "17jntU_UtWqB0QBA_aELXueWas--4xPuu": (2, 4),
    "138V3Wt2UEcvtsYYxVWBaY1ATRTjOHfug": (2, 5),
    "1VKoZ3FADox8RpASIHOfXAPAAfop3rBtI": (2, 6),
    "1WLqCTcxfQpto2I0J1dAEoBbepb9NRHek": (2, 7),
    "1ukcEVPlYcbZfyRuG034aEE2iv_AQU-Kv": (2, 8),
    "1ZU4aI1rFzLMvm7mvQ5zTISe1MwfCnM1A": (2, 9),
    "1jAhssovBsTgejib1oDPcxEC31VxCnDH4": (2, 10),
    "1gLSsAUJOAJvl7_WmUu--VjmIfN7eFY_6": (2, 11),
    "1Y43jiqVLFlh22b92hvEJdWc03nTDTgXv": (2, 12),
    "1zhulMI8_2y5_RlvVO38Jt2-E0mggYvDt": (2, 13),
    "1j9Po2pBxO1niNfmrVwG4S7hey5JVO87Y": (2, 14),
    "1u-P4RDrHybAg93ogUeuMrvWpWIjZMZmq": (2, 15),
    "1bJpYR-5lQEEwMTJuEyuHUe0dV_Z0vz7G": (2, 16),
    "15crpoCmmWNwm6f0gHt0uC2TbXmRgPBEZ": (2, 17),
    "1yWImz8CTv3nVb-y01IWK1NEmbeVqlUY-": (2, 18),
    "1-ofzgqC3Vw1sL3sirDcfTLaFMu48D8sq": (2, 19),
    "1qq-zmePxSkhlrdqU7APgStHvpTvofUiO": (2, 20),
    # Mission 3 - Căn hộ Thông minh
    "1ICCgf_3xaGN-VOlIJF6XsK6A3TqgdOfS": (3, 1),
    "1S2YBRTBKrviDTZ84Kii59XJMkuVrsnGO": (3, 2),
    "1lqBoCyTNk3KtKsmcWg3Rnnuv7qYQeCVi": (3, 3),
    "16h_PRMB1f47tMTehvzyJ-w6CZf-j6seD": (3, 4),
    "1Y2e9soJIYB8aY1iiOeYxo_Rg59Ia5WlY": (3, 5),
    "108yKll6teOGqiaweeQwSEAcjbhRNUayI": (3, 6),
    "1PHzXBesyBfjLBvP9gIdJGSRRPXwfAeLF": (3, 7),
    "1ZVDag20LKKqGW4yWA7xsSF0bpYZmlhx2": (3, 8),
    "1nKxwYgJyLkWkHHZVmVUdZ84A_SUFznea": (3, 9),
    "1XONB-OY7tDmu6Rl2_6HcDrZkWkMkja4_": (3, 10),
    "1tn6Shd3lOu4vEu35DVHj6vVyd-hb3Bzt": (3, 11),
    "1jFZh8Xos1J5fu9ZjTthzwTZO3s2mIZG4": (3, 12),
    "1hjbiivKUKtp86tnjIhW0_3XVyy6ASFwG": (3, 13),
    "1rnYwl7JrfskklHqaiitUU9U-3hLN_HOW": (3, 14),
    "1zkfcFE_SBt4nmCaPHoddZHtcBGVXHRyc": (3, 15),
    "1VYmoU8oaNI5MS4s-sSpg2loNbeRd_ZH7": (3, 16),
    "1iQEb9r-aIUQ98xjukiaiCorcZkfMNDBk": (3, 17),
    "14_yTNPGlTluSjY-rfWtb3pWBcvmtPdea": (3, 18),
    "1pREgWMSlzM_BVh-oiQG-KGD9jacZLfUT": (3, 19),
    "1F_N5Ae-tiTwQSQvsVIybkst-XTAUsiz4": (3, 20),
    # Mission 4 - Kho vận Tự hành
    "1eG_YaImZX8S-wciNd5NpAlDNj2YYboXW": (4, 1),
    "1Z1-u3ddTlzIVk36UHf5XyRREM9zpQ4Bf": (4, 2),
    "1T9J1s0KVaLIU0pEbpjAzgzyt3bmT8tu3": (4, 3),
    "1YqNlzd361WGshR3ldIHlTI0j7_VPU9Vv": (4, 4),
    "1VVu4ob2aZGFdaC9Pmu87ScomP6Pepw_4": (4, 5),
    "1Q_hqnKMYklYK5V9uOR4-X0jHle1wMnZ_": (4, 6),
    "1Ymox_5K5JtioPYx4_OmfCIdPNtQyVqzv": (4, 7),
    "1Bd4CbhdSJh7xwlI7_n25XeYEMIYSPjzk": (4, 8),
    "1g2R4WHjedj1yBglNvAMEYWWmeTAij-H2": (4, 9),
    "100PKwO3_468o933q1NsDaKCpMp6p_o-V": (4, 10),
    "1TaKFMlyjG0l-y9dVKwYU2NgVkeEinNWS": (4, 11),
    "1eTYXF8t7uxZliwXnK1p9r2MpHtwZQUJZ": (4, 12),
    "1HrxIoT7SRMNtDaRSyiWvlX6Inb8pQmww": (4, 13),
    "1cLCjwhukYAfRSLiIXbdAvVvsuZluhAbG": (4, 14),
    "1T7y5PspMngaQk2LvsXhFnm5EqRc2Rx48": (4, 15),
    "1o_MgY-2nzn3DNpdIjeha5nI-gyfs8rUM": (4, 16),
    "1n0ri1wwoZLG2gl0JsXiAfftfCFRK1FMU": (4, 17),
    "1cRBJfxM1RkkxVWCR5nhY6X9TuTQhq0zQ": (4, 18),
    "15t8QdcNFU26zycKgno4kMRrH7Us72TaZ": (4, 19),
    "1HBQwPUUFBrCjx6mGK_evjxfvBgLX36oO": (4, 20),
    # Mission 5 - Mạng lưới Drone (files in folder 1L0O_qAQh2dmlcH9njWovVlP7LWuv9Y8F)
    "1MGzg7ilV_KSL5Dweugsb_RiEBGHvG3iX": (5, 1),
    "1vVeEU4wn80BFN5zV2MLmnWfJIjHObMML": (5, 2),
    "1V1BlefZGF4PAxVdXb_PXMUv6ojzMRzEx": (5, 3),
    "1odMu4x1Ychj8ot6zejcNc4sBpRqa3c5Z": (5, 4),
    "11EPd-2IL5FCPiJx-lcmMT5kZcXX-hTpa": (5, 5),
    "1mZXT6CYaoavAM57PZk5mvleYvubK7nKv": (5, 6),
    "1_YG2IMf7tZGEDRSWg8T9N-27x71-Mp4j": (5, 7),
    "1OMZ_WGDxBUOyJWVa06Gdq0c1zDkBA48t": (5, 8),
    "1YOc83YMpHu8Q7vV7E9sVM1TBQYawE__r": (5, 9),
    "1OBLucocRkisw1miqJc3rRrHA4Oo3R3La": (5, 10),
    "1gCPuWv6WAyzLT_xy9_esXkEKqOt33L-U": (5, 11),
    "15dwCdwDeajAeyatxOXEyzo_OlvumIvmb": (5, 12),
    "1TK26e8LjMHY2J5zSKIA7bmD0Imx7Exa_": (5, 13),
    "1GASSPCcNMCCQTeFZLp_bSXfHKWW0lB3C": (5, 14),
    "1mdsTAF9CXxMt9XJgd7mrYElOLQodJ9ns": (5, 15),
    "1eG4qJrMSBPef_epDDRd4nVy5ozeZYdcY": (5, 16),
    "157roP_Ltiys6THg5IVDTgaCqJ386Qoib": (5, 17),
    "1WfWhU4f6PwhahtYWwc_j6FWitbT44bPD": (5, 18),
    "1RmcgranKmERmKjWN1wy451RPxa0xzZ7x": (5, 19),
    "1nDJgzoDQHw_668YEe2z1KWWcfb1dD0cv": (5, 20),
    # Mission 6 - Robot Cứu hộ
    "10KofI3-3nGWWeGMgF5OL8FG5TA4JomQa": (6, 1),
    "185rTalRhARxdsG4xrHylGqoFDjDsixil": (6, 2),
    "1WDFmLN-Pcg6VhuklwT-Y2qOw6Z-f5fAd": (6, 3),
    "1gpR5a-W1lki6zK9Zmat9W4vtCvkam4AS": (6, 4),
    "1Mk5MgIcAFtBiQAYPspyh8Rx3t-lxF1y4": (6, 5),
    "1UAKIcGH1V1taERFDuYMYbo4LRJ_fTc9z": (6, 6),
    "18FpmcvnIrH1lJ08h_aXeVSZLm1cOYDf0": (6, 7),
    "1WRQwmhgX7Wyk7uAdo8FaxLS3Dvi_NEe8": (6, 8),
    "1apO4aJ8kjyZxRbG6_FXKqKW1kAig9E8Y": (6, 9),
    "11bHakYsqZFhY9CnykWO5SRW2vMrKQYpb": (6, 10),
    "1aM9RCaX53tiHU-hZEko0x9xSrlf558zC": (6, 11),
    "1mw6zVQ8b44qNY1Swp_a63GOxJHhr9_TZ": (6, 12),
    "1BjBRLamoPoQaBd3G3II49fKgQdmVZHry": (6, 13),
    "1A5oQhEOhL0Cjfi0IvQ2cQIMEcO8tAbGM": (6, 14),
    "1RVD-04K85hGyo-_daqdXlKGl0j7JQq2t": (6, 15),
    "1oc8nesQmbLQUJmM8F6i7loO5dy0ypaqv": (6, 16),
    "1Vkd1lBn9tdZVfxrSCfyXW84_hOvr_6N2": (6, 17),
    "1WcapWWbCfJLPM7RuB6pc3EmX2emfvrcf": (6, 18),
    "1mwRJNlKA8w3cnvW5d8eteiT0ci4VD1tb": (6, 19),
    "1454psNUeD-UUVGvOELjy2gMq8pUJC0b9": (6, 20),
}

def extract_id_from_file(path):
    """Quickly read just the id field from a large JSON temp file."""
    with open(path, 'r') as f:
        chunk = f.read(200000)  # id field is near the end of JSON, read more
    # Try to find "id":"..." in the JSON
    m = re.search(r'"id"\s*:\s*"([^"]+)"', chunk)
    if m:
        return m.group(1)
    # Also try reading from the end
    with open(path, 'rb') as f:
        f.seek(0, 2)
        size = f.tell()
        f.seek(max(0, size - 200000))
        tail = f.read().decode('utf-8', errors='replace')
    m = re.search(r'"id"\s*:\s*"([^"]+)"', tail)
    return m.group(1) if m else None

def process_file(path, mission_id, question_num):
    output_path = f"{OUTPUT_DIR}/m{mission_id}-q{question_num:02d}.webp"
    if os.path.exists(output_path):
        print(f"SKIP (exists): {output_path}")
        return True

    with open(path, 'r') as f:
        # The content field is at the start - read enough of it
        raw = f.read(12_000_000)

    m = re.match(r'\{"content":"([A-Za-z0-9+/=\n]*)', raw)
    if not m:
        print(f"ERROR: No content in {path}")
        return False

    b64_svg = m.group(1).replace('\n', '')
    try:
        svg = base64.b64decode(b64_svg + '==').decode('utf-8', errors='replace')
    except Exception as e:
        print(f"ERROR decoding SVG: {e}")
        return False

    di = svg.find('data:image/png;base64,')
    offset = 22
    if di == -1:
        di = svg.find('data:image/jpeg;base64,')
        offset = 23
    if di == -1:
        print(f"ERROR: No embedded image in M{mission_id}Q{question_num}")
        return False

    end = svg.find('"', di + offset)
    if end == -1:
        end = svg.find("'", di + offset)
    if end == -1:
        print(f"ERROR: No end quote for image data in M{mission_id}Q{question_num}")
        return False

    img_b64 = svg[di + offset:end]
    try:
        img_data = base64.b64decode(img_b64 + '==')
    except Exception as e:
        print(f"ERROR decoding image: {e}")
        return False

    img = Image.open(io.BytesIO(img_data))
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    img.save(output_path, 'WEBP', quality=82, method=4)
    size_kb = os.path.getsize(output_path) / 1024
    print(f"OK: m{mission_id}-q{question_num:02d}.webp ({img.size[0]}x{img.size[1]}, {size_kb:.1f}KB)")
    return True

def main():
    pattern = f"{TOOL_RESULTS_DIR}/mcp-28aad2ce-085c-4a0e-b499-99426e77eaf1-download_file_content-*.txt"
    files = sorted(glob.glob(pattern))
    print(f"Found {len(files)} temp files")

    ok = 0
    skip = 0
    errors = []

    for path in files:
        file_id = extract_id_from_file(path)
        if not file_id:
            print(f"WARNING: Could not extract ID from {path}")
            continue

        if file_id not in FILE_ID_MAP:
            print(f"SKIP (unknown ID {file_id}): {os.path.basename(path)}")
            skip += 1
            continue

        mission_id, question_num = FILE_ID_MAP[file_id]
        output_path = f"{OUTPUT_DIR}/m{mission_id}-q{question_num:02d}.webp"

        if os.path.exists(output_path):
            print(f"SKIP (exists): m{mission_id}-q{question_num:02d}.webp")
            skip += 1
            continue

        success = process_file(path, mission_id, question_num)
        if success:
            ok += 1
        else:
            errors.append(f"M{mission_id}Q{question_num}")

    print(f"\nDone: {ok} processed, {skip} skipped, {len(errors)} errors")
    if errors:
        print(f"Errors: {errors}")

if __name__ == '__main__':
    main()
