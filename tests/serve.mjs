// A static file server for the probes, in node rather than python so a fresh
// environment needs nothing beyond what package.json already installs.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.png':'image/png', '.svg':'image/svg+xml', '.webmanifest':'application/manifest+json' };

/** Port 0 asks the OS for a free one, so the suite does not fight whatever
 *  else happens to hold a fixed port on a developer's machine. */
export function serve(port = 0) {
  const server = createServer(async (req, res) => {
    const clean = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = normalize(clean === '/' ? '/index.html' : clean).replace(/^[/\\]+/, '');
    const file = join(ROOT, rel);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404).end('not found'); }
  });
  return new Promise(resolve => server.listen(port, () => resolve(server)));
}
