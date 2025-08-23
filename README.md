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
3. Inicie o servidor local para API e arquivos estáticos:
   ```sh
   npm start
   ```
   - `http://localhost:3000/mapa-airbnb.html` → visualiza o mapa
   - `http://localhost:3000/adm.html` → cadastra imóveis (`POST /api/imoveis`)
   - `http://localhost:3000/api/imoveis` → lista os imóveis cadastrados

   Os dados enviados são persistidos em `dados/imoveis.json` (arquivo ignorado pelo Git).

Os commits em `dados/pontos/**` disparam uma Action que recompila automaticamente o `pontos.json`.
