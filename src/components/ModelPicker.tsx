'use client';

import { LOCAL_MODELS } from '@/lib/models';

interface ModelPickerProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

export default function ModelPicker({
  selectedModel,
  onModelSelect,
}: ModelPickerProps) {
  return (
    <div className="model-picker">
      {LOCAL_MODELS.map((model) => (
        <div
          key={model.id}
          className={`model-card ${selectedModel === model.id ? 'selected' : ''}`}
          onClick={() => onModelSelect(model.id)}
        >
          <div className="model-name">{model.name}</div>
          <div className="model-desc">{model.description}</div>
        </div>
      ))}
    </div>
  );
}
