import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { processVideoInfo, createDownloadStream } from '../services/downloader.service.js';
import { acquireDownloadSlot, releaseDownloadSlot } from '../middleware/concurrency.js';

const infoSchema = z.object({
  url: z.string().url('Esse link não parece ser válido.'),
});

const downloadSchema = z.object({
  url: z.string().url('Esse link não parece ser válido.'),
  formatId: z.string().optional().default('highest'),
  formatType: z.enum(['video', 'audio']).optional().default('video'),
  title: z.string().optional(),
});

export async function getVideoInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const parseResult = infoSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || 'Esse link não parece ser válido.';
      return res.status(400).json({ success: false, error: errorMsg });
    }

    const { url } = parseResult.data;
    const metadata = await processVideoInfo(url);

    return res.status(200).json(metadata);
  } catch (error) {
    next(error);
  }
}

export async function processDownload(req: Request, res: Response, next: NextFunction) {
  let slotAcquired = false;
  try {
    const input = req.method === 'GET' ? req.query : req.body;
    const parseResult = downloadSchema.safeParse(input);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || 'Parâmetros de download inválidos.';
      return res.status(400).json({ success: false, error: errorMsg });
    }

    const { url, formatId, formatType, title } = parseResult.data;

    // Concurrency limit check
    if (!acquireDownloadSlot()) {
      return res.status(429).json({
        success: false,
        error: 'Limite de downloads simultâneos atingido no servidor. Tente novamente em alguns instantes.',
      });
    }
    slotAcquired = true;

    // Sanitize title for filename
    const safeTitle = (title || 'videodrop_media')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .substring(0, 50) || 'videodrop_media';

    const ext = formatType === 'audio' ? 'mp3' : 'mp4';
    const filename = `${safeTitle}.${ext}`;

    // Await stream creation first before sending headers
    const { stream, contentLength } = await createDownloadStream(url, formatId, formatType);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', formatType === 'audio' ? 'audio/mpeg' : 'video/mp4');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    stream.on('error', (err: any) => {
      console.error('Stream download error:', err);
      if (slotAcquired) {
        releaseDownloadSlot();
        slotAcquired = false;
      }
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Erro no processamento do arquivo. Tente novamente.',
        });
      }
    });

    stream.on('end', () => {
      if (slotAcquired) {
        releaseDownloadSlot();
        slotAcquired = false;
      }
    });

    res.on('close', () => {
      if (slotAcquired) {
        releaseDownloadSlot();
        slotAcquired = false;
      }
    });

    stream.pipe(res);
  } catch (error) {
    if (slotAcquired) {
      releaseDownloadSlot();
    }
    next(error);
  }
}
