const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'dados/pontos');
const outputFile = path.join(__dirname, 'pontos.json');

let files;
try {
  files = fs.readdirSync(dir);
} catch (error) {
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
      const nome = data.nome;
      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);

      if (nome && !isNaN(lat) && !isNaN(lng)) {
        pontos.push({
          nome: nome,
          descricao: data.descricao || "",
          latitude: lat,
          longitude: lng,
          imagem: data.imagem || "",
          link: data.link || ""
        });
      } else {
        console.warn(`AVISO: Ignorado ${file} — Campos obrigatórios ausentes ou inválidos.`);
      }
    } catch (e) {
      console.error(`ERRO: Falha ao processar ${file}`);
      console.error(e);
    }
  }
});

const conteudoFinal = {
  atualizado_em: new Date().toISOString(),
  pontos: pontos
};

fs.writeFileSync(outputFile, JSON.stringify(conteudoFinal, null, 2));
console.log(`✔ Sucesso! Criado pontos.json com ${pontos.length} pontos.`);
