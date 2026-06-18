'use client';

import { useState, useEffect } from 'react';
import PromptBox from '@/components/PromptBox';
import ModelPicker from '@/components/ModelPicker';
import GeneratePanel from '@/components/GeneratePanel';
import HistoryPanel from '@/components/HistoryPanel';
import { GenerateImageRequest, HistoryItem } from '@/lib/types';
import { loadHistory, saveHistory } from '@/lib/storage';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('z-image-turbo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = loadHistory();
    setHistory(saved);
  }, []);

  const handleGenerate = async (params: Partial<GenerateImageRequest>) => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const request: GenerateImageRequest = {
        modelId: selectedModel,
        prompt,
        negativePrompt,
        steps: params.steps || 20,
        cfgScale: params.cfgScale || 7,
        seed: params.seed || -1,
        width: params.width || 512,
        height: params.height || 512,
        samplingMethod: params.samplingMethod || 'euler_a',
      };
      
      const newHistory = [{
        id: crypto.randomUUID(),
        request,
        createdAt: Date.now(),
      }, ...history];
      
      setHistory(newHistory);
      saveHistory(newHistory);
      setPrompt('');
      setNegativePrompt('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main>
      <header>
        <h1>YonocyTech</h1>
        <p className="subtitle">AI Image Generation - No API Required</p>
      </header>

      <PromptBox
        prompt={prompt}
        onPromptChange={setPrompt}
        negativePrompt={negativePrompt}
        onNegativePromptChange={setNegativePrompt}
      />

      <ModelPicker
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
      />

      <GeneratePanel
        prompt={prompt}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
      />

      <HistoryPanel history={history} />
    </main>
  );
}
