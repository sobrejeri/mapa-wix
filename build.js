const fs = require('fs').promises; // Usando a versão de promessas do 'fs'
const path = require('path');

const pastaPontos = path.join(__dirname, 'dados', 'pontos');
const arquivoSaida = path.join(__dirname, 'pontos.json');

async function compilarPontos() {
  try {
    // Lê todos os nomes de arquivos no diretório
    const arquivos = await fs.readdir(pastaPontos);

    // Filtra para garantir que estamos processando apenas arquivos .json
    const arquivosJson = arquivos.filter(arquivo => path.extname(arquivo).toLowerCase() === '.json');

    // Lê o conteúdo de cada arquivo JSON e o converte para objeto
    const todosPontos = await Promise.all(
      arquivosJson.map(async (arquivo) => {
        const caminhoCompleto = path.join(pastaPontos, arquivo);
        const conteudo = await fs.readFile(caminhoCompleto, 'utf8');
        return JSON.parse(conteudo);
      })
    );

    // Escreve o array de pontos no arquivo de saída
    await fs.writeFile(arquivoSaida, JSON.stringify(todosPontos, null, 2), 'utf8');
    
    console.log(`✅ Sucesso! ${todosPontos.length} pontos foram compilados em pontos.json.`);
  } catch (err) {
    console.error('❌ Erro ao compilar os pontos:', err);
    process.exit(1); // Encerra o script com um código de erro
  }
}

// Executa a função
compilarPontos();
