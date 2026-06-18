'use client';

import { useState, useEffect } from 'react';

interface PromptBoxProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  negativePrompt: string;
  onNegativePromptChange: (negativePrompt: string) => void;
}

export default function PromptBox({
  prompt,
  onPromptChange,
  negativePrompt,
  onNegativePromptChange,
}: PromptBoxProps) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(prompt.length);
  }, [prompt]);

  return (
    <div className="prompt-box">
      <textarea
        placeholder="Describe the image you want..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        maxLength={500}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          {charCount}/500
        </span>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <textarea
          placeholder="What you don't want in the image... (optional)"
          value={negativePrompt}
          onChange={(e) => onNegativePromptChange(e.target.value)}
          style={{ minHeight: '60px' }}
        />
      </div>
    </div>
  );
}
