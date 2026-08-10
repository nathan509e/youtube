import { useState, useEffect } from 'react';
import { HistoryItem } from '../types';

const STORAGE_KEY = 'videodrop_recent_history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to write history to localStorage:', e);
    }
  }, [history]);

  const addHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistory((prev) => {
      // Avoid duplicate URLs
      const filtered = prev.filter((h) => h.url !== item.url);
      const newItem: HistoryItem = {
        ...item,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };
      return [newItem, ...filtered].slice(0, 6);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const removeHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return { history, addHistory, clearHistory, removeHistory };
}
