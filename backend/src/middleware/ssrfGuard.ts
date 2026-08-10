import dns from 'dns/promises';
import ip from 'ip';
import { parseAndValidateUrl } from '../utils/urlParser.js';

export async function validateSsrfAndUrl(targetUrl: string): Promise<{ safe: boolean; error?: string }> {
  const urlCheck = parseAndValidateUrl(targetUrl);
  if (!urlCheck.isValid || !urlCheck.cleanUrl) {
    return { safe: false, error: urlCheck.error || 'Esse link não parece ser válido.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlCheck.cleanUrl);
  } catch {
    return { safe: false, error: 'Esse link não parece ser válido.' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Whitelist check
  const allowedDomains = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com', 'instagram.com', 'www.instagram.com', 'instagr.am'];
  if (!allowedDomains.includes(hostname)) {
    return { safe: false, error: 'Ainda não oferecemos suporte para essa plataforma.' };
  }

  // Block localhost explicitly
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0') {
    return { safe: false, error: 'Acesso a endereços locais não é permitido.' };
  }

  // DNS lookup to prevent SSRF via custom domain pointing to private IP
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    for (const addr of addresses) {
      const address = addr.address;
      if (
        ip.isPrivate(address) ||
        ip.isLoopback(address) ||
        address.startsWith('169.254.') || // Link-local
        address.startsWith('0.') ||
        address === '::1' ||
        address.startsWith('fe80:') ||
        address.startsWith('fc00:') ||
        address.startsWith('fd00:')
      ) {
        return { safe: false, error: 'Acesso a redes privadas não é permitido.' };
      }
    }
  } catch {
    return { safe: false, error: 'Não foi possível resolver o endereço do servidor de destino.' };
  }

  return { safe: true };
}
