// Local Helper Server - Wraps sd.cpp for image generation
// Run with: node server.js

const http = require('http');
const { execFile } = require('child_process');
const path = require('path');

const PORT = 3456;

// In-memory storage for requests
const requests = new Map();

const CAPABILITIES = {
  supported: {
    models: [
      'z-image-turbo',
      'z-image-base',
      'dreamshaper-8',
      'realistic-vision-v51',
      'anything-v5',
      'stable-diffusion-xl-base',
    ],
    samplingMethods: [
      'euler_a',
      'euler',
      'dpm_2m',
      'dpm_2m_karras',
      'dpm_sde',
      'dpm_sde_karras',
      'ddim',
      'uni_pc',
    ],
  },
  engine: 'sd.cpp',
  version: '1.0.0',
};

function createRequestId() {
  return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateWithSdCpp(params) {
  return new Promise((resolve, reject) => {
    const { prompt, negativePrompt, steps, cfgScale, seed, width, height, samplingMethod } = params;
    
    // Build sd-cli command
    const args = [
      '-p', prompt,
      '-s', steps.toString(),
      '--cfg-scale', cfgScale.toString(),
      '-W', width.toString(),
      '-H', height.toString(),
      '-o', './output.png',
    ];
    
    if (negativePrompt) {
      args.push('-n', negativePrompt);
    }
    
    if (seed >= 0) {
      args.push('--seed', seed.toString());
    }
    
    if (samplingMethod) {
      args.push('-m', samplingMethod);
    }
    
    // Execute sd-cli
    const sdCli = path.join(__dirname, 'sd-cli', 'sd');
    
    execFile(sdCli, args, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`sd-cli error: ${error.message}`));
        return;
      }
      
      resolve({ imagePath: './output.png' });
    });
  });
}


const server = http.createServer(async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // GET /capabilities
  if (req.method === 'GET' && pathname === '/capabilities') {
    res.writeHead(200, headers);
    res.end(JSON.stringify(CAPABILITIES));
    return;
  }

  // POST /generate
  if (req.method === 'POST' && pathname === '/generate') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });
    
    req.on('end', async () => {
      try {
        const params = JSON.parse(body);
        const requestId = createRequestId();
        
        requests.set(requestId, {
          id: requestId,
          params,
          status: 'running',
          createdAt: Date.now(),
        });

        res.writeHead(200, headers);
        res.end(JSON.stringify({ requestId }));

        // Run generation in background
        try {
          await generateWithSdCpp(params);
          
          const reqData = requests.get(requestId);
          if (reqData) {
            reqData.status = 'completed';
          }
        } catch (err) {
          const reqData = requests.get(requestId);
          if (reqData) {
            reqData.status = 'failed';
            reqData.error = err.message;
          }
        }
      } catch (err) {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    
    return;
  }

  // GET /status
  if (req.method === 'GET' && pathname === '/status') {
    const requestId = url.searchParams.get('requestId');
    
    if (!requestId) {
      res.writeHead(400, headers);
      res.end(JSON.stringify({ error: 'Missing requestId' }));
      return;
    }

    const requestData = requests.get(requestId);
    
    if (!requestData) {
      res.writeHead(404, headers);
      res.end(JSON.stringify({ error: 'Request not found' }));
      return;
    }

    res.writeHead(200, headers);
    res.end(JSON.stringify({
      requestId: requestData.id,
      status: requestData.status,
      error: requestData.error,
    }));
    return;
  }

  // 404 for other routes
  res.writeHead(404, headers);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Local Helper Server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET  /capabilities - Get supported models and methods');
  console.log('  POST /generate   - Generate image');
  console.log('  GET  /status      - Poll generation status');
});
