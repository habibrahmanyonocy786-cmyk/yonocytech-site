'use client';

import { useState } from 'react';
import { GenerateImageRequest } from '@/lib/types';
import { getModelById, SAMPLING_METHODS } from '@/lib/models';

interface GeneratePanelProps {
  prompt: string;
  isGenerating: boolean;
  onGenerate: (params: Partial<GenerateImageRequest>) => void;
}

export default function GeneratePanel({
  prompt,
  isGenerating,
  onGenerate,
}: GeneratePanelProps) {
  const [steps, setSteps] = useState(20);
  const [cfgScale, setCfgScale] = useState(7);
  const [seed, setSeed] = useState(-1);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [samplingMethod, setSamplingMethod] = useState('euler_a');

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    
    onGenerate({
      steps,
      cfgScale,
      seed,
      width,
      height,
      samplingMethod,
    });
  };

  return (
    <div className="prompt-box">
      <div className="controls">
        <div className="control-group">
          <label>Steps</label>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            min={4}
            max={80}
          />
        </div>

        <div className="control-group">
          <label>CFG Scale</label>
          <input
            type="number"
            value={cfgScale}
            onChange={(e) => setCfgScale(Number(e.target.value))}
            min={1}
            max={20}
            step={0.5}
          />
        </div>

        <div className="control-group">
          <label>Seed (-1 for random)</label>
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Width</label>
          <select value={width} onChange={(e) => setWidth(Number(e.target.value))}>
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={768}>768</option>
            <option value={1024}>1024</option>
          </select>
        </div>

        <div className="control-group">
          <label>Height</label>
          <select value={height} onChange={(e) => setHeight(Number(e.target.value))}>
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={768}>768</option>
            <option value={1024}>1024</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sampling Method</label>
          <select
            value={samplingMethod}
            onChange={(e) => setSamplingMethod(e.target.value)}
          >
            {SAMPLING_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="generate-btn"
        onClick={handleSubmit}
        disabled={!prompt.trim() || isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </button>
    </div>
  );
}
