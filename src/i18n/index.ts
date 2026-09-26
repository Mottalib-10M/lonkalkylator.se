/**
 * i18n, översättningsfunktioner
 */

import { sv } from './sv';
import { en } from './en';

const translations: Record<string, Record<string, string>> = { sv, en };

export function t(key: string, lang: string = 'sv'): string {
  return translations[lang]?.[key] ?? translations['sv']?.[key] ?? key;
}

export function getLang(url: URL | string): string {
  const pathname = typeof url === 'string' ? url : url.pathname;
  if (pathname.startsWith('/en/') || pathname === '/en') return 'en';
  return 'sv';
}
