
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const pasta = path.join(__dirname, 'dados/pontos');
const saida = path.join(__dirname, 'pontos.json');

const arquivos = fs.readdirSync(pasta).filter(arquivo => arquivo.endsWith('.md'));

const dados = arquivos.map(arquivo => {
  const conteudo = fs.readFileSync(path.join(pasta, arquivo), 'utf8');
  const { data } = matter(conteudo);
  return {
    title: data.nome || '',
    lat: parseFloat(data.latitude),
    lng: parseFloat(data.longitude),
    image: data.imagem || '',
    link: data.link || '',
    description: data.descricao || ''
  };
});

fs.writeFileSync(saida, JSON.stringify(dados, null, 2));
console.log('✔ pontos.json atualizado com sucesso!');
