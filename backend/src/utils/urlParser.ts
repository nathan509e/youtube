export type SupportedPlatform = 'youtube' | 'instagram';
export type MediaType = 'youtube-video' | 'youtube-shorts' | 'instagram-reel' | 'instagram-post';

export interface ParsedUrlInfo {
  isValid: boolean;
  platform?: SupportedPlatform;
  mediaType?: MediaType;
  cleanUrl?: string;
  id?: string;
  error?: string;
}

export function parseAndValidateUrl(inputUrl: string): ParsedUrlInfo {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'Esse link não parece ser válido.' };
  }

  const trimmedUrl = inputUrl.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmedUrl);
  } catch {
    return { isValid: false, error: 'Esse link não parece ser válido.' };
  }

  // Only http/https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Esse link não parece ser válido.' };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');

  // YOUTUBE
  if (hostname === 'youtube.com' || hostname === 'youtu.be') {
    if (hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      if (!id || id.length < 5) {
        return { isValid: false, error: 'Esse link do YouTube não parece ser válido.' };
      }
      return {
        isValid: true,
        platform: 'youtube',
        mediaType: 'youtube-video',
        cleanUrl: `https://www.youtube.com/watch?v=${id}`,
        id,
      };
    }

    if (parsed.pathname.startsWith('/shorts/')) {
      const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0]?.split('?')[0];
      if (!id) {
        return { isValid: false, error: 'Esse link do YouTube Shorts não parece ser válido.' };
      }
      return {
        isValid: true,
        platform: 'youtube',
        mediaType: 'youtube-shorts',
        cleanUrl: `https://www.youtube.com/shorts/${id}`,
        id,
      };
    }

    if (parsed.pathname.startsWith('/embed/')) {
      const id = parsed.pathname.split('/embed/')[1]?.split('/')[0]?.split('?')[0];
      if (id) {
        return {
          isValid: true,
          platform: 'youtube',
          mediaType: 'youtube-video',
          cleanUrl: `https://www.youtube.com/watch?v=${id}`,
          id,
        };
      }
    }

    if (parsed.pathname.startsWith('/v/')) {
      const id = parsed.pathname.split('/v/')[1]?.split('/')[0]?.split('?')[0];
      if (id) {
        return {
          isValid: true,
          platform: 'youtube',
          mediaType: 'youtube-video',
          cleanUrl: `https://www.youtube.com/watch?v=${id}`,
          id,
        };
      }
    }

    if (parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v');
      if (!id) {
        return { isValid: false, error: 'Esse link do YouTube não possui ID de vídeo válido.' };
      }
      return {
        isValid: true,
        platform: 'youtube',
        mediaType: 'youtube-video',
        cleanUrl: `https://www.youtube.com/watch?v=${id}`,
        id,
      };
    }

    return { isValid: false, error: 'Link do YouTube não suportado. Use um link de vídeo ou Shorts.' };
  }

  // INSTAGRAM
  if (hostname === 'instagram.com' || hostname === 'instagr.am') {
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length >= 2) {
      const type = segments[0];
      const id = segments[1];

      if (type === 'reel' || type === 'reels') {
        return {
          isValid: true,
          platform: 'instagram',
          mediaType: 'instagram-reel',
          cleanUrl: `https://www.instagram.com/reel/${id}/`,
          id,
        };
      }

      if (type === 'p' || type === 'tv') {
        return {
          isValid: true,
          platform: 'instagram',
          mediaType: 'instagram-post',
          cleanUrl: `https://www.instagram.com/p/${id}/`,
          id,
        };
      }
    }

    return { isValid: false, error: 'Link do Instagram não reconhecido. Use um link de Reel ou Post de vídeo.' };
  }

  return { isValid: false, error: 'Ainda não oferecemos suporte para essa plataforma.' };
}
