import { parseAndValidateUrl } from '../utils/urlParser.js';
import { validateSsrfAndUrl } from '../middleware/ssrfGuard.js';
import { getYoutubeMetadata, streamYoutubeDownload, VideoMetadata } from './youtube.service.js';
import { getInstagramMetadata, streamInstagramDownload } from './instagram.service.js';

export async function processVideoInfo(targetUrl: string): Promise<VideoMetadata> {
  // 1. SSRF and Domain Validation
  const ssrfResult = await validateSsrfAndUrl(targetUrl);
  if (!ssrfResult.safe) {
    throw { status: 400, userMessage: ssrfResult.error || 'Esse link não parece ser válido.' };
  }

  // 2. Parse URL
  const parsed = parseAndValidateUrl(targetUrl);
  if (!parsed.isValid || !parsed.cleanUrl || !parsed.platform) {
    throw { status: 400, userMessage: parsed.error || 'Esse link não parece ser válido.' };
  }

  // 3. Dispatch to service
  if (parsed.platform === 'youtube') {
    return await getYoutubeMetadata(parsed.cleanUrl);
  } else if (parsed.platform === 'instagram') {
    return await getInstagramMetadata(parsed.cleanUrl);
  }

  throw { status: 400, userMessage: 'Ainda não oferecemos suporte para essa plataforma.' };
}

export async function createDownloadStream(
  url: string,
  formatId: string,
  formatType: 'video' | 'audio'
) {
  const parsed = parseAndValidateUrl(url);
  if (!parsed.isValid || !parsed.cleanUrl || (!parsed.platform || (parsed.platform !== 'youtube' && parsed.platform !== 'instagram'))) {
    throw { status: 400, userMessage: 'O download por stream está disponível para links do YouTube e Instagram.' };
  }

  const isAudio = formatType === 'audio';
  if (parsed.platform === 'instagram') {
    return await streamInstagramDownload(parsed.cleanUrl, formatId, isAudio);
  }

  return await streamYoutubeDownload(parsed.cleanUrl, formatId, isAudio);
}

