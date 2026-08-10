import React from 'react';
import { HistoryItem } from '../types';
import { Youtube, Instagram, Trash2, ArrowUpRight } from 'lucide-react';

interface RecentHistoryProps {
  history: HistoryItem[];
  onSelect: (url: string) => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  history,
  onSelect,
  onClear,
  onRemove,
}) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 glass-panel rounded-2xl p-5 border border-gray-800/80 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/80">
        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <span>Downloads recentes</span>
          <span className="bg-brand-900/60 text-brand-400 text-xs px-2 py-0.5 rounded-full border border-brand-700/40 font-mono">
            {history.length}
          </span>
        </h4>

        <button
          onClick={onClear}
          className="text-xs font-semibold text-gray-400 hover:text-red-400 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-red-950/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar histórico</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.url)}
            className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-gray-900/40 hover:bg-gray-800/80 border border-gray-800/50 hover:border-brand-500/40 cursor-pointer transition-all duration-200"
          >
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover bg-gray-800 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                {item.platform === 'youtube' ? (
                  <Youtube className="w-5 h-5 text-red-500" />
                ) : (
                  <Instagram className="w-5 h-5 text-pink-500" />
                )}
              </div>
            )}

            <div className="flex-1 min-w-0 pr-12">
              <p className="text-xs font-semibold text-gray-200 group-hover:text-brand-300 truncate">
                {item.title || item.url}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                {item.platform === 'youtube' ? (
                  <span className="text-red-400 font-medium">YouTube</span>
                ) : (
                  <span className="text-pink-400 font-medium">Instagram</span>
                )}
                <span>•</span>
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id);
                }}
                title="Remover este item"
                className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-brand-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
