# Capi Career Simulator — Session Handover

**Branch:** `claude/elegant-cannon-Jw9t8`  
**Last merged PR:** #22 (all 120 illustrations)  
**Current working tree:** clean — no uncommitted changes

---

## What was completed this session

### Illustrations — 120/120 ✅
All `public/illos/m{n}-q{nn}.webp` are present (6 missions × 20 questions).  
Every file is 784 px wide, webp quality 88, resized from SVG or PNG source.

| Mission | Slug | Theme | Status |
|---------|------|-------|--------|
| M1 | blue-river (Smart Waste & Recycling) | ark-capi | 20/20 ✅ |
| M2 | happy-clinic (AI Healthcare) | ark-capi | 20/20 ✅ |
| M3 | smart-home | techno | 20/20 ✅ |
| M4 | auto-warehouse | techno | 20/20 ✅ |
| M5 | drone-delivery | techno | 20/20 ✅ |
| M6 | rescue-robot | ark-capi | 20/20 ✅ |

M1 Q15/Q17–19 sourced from 1440×1024 PNG exports (Drive, uploaded by user).  
M5 Q15/Q17–20 sourced from smaller alternative SVGs in the secondary "Kho vận" Drive folder.  
M6 Q01/Q02/Q14 sourced from 4500×3200 webp exports (Drive, uploaded by user).

---

## What is NOT yet done — open work

### 1. Design screens from Drive not integrated into the app

The user asked about this at end of session. None of the following are wired up:

#### Global screens (Phase 2 Drive root — all small/downloadable)

| File | Drive ID | Size | Purpose |
|------|----------|------|---------|
| `Sx4 (1) - Intro.svg` | `1hE2WTjNknTY6VCHg1iwoGI11UuF4pz1e` | 363 KB | Intro screen illustration |
| `Sx4 (1) - Mission select.svg` | `14ef_aYz6WwbgP0FP0vSU9ao_uXzREgdl` | 172 KB | Mission select illustration |

#### ARK-CAPI subfolder (Drive ID `1jujnWc3y7xb1lxb4UKabGnyi1gEVs5ZU`)

| File | Drive ID | Size | Purpose |
|------|----------|------|---------|
| `Sx4 (2) - CHIẾN DỊCH ARK-CAPI...svg` | `152jUYUWvv5U89QAsWZ9AYlCxJ5FOPTza` | 229 KB | Campaign title screen |
| `Ending.svg` | `1X-s0BQ42FBLZ2B-bZIRap6tsduUMwBbf` | **9.1 MB** | Ending/celebration screen |

> `Ending.svg` is too large for the Drive MCP tool (limit ≈6 MB). User must export as PNG or webp and re-upload, or provide directly.

#### Per-mission Transition Screens (2 panels each)

Each mission folder contains `Transition Screen.svg` (chapter start) and `Transition Screen-1.svg` (chapter mid-point or continuation). Downloadable ones marked ✓.

| Mission | Folder Drive ID | Screen | File ID | Size | DL? |
|---------|----------------|--------|---------|------|-----|
| M1 Smart Waste | `1OLn3tu4Um0Jd9slCyXYRUm-tOCAJYwVv` | Transition Screen.svg | `1ZhO7oo0QT2Gssg73UtpYMEEQICzeQ0IB` | 9.2 MB | ✗ |
| M1 Smart Waste | same | Transition Screen-1.svg | `1--_IoZ2ke9bf0foxD4ov6r2cVUcTkfZk` | 8.0 MB | ✗ |
| M2 Happy Clinic | `1qlGl2NbczkfIawn7K0hzgfBkGCfDx_kn` | Transition Screen.svg | `14KeGwIpnOjpQnAlNL72OZYhjaxlYtzGB` | 2.0 MB | ✓ |
| M2 Happy Clinic | same | Transition Screen-1.svg | `1UsoYZSBWSNMbJ6e4G-96c_NzKYPXVkVt` | 2.4 MB | ✓ |
| M3 Smart Home | `1VbF68dxCMdCsuzlPQgX3Z6tpX98iCBEr` | Transition Screen.svg | `1VUddQO_DnnIfhLUzRdYeSH3lRLjIYLPF` | 1.9 MB | ✓ |
| M3 Smart Home | same | Transition Screen-1.svg | `1igEwS35J75TqIhTdwsJkOG2B_XMkukW2` | 5.6 MB | ✓ |
| M4 Auto Warehouse | `1L0O_qAQh2dmlcH9njWovVlP7LWuv9Y8F` | Transition Screen-1.svg | `1i5W7YLjtoxHxswrVAnFP66LMJTTeJGNb` | 8.9 MB | ✗ |
| M4 Alt folder | `10kv2V4kUMZ9XnXQvh3ZqSUvFl9vJOIuc` | Transition Screen-1.svg | `1Ce59QPF5Q8yCPUhuS-LAHWZsA5OZISxo` | 2.7 MB | ✓ |
| M4 Alt folder | same | Transition Screen.svg | `1vsyHPRjFx6tu06BMHB-h3gTLt4qNFXXs` | 11.6 MB | ✗ |
| M5 Drone | (see note below) | — | — | — | unknown |
| M6 Rescue Robot | `1JGJTn_liKsmmfHAiZwdV5k_dQVLS-iCa` | Transition Screen.svg | `1XXdbQv2adr3w-nXYmsAuNtQwzENU8F8h` | 2.6 MB | ✓ |
| M6 Rescue Robot | same | Transition Screen-1.svg | `1Oi3DoJMpVRp3sY6kPUCLbq6bvPz9k-8f` | 3.0 MB | ✓ |

