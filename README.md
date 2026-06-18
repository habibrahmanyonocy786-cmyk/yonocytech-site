# YonocyTech

YonocyTech is an AI image generation platform that runs locally using sd.cpp - no API key required.

## Features

- **Local Image Generation**: Runs entirely on your machine using sd.cpp
- **Zero Cost**: No paid APIs - completely free to use
- **Multiple Models**: Supports Z-Image, SD 1.5, SDXL models
- **History**: Saves your generation history locally
- **Fast & Private**: All generation happens locally, nothing sent to external servers

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build sd.cpp (Required)


Download and build sd.cpp from: https://github.com/AbdullahAlIbrahim/sd.cpp

Place the compiled binary at `local-helper/sd-cli/sd`

### 3. Start Local Helper

```bash
cd local-helper
node server.js
```

### 4. Start the Website

```bash
npm run dev
```


Open http://localhost:3000 in your browser.


## Usage


1. Enter a description of the image you want
2. Select a model (Z-Image Turbo for fast generation)
3. Adjust settings (steps, CFG scale, etc.)
4. Click "Generate Image"
5. Wait for generation to complete

## Architecture

```
+-------------+     HTTP      +--------------+
¦   Website   ¦ -------------? ¦Local Helper ¦
¦  (Next.js) ¦              ¦  (Node.js)  ¦
+-------------+              +--------------+
                                   ¦
                                   ?
                            +--------------+
                            ¦  sd.cpp   ¦
                            ¦ (binary)  ¦
                            +--------------+
```

The website can be deployed to Vercel/Netlify as static files. The local helper runs on your machine and handles actual image generation.

## Models

| Model | Type | Steps | Best For |
|-------|------|-------|----------|
| Z-Image Turbo | Z-Image | 8 | Fast generation |
| Z-Image Base | Z-Image | 50 | High quality |
| Dreamshaper 8 | SD 1.5 | 20 | Art/portraits |
| Realistic Vision | SD 1.5 | 25 | Photorealistic |
| SDXL Base | SDXL | 30 | High resolution |

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: CSS (dark theme)
- **Local Helper**: Node.js, Express
- **Image Engine**: sd.cpp

## License


MIT

## Credits

- sd.cpp: https://github.com/AbdullahAlIbrahim/sd.cpp
- Models from various HuggingFace repositories
