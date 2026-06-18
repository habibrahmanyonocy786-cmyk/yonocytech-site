# Local Helper Server

This server wraps sd.cpp for local image generation without needing a paid API key.

## Prerequisites

1. Download and build sd.cpp from: https://github.com/AbdullahAlIbrahim/sd.cpp
2. Place the compiled `sd` binary in `local-helper/sd-cli/`

## Running

```bash
cd local-helper
node server.js
```

The server will start on http://localhost:3456

## API Endpoints

### GET /capabilities
Returns supported models and sampling methods.

### POST /generate
Generate an image.

Request body:
```json
{
  "modelId": "z-image-turbo",
  "prompt": "A beautiful sunset over mountains",
  "negativePrompt": "blurry, low quality",
  "steps": 20,
  "cfgScale": 7,
  "seed": -1,
  "width": 512,
  "height": 512,
  "samplingMethod": "euler_a"
}
```

Response:
```json
{
  "requestId": "req_123456789"
}
```

### GET /status?requestId=...
Poll generation status.

Response:
```json
{
  "requestId": "req_123456789",
  "status": "running|completed|failed",
  "error": "..."
}
```

## Architecture

The website (Next.js frontend) connects to this local helper via HTTP. This allows:
- Running the website on Vercel/Netlify (static hosting)
- Image generation happens locally on user's machine
- No API keys or paid services required
