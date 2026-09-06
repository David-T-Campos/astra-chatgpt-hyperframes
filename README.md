[**Rajmoni | Motion Designer** (@Nexaabyraj)](https://x.com/Nexaabyraj) — [original tweet](https://x.com/Nexaabyraj/status/2095778373431968166)

This repository adapts Rajmoni's supplied motion reference into an **ARGUS Engineer** Hyperframes composition while preserving the original motion, plate timing, soundtrack, and control animation as closely as possible.

**ARGUS Engineer** is presented here as an autonomous engineering system: give it something to engineer, the constraints it must satisfy, and the bar it must meet; it gets to work with engineering tools, simulation, iteration, and verification.

**Credit and method:** Rajmoni created the original motion design. This project adapts that supplied reference: 180 text-cleared source frames preserve its backgrounds and control animations, while JavaScript renders replacement ARGUS Engineer typography. The result is a reference-based adaptation, not original motion invented from scratch. The included original comparison MP4 remains reference material only; the renderer does not play or transcode that file to produce the ARGUS Engineer output.

[Original comparison video](examples/chatgpt-blue.mp4) · [Raw reference](reference/original.mp4) · [Frame analysis](docs/frame-analysis.md) · [Original reproduction verification](docs/reproduction-verification.json)

![Scene contact sheet](docs/contact-sheet.jpg)

## Render it

Requires Node.js 22+ (tested with 25.5.0), FFmpeg/FFprobe with libx264, Chrome, and at least 1 GB free space. macOS, Linux and Windows can run Hyperframes.

```sh
git clone https://github.com/David-T-Campos/astra-chatgpt-hyperframes.git
cd astra-chatgpt-hyperframes
npm ci --ignore-scripts
```

Read [Switzer's Fontshare license](https://www.fontshare.com/licenses/itf-ffl), then download the exact hashed font from its official CDN:

```sh
npm run setup -- --accept-font-license
npm run check
npm run render
```

The result is **`output/argus-engineer.mp4`**.

If Chrome is not installed, run `npx hyperframes browser ensure` first. An existing browser can be selected using `HYPERFRAMES_BROWSER_PATH`. Set `FFmpeg` and `FFprobe` on your system PATH. `npm run preview` opens the editable composition in Hyperframes Studio.

## Render on GitHub

Open **Actions → Render ARGUS Engineer video → Run workflow**, accept the linked font license if you agree to its terms, and download the **`argus-engineer-render`** artifact from the finished run.

## What changed from the ChatGPT adaptation

The animation structure is intentionally preserved. The editable text layer now presents ARGUS Engineer instead of ChatGPT:

- **ARGUS Engineer** replaces the opening ChatGPT identity.
- The prompt becomes an engineering brief: **"Design a 30 m pedestrian bridge."**
- The positioning changes from general AI assistance to **autonomous engineering for the physical world**.
- The result sequence focuses on real constraints, engineering tools, simulation, iteration, and independent verification.
- The final lockup is **ARGUS Engineer.**

The reference plates, motion tracking, timing, and soundtrack are left intact so the adaptation remains as close as possible to the original visual piece.

## What runs

1. Verify hashes of the 180 source plates, audio, raw reference and comparison video, plus the separately downloaded font.
2. Run the HTML/canvas composition through Hyperframes 0.8.29, rendering 360 lossless PNG frames.
3. Encode H.264 at 1920×1080, 24 fps with explicit BT.709 conversion.
4. Copy the original AAC packets and verify the full decode, frame count and audio hash.

The 15-second video consists of two identical 7.5-second visual loops. The original audio continues to 15.061 seconds. Output validation is saved to `output/verification.json`.

## Source map

| File | Purpose |
| --- | --- |
| `index.html` | ARGUS Engineer Hyperframes composition, dimensions and audio track |
| `film.js` | Editable ARGUS Engineer title, prompt and results typography; frame seeking |
| `assets/tracks.js` | Per-frame positions measured from the reference |
| `assets/plates/*.png` | Cleaned source backgrounds and controls |
| `assets/reference.m4a` | Reference soundtrack, copied without re-encoding |
| `reference/original.mp4` | Supplied reference used to build the plates |
| `scripts/build-reference-plates.py` | Inspectable plate cleanup and motion tracking |
| `scripts/render.mjs` | Actual Hyperframes render and FFmpeg encode |
| `examples/chatgpt-blue.mp4` | Original delivered comparison video; never used as render input |

To regenerate the cleaned plates, install the optional Python dependencies and run:

```sh
python3 -m pip install -r requirements.txt
python3 scripts/build-reference-plates.py
```

The committed plates are the reproducible baseline. Regenerating them with different image-library versions may change PNG hashes; asset validation intentionally detects that.

## Reproducibility and attribution

Dependencies and the font hash are pinned. Browser versions, operating-system font rasterization, the system monospace font in the prompt, and FFmpeg builds can change individual pixels or encoded bytes.

Original motion/reference: **Rajmoni / @Nexaabyraj**, linked above. Switzer is by **Jeremie Hornus / Indian Type Foundry**, supplied through Fontshare. The font is downloaded separately and is not redistributed in this repository. ChatGPT/OpenAI names in the retained historical reference materials remain their respective owners' trademarks. ARGUS Engineer is the replacement product identity used by this adaptation.

The source-derived media retain their original owners' rights; attribution does not grant a new license to those assets. See [THIRD_PARTY.md](THIRD_PARTY.md).
