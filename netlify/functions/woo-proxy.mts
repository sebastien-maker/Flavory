// Forwards WooCommerce API calls on flavory.wine to WordPress on www.flavory.wine (Combell).
// A Netlify redirect cannot do this: www.flavory.wine is attached to this Netlify project, so Netlify
// handles such a proxy internally. A function fetches over the public internet and reaches Combell.
// - /wp-json/* and /wc-api/*: partners such as Postalux (fulfilment) still call the API on flavory.wine.
// - /woo-api/*: the browser's price and stock refresh (WooCommerce Store API).
// Cookies: WordPress (its Converge plugin) sets a Converge ID cookie (__cvg_*) on every response. Passed on,
// it would land on flavory.wine before the visitor consents to marketing cookies (rule 8), so it never goes
// through. The price and stock refresh needs no cookies at all; /wp-json/* and /wc-api/* keep all others.

const ORIGIN = 'https://www.flavory.wine';

// Hop-by-hop and encoding headers must not be copied: fetch already decoded the body.
const DROP_REQUEST = ['host', 'connection', 'content-length', 'accept-encoding'];
const DROP_RESPONSE = ['content-encoding', 'content-length', 'transfer-encoding', 'connection'];

export default async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  const isStoreApi = url.pathname.startsWith('/woo-api/');
  const path = isStoreApi ? url.pathname.replace(/^\/woo-api\//, '/wp-json/wc/store/v1/') : url.pathname;
  const target = new URL(path + url.search, ORIGIN);

  const headers = new Headers(request.headers);
  for (const name of DROP_REQUEST) headers.delete(name);
  for (const name of [...headers.keys()]) if (name.startsWith('x-nf-') || name.startsWith('x-forwarded-')) headers.delete(name);

  const init: RequestInit = { method: request.method, headers, redirect: 'manual' };
  if (request.method !== 'GET' && request.method !== 'HEAD') init.body = await request.arrayBuffer();
  const upstream = await fetch(target, init);

  const responseHeaders = new Headers(upstream.headers);
  for (const name of DROP_RESPONSE) responseHeaders.delete(name);
  responseHeaders.delete('set-cookie');
  if (!isStoreApi) {
    for (const cookie of upstream.headers.getSetCookie()) {
      if (!cookie.trimStart().startsWith('__cvg_')) responseHeaders.append('set-cookie', cookie);
    }
  }
  responseHeaders.set('x-robots-tag', 'noindex');
  return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
};

export const config = {
  path: ['/wp-json', '/wp-json/', '/wp-json/*', '/wc-api/*', '/woo-api/*'],
};
