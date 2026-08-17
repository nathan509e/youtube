export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  return `${formattedMins}:${formattedSecs}`;
}

export function formatQualityLabel(quality: string): string {
  const labels: Record<string, string> = {
    best: 'Melhor qualidade',
    '2160p': '2160p 4K',
    '1440p': '1440p 2K',
    '1080p': '1080p Full HD',
    '720p': '720p HD',
  };
  return labels[quality] || quality || 'Automático';
}

export function detectPlatformFromUrl(url: string): 'youtube' | 'instagram' | 'unknown' {
  if (!url) return 'unknown';
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'instagram';
  return 'unknown';
}
