/**
 * Client for the generator function.
 *
 * One call, one finished document. The prompt that runs lives server-side in
 * the edge function, so the wording cannot be rewritten from the browser.
 */

import { parseSite, type SiteDocument } from './site-schema';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export type { SiteDocument, SiteBlock, SiteTheme, SiteMeta } from './site-schema';

/**
 * Turns a brief into a finished site document.
 *
 * The response is narrowed through `parseSite`, which drops any block type
 * outside the allow-list. A malformed answer is a shorter page, not a crash.
 */
export async function buildSite(brief: string, language = 'hu'): Promise<SiteDocument> {
  const res = await fetch(`${FUNCTIONS_URL}/vey-generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
    },
    body: JSON.stringify({ brief, language }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    document?: unknown;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(body.error ?? `A generálás nem sikerült (${res.status})`);
  }

  const site = parseSite(body.document);
  if (!site) throw new Error('A válasz nem tartalmazott felhasználható oldalt.');

  return site;
}
