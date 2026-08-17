import fs from 'fs';
import os from 'os';
import path from 'path';
import ytdl from '@distube/ytdl-core';
import ytDlp from 'yt-dlp-exec';
import { ENV } from '../config/env.js';

export interface VideoFormatOption {
  id: string;
  quality: string;
  container: string;
  hasVideo: boolean;
  hasAudio: boolean;
  filesize?: string;
  url?: string;
  height?: number;
  codec?: string;
  fps?: number;
  ext?: string;
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

// Try yt-dlp with multiple auth strategies: browser cookies first, then bare
async function tryYtDlpMeta(url: string, extraOptions: Record<string, any> = {}): Promise<any> {
  const base = {
    dumpSingleJson: true,
    noWarnings: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    ...extraOptions,
  };

  // 0. Try explicit cookies file if configured and present (best for 4K + bot-check)
  const cookiesPath = ENV.YT_COOKIES_PATH && fs.existsSync(ENV.YT_COOKIES_PATH)
    ? ENV.YT_COOKIES_PATH
    : undefined;

  if (cookiesPath) {
    try {
      const data = await ytDlp(url, { ...base, cookies: cookiesPath });
      if (data && (data as any).title) return data;
    } catch {
      // try next
    }
  }

  // 1. Try each browser's cookie store
  for (const browser of ['chrome', 'edge', 'firefox']) {
    try {
      const data = await ytDlp(url, { ...base, cookiesFromBrowser: browser } as any);
      if (data && (data as any).title) return data;
    } catch {
      // try next
    }
  }

  // 2. Try without browser cookies (last resort before ytdl-core)
  try {
    const data = await ytDlp(url, base);
    if (data && (data as any).title) return data;
  } catch {
    // fall through to ytdl-core
  }

  return null;
}

export async function getYoutubeMetadata(url: string): Promise<VideoMetadata> {
  // Try yt-dlp first
  try {
    const data: any = await tryYtDlpMeta(url);

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

      // Qualities to display: "Melhor qualidade" (highest available) first, then real resolutions up to 4K
      const qualitiesOrder = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];
      const rawFormats = data.formats || [];
      const availableMap = new Map<string, VideoFormatOption>();

      for (const fmt of rawFormats) {
        let heightLabel = fmt.height ? `${fmt.height}p` : undefined;
        if (!heightLabel && fmt.format_note) {
          // Extract resolution like "2160p", "1440p", "1080p" from format_note
          const resolution = fmt.format_note.match(/(\d{3,4})p/);
          if (resolution) heightLabel = `${resolution[1]}p`;
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
              height: fmt.height,
              codec: fmt.vcodec && fmt.vcodec !== 'none' ? fmt.vcodec : undefined,
              fps: fmt.fps,
              ext: fmt.ext,
            });
          }
        }
      }

      const sortedFormats: VideoFormatOption[] = [];
      // "Melhor qualidade" always first (downloads the highest available stream)
      if (availableMap.size > 0) {
        sortedFormats.push({
          id: 'best',
          quality: 'best',
          container: 'mp4',
          hasVideo: true,
          hasAudio: true,
        });
      }
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
    const qualitiesOrder = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];

    for (const fmt of rawFormats) {
      // Use height directly to avoid mismatches like "1080p60" vs "1080p"
      const qualityLabel = fmt.height ? `${fmt.height}p` : undefined;
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
            height: fmt.height,
            codec: fmt.codecs ? fmt.codecs.split(',')[0].trim() : undefined,
            fps: fmt.fps,
            ext: fmt.container,
          });
        }
      }
    }

    const sortedFormats: VideoFormatOption[] = [];
    if (availableQualities.size > 0) {
      sortedFormats.push({
        id: 'best',
        quality: 'best',
        container: 'mp4',
        hasVideo: true,
        hasAudio: true,
      });
    }
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
  let formatFilter = 'bestvideo+bestaudio/best';
  if (audioOnly) {
    formatFilter = 'bestaudio/best';
  } else if (formatId) {
    if (formatId === 'best') {
      // "Melhor qualidade": highest available video + audio, merged to mp4
      formatFilter = 'bestvideo+bestaudio/best';
    } else {
      const height = formatId.replace(/[^0-9]/g, '');
      if (height && !isNaN(parseInt(height, 10))) {
        // Prefer merging the separate DASH video+audio streams first — YouTube only
        // exposes pre-combined ("progressive") formats up to ~720p, so trying those
        // first silently capped every download (even 4K/2K requests) at low res.
        formatFilter = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}][ext=mp4]/best[height<=${height}]`;
      }
    }
  }

  const cookiesPath = ENV.YT_COOKIES_PATH && fs.existsSync(ENV.YT_COOKIES_PATH)
    ? ENV.YT_COOKIES_PATH
    : undefined;

  // Primary path: download to a temp file so ffmpeg can merge DASH streams (4K etc.),
  // then stream the finished file back. No Content-Length until the file is ready.
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(
    tmpDir,
    `videodrop-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${audioOnly ? 'm4a' : 'mp4'}`
  );

  const ytDlpOptions: Record<string, any> = {
    output: tmpFile,
    format: formatFilter,
    noWarnings: true,
    // Force the android_vr player client + Node.js JS runtime so media downloads
    // work without cookies (the default `web` client gets a 403 bot-check).
    extractorArgs: 'youtube:player_client=android_vr',
    jsRuntimes: 'node',
  };

  if (!audioOnly) {
    ytDlpOptions.mergeOutputFormat = 'mp4';
  }

  if (cookiesPath) {
    ytDlpOptions.cookies = cookiesPath;
  }

  const attempters: Array<() => Promise<any>> = [];
  if (cookiesPath) {
    attempters.push(() => ytDlp(url, ytDlpOptions));
  }
  for (const browser of ['chrome', 'edge', 'firefox']) {
    attempters.push(() => ytDlp(url, { ...ytDlpOptions, cookies: undefined, cookiesFromBrowser: browser } as any));
  }
  attempters.push(() => ytDlp(url, { ...ytDlpOptions, cookies: undefined, cookiesFromBrowser: undefined } as any));

  for (const attempt of attempters) {
    try {
      await attempt();
      const contentLength = fs.statSync(tmpFile).size;
      const stream = fs.createReadStream(tmpFile);
      // Clean up the temp file once the stream is done or errors out
      const cleanup = () => {
        fs.unlink(tmpFile, () => {});
      };
      stream.on('end', cleanup);
      stream.on('close', cleanup);
      stream.on('error', cleanup);
      return { stream, contentLength };
    } catch {
      // try next auth strategy
    }
  }

  // Clean up if every yt-dlp attempt failed
  fs.unlink(tmpFile, () => {});

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

  let selectedFormat: typeof info.formats[number] | undefined;
  const heightNum = parseInt(formatId.replace(/[^0-9]/g, ''), 10);
  const isBest = formatId === 'best';

  // Prefer complete formats (video + audio); otherwise the highest video-only
  // stream within the requested height range.
  const videoFormats = info.formats.filter((f) => f.height && f.hasVideo);
  const targetHeight = isBest || isNaN(heightNum) ? Number.MAX_SAFE_INTEGER : heightNum;
  const inRange = videoFormats.filter((f) => f.height! <= targetHeight);
  const withAudio = inRange.filter((f) => f.hasAudio);
  const pool = withAudio.length > 0 ? withAudio : inRange;
  selectedFormat = pool.reduce(
    (best, f) => (!best || f.height! > best.height! ? f : best),
    undefined as typeof info.formats[number] | undefined
  );

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
