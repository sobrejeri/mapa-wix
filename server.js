import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';
import crypto from 'crypto';

const dbPath = path.join(process.cwd(), 'dados', 'imoveis.json');
const numericFields = ['preco', 'latitude', 'longitude'];
const onlyDigits = s => (s || '').toString().replace(/\D+/g, '');

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeDb(data) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
  }[ext] || 'application/octet-stream';
}

async function serveStatic(req, res) {
  let filePath = url.parse(req.url).pathname;
  if (filePath === '/') filePath = '/index.html';
  const fullPath = path.join(process.cwd(), filePath);
  try {
    const data = await fs.readFile(fullPath);
    res.writeHead(200, { 'Content-Type': getContentType(fullPath) });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end('Not Found');
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);
  if (req.method === 'POST' && pathname === '/api/imoveis') {
    try {
      const body = await readBody(req);
      const data = { ...body };
      for (const f of numericFields) data[f] = Number(data[f]);
      data.whatsapp = onlyDigits(data.whatsapp);
      const imovel = { id: crypto.randomUUID(), ...data };
      const lista = await readDb();
      lista.push(imovel);
      await writeDb(lista);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, id: imovel.id }));
    } catch (err) {
      console.error('Erro ao salvar', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'erro_ao_salvar' }));
    }
  } else if (req.method === 'GET' && pathname === '/api/imoveis') {
    try {
      const lista = await readDb();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(lista));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false }));
    }
  } else if (req.method === 'GET') {
    await serveStatic(req, res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
