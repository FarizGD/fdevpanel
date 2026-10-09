import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
http.createServer(async (request, response) => {
    try {
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        if (pathname === '/' || pathname === '/fdevpanel') {
            response.writeHead(302, { Location: '/fdevpanel/' }).end();
            return;
        }
        if (!pathname.startsWith('/fdevpanel/')) throw Error('Not found');
        let relative = pathname.slice('/fdevpanel/'.length) || 'index.html';
        if (relative.endsWith('/')) relative += 'index.html';
        const filename = path.resolve(root, relative);
        if (!filename.startsWith(root + path.sep)) throw Error('Not found');
        const data = await readFile(filename);
        response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(data);
    } catch { response.writeHead(404).end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('Demo preview: http://localhost:4173/fdevpanel/'));
