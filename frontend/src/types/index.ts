export type PlatformType = 'youtube' | 'instagram';

export interface FormatOption {
  id: string;
  quality: string;
  container: string;
  hasVideo: boolean;
  hasAudio: boolean;
  filesize?: string;
  url?: string;
}

export interface VideoInfoResponse {
  success: boolean;
  platform: PlatformType;
  title: string;
  thumbnail: string;
  duration: number; // seconds
  author: string;
  url: string;
  formats: FormatOption[];
  audioAvailable?: boolean;
  error?: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  platform: PlatformType;
  timestamp: number;
}

export type ProcessingStep = 1 | 2 | 3; // 1: Analisando link, 2: Encontrando vídeo, 3: Preparando arquivo
