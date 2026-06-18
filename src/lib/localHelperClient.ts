// Client for local helper server (sd.cpp runner)

import { GenerateImageRequest, GenerateImageResponse, LocalHelperCapabilities } from './types';

const LOCAL_HELPER_URL = 'http://localhost:3456';

export class LocalHelperClient {
  private baseUrl: string;

  constructor(baseUrl: string = LOCAL_HELPER_URL) {
    this.baseUrl = baseUrl;
  }

  async getCapabilities(): Promise<LocalHelperCapabilities | null> {
    try {
      const response = await fetch(`${this.baseUrl}/capabilities`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  async generateImage(
    request: GenerateImageRequest
  ): Promise<{ requestId: string } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  async pollStatus(requestId: string): Promise<GenerateImageResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/status?requestId=${requestId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  async cancelGeneration(requestId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const localHelperClient = new LocalHelperClient();
