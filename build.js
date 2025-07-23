const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'dados/pontos');
const outputFile = path.join(__dirname, 'pontos.json');

let files;
try {
  files = fs.readdirSync(dir);
} catch (err) {
  console.error(`ERRO: Não foi possível ler o diretório: ${dir}`);
  process.exit(1);
}

const pontos = [];

files.forEach((file) => {
  if (path.extname(file).toLowerCase() === '.json') {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    try {
      const data = JSON.parse(fileContent);

      const ponto = {
        nome: data.nome || '',
        descricao: data.descricao || '',
        preco: data.preco || '',
        tipo: data.tipo || '',
        status: data.status || '',
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        imagem_capa: data.imagem_capa || data.imagem || '',
        galeria: data.galeria || [],
        video: data.video || '',
        whatsapp: data.whatsapp || '',
        link: data.link || ''
      };

      if (!isNaN(ponto.latitude) && !isNaN(ponto.longitude)) {
        pontos.push(ponto);
      } else {
        console.warn(`AVISO: Latitude/Longitude inválida no arquivo ${file}`);
      }
    } catch (err) {
      console.error(`ERRO ao processar ${file}:`, err);
    }
  }
});

const conteudoFinal = {
  atualizado_em: new Date().toISOString(),
  pontos: pontos
};

fs.writeFileSync(outputFile, JSON.stringify(conteudoFinal, null, 2));
console.log(`✅ Criado pontos.json com ${pontos.length} pontos`);
