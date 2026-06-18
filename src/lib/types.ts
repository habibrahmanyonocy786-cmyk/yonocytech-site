// Type definitions for YonocyTech

export interface YonocyModel {
  id: string;
  name: string;
  type: 'sd15' | 'sdxl' | 'z-image';
  description: string;
  provider: 'sdcpp' | 'wan2gp';
  defaultSteps: number;
  defaultGuidance: number;
  aspectRatios: string[];
  tags: string[];
}

export interface GenerateImageRequest {
  modelId: string;
  prompt: string;
  negativePrompt?: string;
  steps: number;
  cfgScale: number;
  seed: number;
  width: number;
  height: number;
  samplingMethod: string;
  extra?: Record<string, unknown>;
}

export interface GenerateImageResponse {
  requestId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  imageDataUrl?: string;
  imageUrl?: string;
  error?: string;
}

export interface LocalHelperCapabilities {
  supported: {
    models: string[];
    samplingMethods: string[];
  };
  engine: 'sd.cpp';
  version: string;
}

export interface HistoryItem {
  id: string;
  request: GenerateImageRequest;
  imageUrl?: string;
  createdAt: number;
}
