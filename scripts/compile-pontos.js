// scripts/compile-pontos.js
import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const PASTA = path.join(process.cwd(), 'dados', 'pontos');
const SAIDA = path.join(process.cwd(), 'pontos.json');

const onlyDigits = s => (s || '').toString().replace(/\D+/g, '');
const toNumber = v => {
  if (typeof v === 'number') return v;
  if (v == null) return 0;
  // "R$ 100.000,50" -> 100000.50
  const d = v.toString().replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const n = Number(d);
  return Number.isFinite(n) ? n : 0;
};

const stripDiacritics = (s='') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos

const slug = (s='') =>
  stripDiacritics(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const shortHash = (s='') => {
  // hash simples e estável -> base36 com 8 chars
  let h = 0;
  for (let i=0; i<s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  // força positivo e reduz
  return (h >>> 0).toString(36).padStart(6, '0').slice(0,8);
};

const run = async () => {
  const files = (await readdir(PASTA)).filter(f => f.endsWith('.json'));
  const itens = [];
  for (const f of files) {
    const j = JSON.parse(await readFile(path.join(PASTA, f), 'utf8'));

    const baseId =
      j.id || j.codigo || path.parse(f).name;

    const tipoNorm = slug(j.tipo || '');     // sem acento e minúsculo
    const statusNorm = slug(j.status || 'disponivel'); // idem

    // id curto/estável se não houver id/codigo
    const autoId = baseId
      ? slug(String(baseId)).slice(0,40)
      : 'imv-' + shortHash(`${j.nome||j.titulo||''}|${j.latitude}|${j.longitude}`);

    const lat = Number(j.latitude ?? j.lat);
    const lng = Number(j.longitude ?? j.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      console.warn(`Aviso: ${f} ignorado por latitude/longitude inválidas.`);
      continue;
    }

    itens.push({
      id: autoId || ('imv-' + shortHash(`${j.nome||j.titulo||''}|${j.latitude}|${j.longitude}`)),
      nome: j.nome || j.titulo || 'Imóvel',
      descricao: j.descricao || '',
      preco: toNumber(j.preco),
      tipo: tipoNorm,                 // <- agora sem acentos
      status: statusNorm || 'disponivel', // <- idem
      imagem_capa: j.imagem_capa || j.capa || j.imagem || '',
      galeria: j.galeria || [],
      url: j.url || '',
      whatsapp: onlyDigits(j.whatsapp),
      latitude: lat,
      longitude: lng,
      quartos: Number(j.quartos || 0),
      area_m2: Number(j.area_m2 || 0),
      financia: !!j.financia
    });
  }

  await writeFile(SAIDA, JSON.stringify(itens, null, 2));
  console.log(`OK: ${itens.length} itens → pontos.json`);
};

run().catch(e => { console.error(e); process.exit(1); });
