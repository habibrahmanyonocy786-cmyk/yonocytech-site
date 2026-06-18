// Local storage utilities for YonocyTech history

import { HistoryItem, GenerateImageRequest } from './types';

const STORAGE_KEY = 'yonocytech-history';

export function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    console.error('Failed to save history');
  }
}

export function addToHistory(request: GenerateImageRequest, imageUrl?: string): HistoryItem {
  const history = loadHistory();
  
  const item: HistoryItem = {
    id: crypto.randomUUID(),
    request,
    imageUrl,
    createdAt: Date.now(),
  };
  
  const newHistory = [item, ...history].slice(0, 50); // Keep last 50
  saveHistory(newHistory);
  
  return item;
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
