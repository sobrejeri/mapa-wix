const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = path.join(__dirname, 'dados/pontos');
const outputFile = path.join(__dirname, 'pontos.json');

const files = fs.readdirSync(dir);
const pontos = [];

files.forEach((file) => {
  const filePath = path.join(dir, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContent);

  if (data.name && data.latitude && data.longitude && data.imagem && data.link && data.descricao) {
    pontos.push({
      nome: data.name,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      imagem: data.imagem,
      link: data.link,
      descricao: data.descricao,
    });
  }
});

// ⚠️ Força alteração: inclui timestamp
const conteudoFinal = {
  atualizado_em: new Date().toISOString(),
  pontos: pontos
};

fs.writeFileSync(outputFile, JSON.stringify(conteudoFinal, null, 2));
console.log(`✔ pontos.json gerado com ${pontos.length} pontos`);
