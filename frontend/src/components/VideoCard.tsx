import React, { useState } from 'react';
import { VideoInfoResponse } from '../types';
import { formatDuration, formatQualityLabel } from '../utils/formatters';
import { triggerFileDownload } from '../services/api';
import { Youtube, Instagram, Clock, User, Download, Music, Sparkles } from 'lucide-react';

interface VideoCardProps {
  info: VideoInfoResponse;
}

export const VideoCard: React.FC<VideoCardProps> = ({ info }) => {
  const [selectedQuality, setSelectedQuality] = useState<string>(
    info.formats[0]?.id || 'highest'
  );
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDownloadVideo = () => {
    setDownloading(true);
    triggerFileDownload(info.url, selectedQuality, 'video', info.title);
    setTimeout(() => setDownloading(false), 3000);
  };

  const handleDownloadAudio = () => {
    setDownloading(true);
    triggerFileDownload(info.url, 'highestaudio', 'audio', info.title);
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 glass-panel rounded-3xl overflow-hidden border border-gray-800/80 shadow-2xl animate-slide-up">
      <div className="flex flex-col sm:flex-row">
        
        {/* Thumbnail Preview */}
        <div className="sm:w-2/5 relative aspect-video sm:aspect-auto bg-gray-900 overflow-hidden group">
          {info.thumbnail ? (
            <img
              src={info.thumbnail}
              alt={info.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
              Sem Thumbnail
            </div>
          )}

          {/* Badge Platform on Thumbnail */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-semibold text-white">
            {info.platform === 'youtube' ? (
              <>
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube</span>
              </>
            ) : (
              <>
                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                <span>Instagram</span>
              </>
            )}
          </div>

          {/* Duration Badge */}
          {info.duration > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-xs font-mono font-medium text-white">
              <Clock className="w-3 h-3 text-gray-300" />
              <span>{formatDuration(info.duration)}</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-5">
          
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug line-clamp-2">
              {info.title}
            </h3>

            <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-400">
              <User className="w-3.5 h-3.5 text-brand-400" />
              <span className="truncate">{info.author}</span>
            </div>
          </div>

          {/* Quality Selector */}
          {info.formats && info.formats.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Escolha a qualidade:
              </label>

              <div className="flex flex-wrap gap-2">
                {info.formats.map((fmt) => {
                  const isSelected = selectedQuality === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setSelectedQuality(fmt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 scale-105'
                          : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700/50'
                      }`}
                    >
                      {formatQualityLabel(fmt.quality)}
                      {fmt.filesize && <span className="ml-1 opacity-75">({fmt.filesize})</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Download Buttons */}
          <div className="pt-2 border-t border-gray-800/80 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadVideo}
              disabled={downloading}
              className="flex-1 gradient-button py-2.5 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Baixar MP4</span>
            </button>

            {info.audioAvailable && (
              <button
                onClick={handleDownloadAudio}
                disabled={downloading}
                className="py-2.5 px-4 rounded-xl font-semibold text-sm bg-gray-800/90 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700/60 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Music className="w-4 h-4 text-emerald-400" />
                <span>Baixar áudio</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