M5's primary Drive folder ID was not confirmed in this session (files are titled "Kho vận Tự hành" but live in the Drone folder — see FILEID_OVERRIDE in `/tmp/process_downloads.py`). Search `parentId = '<M5-folder-id>' and title contains 'Transition'` to find them.

For M1 + some M4/M5 transitions that are too large: ask user to export as PNG (same as they did for M1 Q15/17-19 and M6 Q01/02/14 illustrations).

---

### 2. Where these screens fit in the app

**App stage flow** (`src/App.jsx`):
```
intro → scan → role-reveal → theme → mission-pick → mission-play → reflect → certificate → history
```

| Screen asset | Recommended slot | Current implementation |
|---|---|---|
| `Sx4 (1) - Intro.svg` | `stage === 'intro'` (`src/components/scenes/Intro.jsx`) | Text + generated Capi avatar — no illustration |
| `Sx4 (1) - Mission select.svg` | `stage === 'mission-pick'` (`MissionPick.jsx`) | No hero illustration |
| `Sx4 (2) - ARK-CAPI campaign.svg` | `stage === 'theme'` or mission intro panel | Unused |
| `Ending.svg` | Inside `MissionPlay.jsx` → `stage === 'ending'` block | Capi cheer + plain text — no illustration |
| Per-mission `Transition Screen.svg` | Chapter transition moments in `MissionPlay.jsx` (between chapters) | `Transition.jsx` is only a CSS `fade-in` wrapper — no illustration |

**How to add an asset (standard pattern):**
1. Download SVG via Drive MCP → save to `/tmp/svgs/`
2. Convert: `cairosvg.svg2png(url, output_width=784)` → `Pillow.save('webp', quality=88, method=6)`
3. Place in `public/` (e.g. `public/screens/intro.webp`, `public/screens/m{n}-transition.webp`)
4. `<img src="/screens/intro.webp" …/>` in the relevant JSX scene

---

## Key files

| Path | Purpose |
|------|---------|
| `src/App.jsx` | Stage machine, all scene routing |
| `src/components/scenes/Intro.jsx` | Landing / auth screen |
| `src/components/scenes/Theme.jsx` | Theme picker (ark-capi vs techno) |
| `src/components/scenes/MissionPick.jsx` | Mission card grid |
| `src/components/scenes/MissionPlay.jsx` | Q&A loop + inline ending screen |
| `src/components/scenes/Transition.jsx` | CSS-only fade wrapper (no illustration) |
| `src/components/scenes/Certificate.jsx` | Final certificate screen |
| `src/data/missions.json` | All 6 missions with questions, chapters, options |
| `src/data/missionVisuals.js` | Per-mission palette + illo-key map (legacy named illos, not used for webp filenames) |
| `public/illos/m{n}-q{nn}.webp` | 120 question illustrations (all present) |

---

## Drive folder map

| Drive folder | ID |
|--------------|----|
| PHASE 2 root | `1OjGTbKVTohwVJiLPbsR_vtb1cNo7vXfD` |
| ARK-CAPI subfolder | `1jujnWc3y7xb1lxb4UKabGnyi1gEVs5ZU` |
| M1 Smart Waste | `1OLn3tu4Um0Jd9slCyXYRUm-tOCAJYwVv` |
| M2 Happy Clinic | `1qlGl2NbczkfIawn7K0hzgfBkGCfDx_kn` |
| M3 Smart Home | `1VbF68dxCMdCsuzlPQgX3Z6tpX98iCBEr` |
| M4 primary (large files) | `1L0O_qAQh2dmlcH9njWovVlP7LWuv9Y8F` |
| M4 alt (smaller files) | `10kv2V4kUMZ9XnXQvh3ZqSUvFl9vJOIuc` |
| M5 Drone (files titled as M4) | (look up via fileId override list) |
| M6 Rescue Robot | `1JGJTn_liKsmmfHAiZwdV5k_dQVLS-iCa` |

MCP Drive tool: `mcp__28aad2ce-085c-4a0e-b499-99426e77eaf1__download_file_content` — hard limit ≈6 MB raw file size (base64 overhead causes session expiry above this).

---

## Conversion script reference

`/tmp/process_downloads.py` — reads tool-result JSON files from the Drive MCP, decodes base64 SVG, writes to `/tmp/svgs/m{n}/q{nn}.svg`.

`/tmp/convert_svg.py` (or inline) — converts SVGs in `/tmp/svgs/` to webp using cairosvg + Pillow:
```python
from cairosvg import svg2png
from PIL import Image
import io

png = svg2png(url=str(svg_path), output_width=784)
img = Image.open(io.BytesIO(png)).convert('RGBA')
img.save(out_path, 'webp', quality=88, method=6)
```

For PNG inputs (already rasterised):
```python
img = Image.open(io.BytesIO(raw_bytes)).convert('RGBA')
w, h = img.size
img = img.resize((784, int(h * 784 / w)), Image.LANCZOS)
img.save(out_path, 'webp', quality=88, method=6)
```
