import { useState, useEffect, useCallback } from 'react';
import type { SearchHistoryItem } from '../types/weather';

const STORAGE_KEY = 'cloud-harbor-search-history';
const MAX_HISTORY = 5;

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to read search history', err);
    }
  }, []);

  const addToHistory = useCallback((city: string, country: string) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.city.toLowerCase() !== city.toLowerCase(),
      );
      const newHistory = [
        { city, country, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (err) {
        console.warn('Failed to save search history', err);
      }

      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear search history', err);
    }
  }, []);

  return { history, addToHistory, clearHistory };
}