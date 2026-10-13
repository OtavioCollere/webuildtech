# WeBuild Tech — site + portfólio

Site estático (HTML/CSS/JS puro, sem build). A raiz é a landing da WeBuild; cada
protótipo de cliente vive numa subpasta de `portfolio/` e é aberto pelo card na
seção Portfólio.

## Estrutura

```
index.html                     landing da WeBuild
landing.css / landing.js       estilos e interações da landing
assets/case-dms/               imagens do case antes/depois
assets/portfolio/<slug>.jpg    thumb de cada card do portfólio
assets/time/<nome>.jpg         foto de cada sócio (quadrada, ver abaixo)
portfolio/<slug>/              landing completa de cada protótipo
```

## Adicionando um protótipo

1. Copiar a landing para `portfolio/<slug>/`, com `index.html` na raiz da pasta.
   Todos os caminhos precisam ser relativos (`assets/foto.png`, nunca
   `/assets/foto.png`), senão apontam para a raiz da WeBuild.
2. Colocar `<meta name="robots" content="noindex">` no `<head>` de cada HTML do
   protótipo, para ele não ser indexado pelo Google.
3. Gerar a thumb (1440×900, com o servidor local rodando):

   ```bash
   cd /Users/otaviotakaki/Documents/development/pessoal/lps/webuild_site
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1440,900 --virtual-time-budget=5000 --screenshot=/tmp/thumb.png http://localhost:8000/portfolio/nome-do-projeto/
   sips -s format jpeg -s formatOptions 82 /tmp/thumb.png --out assets/portfolio/nome-do-projeto.jpg
   ```

   Se a landing esconde o conteúdo até o scroll (animação de entrada), o print
   sai em branco. Nesse caso, tire o print no navegador.
4. Duplicar um `<a class="proj">` da seção `#portfolio` do `index.html` e
   trocar href, imagem, nome e categoria.

Quando o cliente já tem site no ar e não existe protótipo para copiar, pule os
passos 1 e 2: o card aponta para o domínio (`target="_blank" rel="noopener"`),
o rótulo vira "Abrir site" e a thumb é um print do site publicado.

## Foto dos sócios

`assets/time/<primeiro-nome>.jpg`, **quadrada**, JPEG qualidade 82, alvo ≤ 140 KB. O card é 1:1, então
a foto não sofre recorte do `object-fit` — o enquadramento tem que vir pronto no arquivo. As duas
fotos atuais foram igualadas na mão para o rosto ficar do mesmo tamanho nos dois cards; foto nova
precisa do mesmo tratamento, senão um sócio aparece o dobro do outro.

```bash
sips -c 520 520 --cropOffset <y> <x> origem.jpg --out /tmp/c.jpg   # enquadra no rosto
sips -s format jpeg -s formatOptions 82 -Z 800 /tmp/c.jpg --out assets/time/nome.jpg
```

Sem o `<img>`, o `::after` do `.who-shot` desenha as iniciais do `data-initials` — o card nunca fica
com imagem quebrada.

## Rodando local

```bash
cd /Users/otaviotakaki/Documents/development/pessoal/lps/webuild_site
python3 -m http.server 8000
```

Abra http://localhost:8000. Precisa ser via servidor: abrindo o `index.html`
direto do disco, o link `portfolio/<slug>/` mostra a listagem da pasta em vez
da landing.

## Versão dos assets

`index.html` carrega `landing.css?v=N` e `landing.js?v=N`. **Toda vez que mexer no CSS ou no JS, suba o
N nos dois.** Sem isso o navegador serve o arquivo antigo junto com o HTML novo: as classes que já
existiam continuam estilizadas e só as novas aparecem cruas, que é um defeito difícil de reconhecer —
parece HTML quebrado, não cache.

## Deploy

Qualquer hospedagem estática. Na Vercel: Framework Preset **Other**, Build,
Output e Install vazios. Sem `vercel.json` com `cleanUrls` — em deploy estático
a raiz passa a responder 404.

## Origem dos protótipos

- `portfolio/flex-atacadista/` — cópia do repo `weebuildtech/flex_atacadista`
  (commit `f012358`), sem README e `.gitignore`, com `noindex` adicionado.
- `portfolio/espaco-sorriso/` — zip `Clinica Espaço Sorriso`. A thumb é do hero
  depois de ~1200px de scroll: a imagem só abre com o scroll.
- `portfolio/ramaro-men/` — zip `Ramaro Project` (`Ramaro Men.html` virou
  `index.html`). React + Babel carregados da unpkg e JSX compilado no navegador,
  então o primeiro carregamento é mais lento que o dos outros.
- `toroid.com.br` — site no ar, sem cópia local. A thumb saiu de um print via
  CDP com o banner de cookies aceito antes do clique: no `--screenshot` do
  Chrome headless o banner aparece e cobre a faixa de baixo.
