const fs = require('fs');
const path = require('path');

// A biblioteca 'gray-matter' não é necessária e foi removida.

const dir = path.join(__dirname, 'dados/pontos');
const outputFile = path.join(__dirname, 'pontos.json');

let files;
try {
  // Lê todos os arquivos do diretório de pontos
  files = fs.readdirSync(dir);
} catch (error) {
  console.error(`ERRO: Não foi possível ler o diretório: ${dir}`);
  console.error(error);
  process.exit(1); // Encerra o script com erro
}

const pontos = [];

files.forEach((file) => {
  // Garante que estamos a processar apenas arquivos .json
  if (path.extname(file).toLowerCase() === '.json') {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    try {
      // Converte o conteúdo do arquivo (texto) para um objeto JavaScript
      const data = JSON.parse(fileContent);

      // Verifica se os campos essenciais existem no arquivo
      if (data.name && data.latitude && data.longitude) {
        pontos.push({
          nome: data.name,
          descricao: data.descricao || "", // Usa "" se a descrição não existir
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          imagem: data.imagem || "", // Usa "" se a imagem não existir
          link: data.link || "" // Usa "" se o link não existir
        });
      } else {
        console.warn(`AVISO: O arquivo ${file} foi ignorado porque não contém os campos 'name', 'latitude' ou 'longitude'.`);
      }
    } catch (e) {
      console.error(`ERRO: Falha ao processar o arquivo JSON: ${file}. Verifique se o formato está correto.`);
      console.error(e);
    }
  }
});

// Cria o objeto final que será salvo no arquivo pontos.json
const conteudoFinal = {
  atualizado_em: new Date().toISOString(),
  pontos: pontos
};

// Escreve o arquivo final
fs.writeFileSync(outputFile, JSON.stringify(conteudoFinal, null, 2));
console.log(`✔ Sucesso! O arquivo pontos.json foi gerado com ${pontos.length} pontos.`);
