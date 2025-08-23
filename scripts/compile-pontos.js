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

const run = async () => {
  const files = (await readdir(PASTA)).filter(f => f.endsWith('.json'));
  const itens = [];
  for (const f of files) {
    const j = JSON.parse(await readFile(path.join(PASTA, f), 'utf8'));

    itens.push({
      id: j.id || j.codigo || path.parse(f).name,
      nome: j.nome || j.titulo || 'Imóvel',
      descricao: j.descricao || '',
      preco: toNumber(j.preco),
      tipo: (j.tipo || '').toLowerCase(),
      status: (j.status || 'disponivel').toLowerCase(),
      imagem_capa: j.imagem_capa || j.capa || j.imagem || '',
      galeria: j.galeria || [],
      url: j.url || '',
      whatsapp: onlyDigits(j.whatsapp),
      latitude: Number(j.latitude ?? j.lat),
      longitude: Number(j.longitude ?? j.lng),
      quartos: Number(j.quartos || 0),
      area_m2: Number(j.area_m2 || 0),
      financia: !!j.financia
    });
  }

  await writeFile(SAIDA, JSON.stringify(itens, null, 2));
  console.log(`OK: ${itens.length} itens → pontos.json`);
};

run().catch(e => { console.error(e); process.exit(1); });
