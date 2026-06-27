/**
 * Bidirectional SV <-> EN route mapping for hreflang tags.
 *
 * Add entries here whenever a Swedish page gets an English counterpart
 * (or vice-versa). Paths must include a trailing slash.
 */

const svToEn: Record<string, string> = {
  '/': '/en/',
};

const enToSv: Record<string, string> = {};
for (const [sv, en] of Object.entries(svToEn)) {
  enToSv[en] = sv;
}

/**
 * Given the current page path and its language, return the path of
 * the alternate-language version. Returns `null` when no translation exists.
 */
export function getAlternatePath(
  currentPath: string,
  currentLang: 'sv' | 'en',
): string | null {
  const path = currentPath.endsWith('/') ? currentPath : currentPath + '/';
  if (currentLang === 'sv') return svToEn[path] ?? null;
  return enToSv[path] ?? null;
}
