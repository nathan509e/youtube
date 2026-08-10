import React, { useState } from 'react';
import { Download, Clipboard, Youtube, Instagram, Link2 } from 'lucide-react';
import { detectPlatformFromUrl } from '../utils/formatters';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const detectedPlatform = detectPlatformFromUrl(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="glass-input rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-2xl shadow-indigo-950/20 transition-all duration-200">
          
          {/* Input container with icon */}
          <div className="flex-1 flex items-center gap-3 px-3 min-h-[52px]">
            {detectedPlatform === 'youtube' && (
              <Youtube className="w-6 h-6 text-red-500 shrink-0 animate-fade-in" />
            )}
            {detectedPlatform === 'instagram' && (
              <Instagram className="w-6 h-6 text-pink-500 shrink-0 animate-fade-in" />
            )}
            {detectedPlatform === 'unknown' && (
              <Link2 className="w-5 h-5 text-gray-400 shrink-0" />
            )}

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Cole o link do YouTube ou Instagram aqui..."
              disabled={isLoading}
              className="w-full bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-base sm:text-lg font-medium"
            />

            {/* Quick paste button */}
            {!url && (
              <button
                type="button"
                onClick={handlePaste}
                title="Colar da área de transferência"
                className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-700/80 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Colar</span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="gradient-button text-white font-semibold text-base sm:text-lg px-6 py-3.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Download className="w-5 h-5" />
            <span>Baixar vídeo</span>
          </button>
        </div>
      </div>
    </form>
  );
};
