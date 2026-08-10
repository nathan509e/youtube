import React from 'react';
import { Youtube, Instagram, Film, Video } from 'lucide-react';

export const PlatformBadges: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-gray-300">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-800/40 text-red-300">
        <Youtube className="w-4 h-4 text-red-500" />
        <span>YouTube</span>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-800/40 text-red-300">
        <Film className="w-4 h-4 text-red-400" />
        <span>YouTube Shorts</span>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-950/40 border border-pink-800/40 text-pink-300">
        <Instagram className="w-4 h-4 text-pink-400" />
        <span>Instagram Reel</span>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-950/40 border border-pink-800/40 text-pink-300">
        <Video className="w-4 h-4 text-pink-400" />
        <span>Instagram Post</span>
      </div>
    </div>
  );
};
