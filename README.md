# mapa-wix

Mapa de imóveis estilo Airbnb para Jericoacoara.

## Desenvolvimento

1. Instale as dependências (se houver):
   ```sh
   npm install
   ```
2. Compile os dados dos imóveis:
   ```sh
   npm run build:pontos
   ```
   Isso lê `dados/pontos/*.json` e gera `pontos.json` na raiz.
3. Abra `mapa-airbnb.html` no navegador para visualizar o mapa.

Os commits em `dados/pontos/**` disparam uma Action que recompila automaticamente o `pontos.json`.
