import { VideoInfoResponse } from '../types';

const API_BASE = '/api';

export async function fetchVideoInfo(url: string): Promise<VideoInfoResponse> {
  const response = await fetch(`${API_BASE}/info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Não conseguimos acessar esse vídeo. Verifique se ele é público.');
  }

  return data;
}

export function triggerFileDownload(url: string, formatId: string, formatType: 'video' | 'audio', title: string) {
  const downloadUrl = `${API_BASE}/download?url=${encodeURIComponent(url)}&formatId=${encodeURIComponent(
    formatId
  )}&formatType=${encodeURIComponent(formatType)}&title=${encodeURIComponent(title)}`;
  
  // Create invisible anchor tag to trigger browser download prompt
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
