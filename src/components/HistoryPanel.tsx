'use client';

import { HistoryItem } from '@/lib/types';
import { getModelById } from '@/lib/models';

interface HistoryPanelProps {
  history: HistoryItem[];
}

export default function HistoryPanel({ history }: HistoryPanelProps) {
  if (!history.length) {
    return (
      <div className="status">
        <p>No images generated yet</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Enter a prompt and click Generate to start
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>Generation History</h2>
      <div className="gallery">
        {history.map((item) => {
          const model = getModelById(item.request.modelId);
          
          return (
            <div key={item.id} className="image-card">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.request.prompt} />
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--muted)',
                  }}
                >
                  Generating...
                </div>
              )}
              <div className="image-info">
                <p>{item.request.prompt}</p>
                <p style={{ marginTop: '0.25rem' }}>
                  {model?.name} - {item.request.steps} steps
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
