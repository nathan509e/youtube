import { ENV } from '../config/env.js';

let activeDownloads = 0;

export function acquireDownloadSlot(): boolean {
  if (activeDownloads >= ENV.MAX_CONCURRENT_DOWNLOADS) {
    return false;
  }
  activeDownloads++;
  return true;
}

export function releaseDownloadSlot(): void {
  if (activeDownloads > 0) {
    activeDownloads--;
  }
}

export function getActiveDownloadsCount(): number {
  return activeDownloads;
}
