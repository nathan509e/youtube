import ytdl from '@distube/ytdl-core';
import ytDlp, { exec as ytDlpExec } from 'yt-dlp-exec';
import { ENV } from '../config/env.js';

export interface VideoFormatOption {
  id: string;
  quality: string;
  container: string;
  hasVideo: boolean;
  hasAudio: boolean;
  filesize?: string;
  url?: string;
}

export interface VideoMetadata {
  success: boolean;
  platform: 'youtube' | 'instagram';
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  author: string;
  url: string;
  formats: VideoFormatOption[];
  audioAvailable: boolean;
}

export async function getYoutubeMetadata(url: string): Promise<VideoMetadata> {
  // Try yt-dlp first
  try {
    const data: any = await ytDlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
    });

    if (data && data.title) {
      const duration = Math.floor(data.duration || 0);
      if (duration > ENV.MAX_VIDEO_DURATION) {
        const maxMinutes = Math.floor(ENV.MAX_VIDEO_DURATION / 60);
        throw {
          status: 400,
          userMessage: `O vídeo excede a duração máxima permitida de ${maxMinutes} minutos.`,
        };
      }

      const title = data.title || 'Vídeo sem título';
      const author = data.uploader || data.channel || 'Autor desconhecido';
      const thumbnail = data.thumbnail || (data.thumbnails && data.thumbnails[data.thumbnails.length - 1]?.url) || '';

      // Standard qualities to display up to 1080p
      const qualitiesOrder = ['1080p', '720p', '480p', '360p', '240p', '144p'];
      const rawFormats = data.formats || [];
      const availableMap = new Map<string, VideoFormatOption>();

      for (const fmt of rawFormats) {
        let heightLabel = fmt.height ? `${fmt.height}p` : undefined;
        if (!heightLabel && fmt.format_note) {
          if (fmt.format_note.includes('1080')) heightLabel = '1080p';
          else if (fmt.format_note.includes('720')) heightLabel = '720p';
          else if (fmt.format_note.includes('480')) heightLabel = '480p';
          else if (fmt.format_note.includes('360')) heightLabel = '360p';
          else if (fmt.format_note.includes('240')) heightLabel = '240p';
          else if (fmt.format_note.includes('144')) heightLabel = '144p';
        }

        if (heightLabel && qualitiesOrder.includes(heightLabel)) {
          if (!availableMap.has(heightLabel)) {
            const sizeInBytes = fmt.filesize || fmt.filesize_approx;
            availableMap.set(heightLabel, {
              id: heightLabel,
              quality: heightLabel,
              container: 'mp4',
              hasVideo: true,
              hasAudio: true,
              filesize: sizeInBytes
                ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
                : undefined,
            });
          }
        }
      }

      const sortedFormats: VideoFormatOption[] = [];
      for (const q of qualitiesOrder) {
        if (availableMap.has(q)) {
          sortedFormats.push(availableMap.get(q)!);
        }
      }

      if (sortedFormats.length === 0) {
        sortedFormats.push(
          { id: '1080p', quality: '1080p', container: 'mp4', hasVideo: true, hasAudio: true },
          { id: '720p', quality: '720p', container: 'mp4', hasVideo: true, hasAudio: true },
          { id: '360p', quality: '360p', container: 'mp4', hasVideo: true, hasAudio: true }
        );
      }

      return {
        success: true,
        platform: 'youtube',
        title,
        thumbnail,
        duration,
        author,
        url,
        formats: sortedFormats,
        audioAvailable: true,
      };
    }
  } catch (err: any) {
    if (err.userMessage) throw err;
    console.warn('yt-dlp metadata fallback to ytdl-core:', err?.message || err);
  }

  // Fallback to ytdl-core if yt-dlp fails
  if (!ytdl.validateURL(url)) {
    throw { status: 400, userMessage: 'Esse link do YouTube não parece ser válido.' };
  }

  try {
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.youtube.com/',
        },
      },
    });

    const duration = parseInt(info.videoDetails.lengthSeconds, 10) || 0;
    if (duration > ENV.MAX_VIDEO_DURATION) {
      const maxMinutes = Math.floor(ENV.MAX_VIDEO_DURATION / 60);
      throw {
        status: 400,
        userMessage: `O vídeo excede a duração máxima permitida de ${maxMinutes} minutos.`,
      };
    }

    const title = info.videoDetails.title || 'Vídeo sem título';
    const author = info.videoDetails.author?.name || 'Autor desconhecido';
    const thumbnails = info.videoDetails.thumbnails || [];
    const thumbnail = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : '';

    const rawFormats = info.formats || [];
    const availableQualities = new Map<string, VideoFormatOption>();
    const qualitiesOrder = ['1080p', '720p', '480p', '360p', '240p', '144p'];

    for (const fmt of rawFormats) {
      const qualityLabel = fmt.qualityLabel || (fmt.height ? `${fmt.height}p` : undefined);
      if (qualityLabel && qualitiesOrder.includes(qualityLabel)) {
        if (!availableQualities.has(qualityLabel)) {
          availableQualities.set(qualityLabel, {
            id: qualityLabel,
            quality: qualityLabel,
            container: fmt.container || 'mp4',
            hasVideo: true,
            hasAudio: true,
            filesize: fmt.contentLength
              ? `${(parseInt(fmt.contentLength, 10) / (1024 * 1024)).toFixed(1)} MB`
              : undefined,
          });
        }
      }
    }

    const sortedFormats: VideoFormatOption[] = [];
    for (const q of qualitiesOrder) {
      if (availableQualities.has(q)) {
        sortedFormats.push(availableQualities.get(q)!);
      }
    }

    if (sortedFormats.length === 0) {
      sortedFormats.push(
        { id: '1080p', quality: '1080p', container: 'mp4', hasVideo: true, hasAudio: true },
        { id: '720p', quality: '720p', container: 'mp4', hasVideo: true, hasAudio: true }
      );
    }

    return {
      success: true,
      platform: 'youtube',
      title,
      thumbnail,
      duration,
      author,
      url,
      formats: sortedFormats,
      audioAvailable: true,
    };
  } catch (error: any) {
    if (error.userMessage) throw error;
    console.error('Error fetching YouTube info:', error.message || error);
    throw {
      status: 400,
      userMessage: 'Não conseguimos acessar esse vídeo. Verifique se ele é público e se você possui autorização para baixá-lo.',
    };
  }
}

