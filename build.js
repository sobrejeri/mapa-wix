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

  if (
    data.name && data.latitude && data.longitude &&
    data.imagem && data.link && data.descricao
  ) {
    pontos.push({
      title: data.name,
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude),
      image: data.imagem,
      link: data.link,
      description: data.descricao,
    });
  }
});

fs.writeFileSync(outputFile, JSON.stringify(pontos, null, 2));
console.log(`✅ Arquivo pontos.json gerado com ${pontos.length} pontos`);
