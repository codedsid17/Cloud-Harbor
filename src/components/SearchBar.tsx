import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Clock } from 'lucide-react';
import type { SearchHistoryItem } from '../types/weather';

interface SearchBarProps {
  onSearch: (city: string) => void;
  history: SearchHistoryItem[];
  onClearHistory: () => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, history, onClearHistory, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleHistoryClick = (city: string) => {
    onSearch(city);
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-30">
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div
          className="glass glass-shimmer rounded-full flex items-center pl-6 pr-2 py-2 transition-all"
          animate={{
            boxShadow: isFocused
              ? '0 20px 60px -10px rgba(140, 193, 233, 0.4), 0 0 0 1px rgba(140, 193, 233, 0.4)'
              : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          <Search className="w-5 h-5 text-white/60 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for a city..."
            className="flex-1 bg-transparent outline-none text-white placeholder-white/40 text-sm font-light py-2"
            disabled={isLoading}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="ml-2 px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-all"
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              'Search'
            )}
          </button>
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {isFocused && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-3 left-0 right-0 glass rounded-2xl overflow-hidden z-40"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">
                <Clock className="w-3 h-3" />
                Recent searches
              </div>
              <button
                onClick={onClearHistory}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Clear
              </button>
            </div>
            <ul className="py-2">
              {history.map((item) => (
                <li key={`${item.city}-${item.timestamp}`}>
                  <button
                    onClick={() => handleHistoryClick(item.city)}
                    className="w-full px-5 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-white/40" />
                    <span className="text-white/80 text-sm">{item.city}</span>
                    <span className="text-white/30 text-xs ml-auto">{item.country}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}