export async function streamYoutubeDownload(url: string, formatId: string, audioOnly: boolean = false) {
  // Try yt-dlp streaming first
  try {
    let formatFilter = 'best[height<=1080][ext=mp4]/best[height<=1080]/bestvideo[height<=1080]+bestaudio/best';
    if (audioOnly) {
      formatFilter = 'bestaudio/best';
    } else if (formatId) {
      const height = formatId.replace(/[^0-9]/g, '');
      if (height && !isNaN(parseInt(height, 10))) {
        formatFilter = `best[height<=${height}][ext=mp4]/best[height<=${height}]/bestvideo[height<=${height}]+bestaudio/best`;
      }
    }

    const process = ytDlpExec(url, {
      output: '-',
      format: formatFilter,
      noWarnings: true,
    });

    if (process && process.stdout) {
      return { stream: process.stdout };
    }
  } catch (err: any) {
    console.warn('yt-dlp stream fallback to ytdl-core:', err?.message || err);
  }

  // Fallback to ytdl-core
  const requestOptions = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.youtube.com/',
    },
  };

  const info = await ytdl.getInfo(url, { requestOptions });

  if (audioOnly) {
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
    const stream = ytdl.downloadFromInfo(info, {
      format: audioFormat || undefined,
      quality: 'highestaudio',
      filter: 'audioonly',
      highWaterMark: 1 << 25,
      dlChunkSize: 0,
      requestOptions,
    });
    return { stream, contentLength: audioFormat?.contentLength };
  }

  const heightNum = parseInt(formatId.replace(/[^0-9]/g, ''), 10);
  let selectedFormat = info.formats.find((f) => {
    if (!f.height) return false;
    return isNaN(heightNum) ? f.height <= 1080 : f.height <= heightNum;
  });

  if (!selectedFormat) {
    selectedFormat = info.formats.find((f) => f.hasVideo && f.hasAudio);
  }

  const stream = ytdl.downloadFromInfo(info, {
    format: selectedFormat || undefined,
    quality: selectedFormat ? selectedFormat.itag : 'highest',
    highWaterMark: 1 << 25,
    dlChunkSize: 0,
    requestOptions,
  });

  return { stream, contentLength: selectedFormat?.contentLength };
}
