import axios from 'axios';
import ytDlp, { exec as ytDlpExec } from 'yt-dlp-exec';
import { VideoMetadata, VideoFormatOption } from './youtube.service.js';

export async function getInstagramMetadata(url: string): Promise<VideoMetadata> {
  // 1. Try yt-dlp first for complete metadata extraction
  try {
    const data: any = await ytDlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
    });

    if (data) {
      const rawTitle = data.title || data.description || 'Publicação do Instagram';
      const title = rawTitle.length > 100 ? rawTitle.substring(0, 100) + '...' : rawTitle;
      const authorRaw = data.uploader || data.channel || data.uploader_id || 'Instagram User';
      const author = authorRaw.startsWith('@') ? authorRaw : `@${authorRaw}`;
      const thumbnail =
        data.thumbnail ||
        (data.thumbnails && data.thumbnails[data.thumbnails.length - 1]?.url) ||
        '';
      const duration = Math.floor(data.duration || 30);

      const formats: VideoFormatOption[] = [
        {
          id: 'hd',
          quality: 'HD (Original)',
          container: 'mp4',
          hasVideo: true,
          hasAudio: true,
        },
        {
          id: 'sd',
          quality: 'SD (Padrão)',
          container: 'mp4',
          hasVideo: true,
          hasAudio: true,
        },
      ];

      return {
        success: true,
        platform: 'instagram',
        title,
        thumbnail,
        duration,
        author,
        url,
        formats,
        audioAvailable: true,
      };
    }
  } catch (err: any) {
    console.warn('yt-dlp Instagram metadata fetch error:', err?.message || err);
  }

  // 2. Fallback to OpenGraph HTML inspection
  try {
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    const html = response.data;
    if (typeof html === 'string') {
      const ogTitleMatch =
        html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
        html.match(/<meta\s+name="title"\s+content="([^"]+)"/i);
      const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
      const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);

      if (ogTitleMatch || ogImageMatch || ogDescMatch) {
        const rawTitle = ogTitleMatch
          ? ogTitleMatch[1]
          : ogDescMatch
          ? ogDescMatch[1]
          : 'Publicação do Instagram';
        const thumbnail = ogImageMatch ? ogImageMatch[1].replace(/&amp;/g, '&') : '';

        const formats: VideoFormatOption[] = [
          {
            id: 'hd',
            quality: 'HD (Original)',
            container: 'mp4',
            hasVideo: true,
            hasAudio: true,
          },
        ];

        return {
          success: true,
          platform: 'instagram',
          title: rawTitle.length > 100 ? rawTitle.substring(0, 100) + '...' : rawTitle,
          thumbnail,
          duration: 30,
          author: '@instagram',
          url,
          formats,
          audioAvailable: true,
        };
      }
    }
  } catch (err: any) {
    console.warn('Instagram HTML scraping fallback error:', err?.message || err);
  }

  // 3. Fallback to public oEmbed API
  try {
    const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
    const response = await axios.get(oembedUrl, {
      timeout: 6000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (response.data && (response.data.title || response.data.author_name)) {
      const title = response.data.title || 'Publicação do Instagram';
      const author = response.data.author_name || 'Instagram User';
      const thumbnail = response.data.thumbnail_url || '';

      const formats: VideoFormatOption[] = [
        {
          id: 'hd',
          quality: 'HD (Original)',
          container: 'mp4',
          hasVideo: true,
          hasAudio: true,
        },
      ];

      return {
        success: true,
        platform: 'instagram',
        title: title.length > 100 ? title.substring(0, 100) + '...' : title,
        thumbnail,
        duration: 30,
        author: author.startsWith('@') ? author : `@${author}`,
        url,
        formats,
        audioAvailable: true,
      };
    }
  } catch (err: any) {
    console.warn('Instagram OEmbed fetch error:', err?.message || err);
  }

  // If public oEmbed / scraping is restricted or requires authentication
  throw {
    status: 400,
    userMessage:
      'Não foi possível acessar as informações deste conteúdo do Instagram. Verifique se a publicação é pública e se possui permissão do proprietário.',
  };
}

export async function streamInstagramDownload(
  url: string,
  formatId: string,
  audioOnly: boolean = false
): Promise<{ stream: any; contentLength?: string }> {
  try {
    const formatFilter = audioOnly
      ? 'bestaudio/best'
      : 'best[ext=mp4]/best/bestvideo+bestaudio';

    const process = ytDlpExec(url, {
      output: '-',
      format: formatFilter,
      noWarnings: true,
      noCheckCertificate: true,
    });

    if (process && process.stdout) {
      return { stream: process.stdout, contentLength: undefined };
    }
  } catch (err: any) {
    console.error('Error streaming Instagram download via yt-dlp:', err?.message || err);
  }

  throw {
    status: 400,
    userMessage:
      'Não foi possível realizar o download deste conteúdo do Instagram. Verifique se a publicação é pública e tente novamente.',
  };
}



