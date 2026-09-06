[**Rajmoni | Motion Designer** (@Nexaabyraj)](https://x.com/Nexaabyraj) — [original tweet](https://x.com/Nexaabyraj/status/2095778373431968166)

> Astra still can't do motion design like me .

So Astra made this ChatGPT-themed response in **Hyperframes**. Here are the source, raw reference, assets, and render commands so you can inspect the process and reproduce the video yourself.

**Credit and method:** Rajmoni created the original motion design. This project adapts that supplied reference: 180 text-cleared source frames preserve its backgrounds and control animations, while JavaScript renders the replacement ChatGPT typography. The result is a reference-based adaptation, not original motion invented from scratch. The finished MP4 is a comparison artifact; the renderer does not play or transcode that file to produce its output.

[Watch the included final video](examples/chatgpt-blue.mp4) · [Raw reference](reference/original.mp4) · [Frame analysis](docs/frame-analysis.md) · [Verified reproduction](docs/reproduction-verification.json)

![Scene contact sheet](docs/contact-sheet.jpg)

## Render it

Requires Node.js 22+ (tested with 25.5.0), FFmpeg/FFprobe with libx264, Chrome, and at least 1 GB free space. macOS, Linux and Windows can run Hyperframes. The delivered render was made on macOS; see the reproducibility notes below.

```sh
git clone https://github.com/Tejashmakwana/astra-chatgpt-hyperframes.git
cd astra-chatgpt-hyperframes
npm ci --ignore-scripts
```

Read [Switzer's Fontshare license](https://www.fontshare.com/licenses/itf-ffl), then download the exact hashed font from its official CDN:

```sh
npm run setup -- --accept-font-license
npm run check
npm run render
```

The result is **`output/chatgpt-blue.mp4`**. Run `npm run compare` to compare its decoded frames against the included delivered video. A fresh install and render on the recorded macOS environment produced a **byte-for-byte identical MP4**, documented in the linked verification report. Rendering is local. No model API, API key, private prompts, or agent tooling is needed.

If Chrome is not installed, run `npx hyperframes browser ensure` first. An existing browser can be selected using `HYPERFRAMES_BROWSER_PATH`. Set `FFmpeg` and `FFprobe` on your system PATH. `npm run preview` opens the editable composition in Hyperframes Studio.

## Render on GitHub

Fork this repository, open **Actions → Render video → Run workflow**, and accept the linked font license if you agree to its terms. Download `chatgpt-blue-render` from the finished run. The Linux workflow renders the same composition; use the reproducibility notes below when comparing exact pixels.

## What runs

1. Verify hashes of the 180 source plates, audio, raw reference and comparison video, plus the separately downloaded font.
2. Run the HTML/canvas composition through Hyperframes 0.8.29, rendering 360 lossless PNG frames.
3. Encode H.264 at 1920×1080, 24 fps with explicit BT.709 conversion.
4. Copy the original AAC packets and verify the full decode, frame count and audio hash.

The 15-second video consists of two identical 7.5-second visual loops. The original audio continues to 15.061 seconds. Output validation is saved to `output/verification.json`.

## Source map

| File | Purpose |
| --- | --- |
| `index.html` | Hyperframes composition, dimensions and audio track |
| `film.js` | Editable title, prompt and results typography; frame seeking |
| `assets/tracks.js` | Per-frame positions measured from the reference |
| `assets/plates/*.png` | Cleaned source backgrounds and controls |
| `assets/reference.m4a` | Reference soundtrack, copied without re-encoding |
| `reference/original.mp4` | Supplied reference used to build the plates |
| `scripts/build-reference-plates.py` | Inspectable plate cleanup and motion tracking |
| `scripts/render.mjs` | Actual Hyperframes render and FFmpeg encode |
| `examples/chatgpt-blue.mp4` | Delivered comparison video; never used as render input |

To regenerate the cleaned plates, install the optional Python dependencies and run:

```sh
python3 -m pip install -r requirements.txt
python3 scripts/build-reference-plates.py
```

The committed plates are the reproducible baseline. Regenerating them with different image-library versions may change PNG hashes; asset validation intentionally detects that.

## Reproducibility and attribution

Dependencies and the font hash are pinned. The committed assets and timing reproduce this composition. Browser versions, operating-system font rasterization, the system monospace font in the initial prompt, and FFmpeg builds can change individual pixels or encoded bytes. This repository does not promise a byte-identical MP4 on every OS. The included comparison video and verification report let you check the result rather than relying on a claim.

Original motion/reference: **Rajmoni / @Nexaabyraj**, linked above. Switzer is by **Jeremie Hornus / Indian Type Foundry**, supplied through Fontshare. The font is downloaded separately and is not redistributed in this repository. ChatGPT/OpenAI names remain their respective owners' trademarks. This is an independent experiment, not an official OpenAI release or an endorsement by the reference designer.

The tweet quotation above is transcribed from the project brief and linked to its source. Media and source-derived plates retain their original owners' rights; attribution does not grant a new license to those assets. See [THIRD_PARTY.md](THIRD_PARTY.md).
