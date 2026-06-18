// Model catalog for YonocyTech (sd.cpp compatible models)

import { YonocyModel } from './types';

export const LOCAL_MODELS: YonocyModel[] = [
  {
    id: 'z-image-turbo',
    name: 'Z-Image Turbo',
    type: 'z-image',
    description: 'WaveSpeed featured local model - 6B params, ultra-fast 8-step generation',
    provider: 'sdcpp',
    defaultSteps: 8,
    defaultGuidance: 1.0,
    aspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    tags: ['turbo', 'fast', 'local', 'featured'],
  },
  {
    id: 'z-image-base',
    name: 'Z-Image Base',
    type: 'z-image',
    description: 'Full-quality 6B parameter model - higher detail, 50-step generation',
    provider: 'sdcpp',
    defaultSteps: 50,
    defaultGuidance: 7.5,
    aspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    tags: ['high-quality', 'local', 'detailed'],
  },
  {
    id: 'dreamshaper-8',
    name: 'Dreamshaper 8',
    type: 'sd15',
    description: 'Versatile SD 1.5 model - great for portraits, landscapes, and artistic styles',
    provider: 'sdcpp',
    defaultSteps: 20,
    defaultGuidance: 7.5,
    aspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    tags: ['photorealistic', 'artistic', 'versatile'],
  },
  {
    id: 'realistic-vision-v51',
    name: 'Realistic Vision v5.1',
    type: 'sd15',
    description: 'Highly photorealistic people and scenes, based on SD 1.5',
    provider: 'sdcpp',
    defaultSteps: 25,
    defaultGuidance: 7,
    aspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    tags: ['photorealistic', 'portraits', 'people'],
  },
  {
    id: 'anything-v5',
    name: 'Anything v5',
    type: 'sd15',
    description: 'High quality anime and illustration style image generation',
    provider: 'sdcpp',
    defaultSteps: 20,
    defaultGuidance: 7,
    aspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    tags: ['anime', 'illustration', 'artistic'],
  },
  {
    id: 'stable-diffusion-xl-base',
    name: 'SDXL Base 1.0',
    type: 'sdxl',
    description: 'Official Stable Diffusion XL base model - higher resolution, excellent quality',
    provider: 'sdcpp',
    defaultSteps: 30,
    defaultGuidance: 7.5,
    aspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    tags: ['sdxl', 'high-quality', 'versatile'],
  },
];

export function getModelById(id: string): YonocyModel | undefined {
  return LOCAL_MODELS.find(m => m.id === id);
}

export const SAMPLING_METHODS = [
  'euler_a',
  'euler',
  'dpm_2m',
  'dpm_2m_karras',
  'dpm_sde',
  'dpm_sde_karras',
  'ddim',
  'uni_pc',
];
