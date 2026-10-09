# CARDOSO — portfólio

Design, desenvolvimento e sistemas. HTML, CSS e JavaScript puros, sem build.

## Rodar localmente

```bash
python -m http.server 5540
```

Abra http://localhost:5540

## Estrutura

```
index.html        home + modal de categorias e projetos
css/style.css     estilos; cores e fonte no topo (:root)
js/data.js        CONFIG (contatos), CATEGORIES e PROJECTS
js/main.js        pastas, conteúdo do modal e animações
assets/work/<id>/ hero.webp (1600), hero-sm.webp (800), section-01/02/03.webp
sites/<slug>/      cópias publicáveis dos projetos vinculados no portfólio
tools/publish_sites.py  inventário e publicação a partir das fontes originais
tools/validate_sites.py capturas e checagem de URLs no servidor estático
tools/capture-projects/ captura local em Chromium e teste de navegação
```

## Contato

Os contatos exibidos no rodapé ficam em `js/data.js` (`window.CONFIG`).

## Adicionar um projeto

1. Use `tools/capture-projects/capture.py` para capturar o site local. Revise as imagens em `staging/`.
2. Copie `hero.webp`, `hero-sm.webp` e até três trechos bons para `assets/work/<id>/`.
3. Adicione o projeto em `PROJECTS` com a categoria (`cat`) e os arquivos escolhidos em `shots`.

## Navegação

Uma pasta abre um modal sobre a home. Os cards mostram os projetos dentro do mesmo modal; Voltar retorna à categoria e X, ESC ou clique no fundo fecham a janela. A posição da home é preservada.

Cada detalhe de projeto oferece **Ver site ↗**, que abre `/sites/<slug>/` em nova aba, e mantém o contato pelo WhatsApp. Os sites em `sites/` são builds ou cópias estáticas dos projetos originais, publicados em subpastas independentes. Rodar `python -m http.server 5540` na raiz e abrir `http://localhost:5540/sites/<slug>/` reproduz a estrutura de `cardoso.pro`.

Os projetos React/Vite são compilados em uma cópia temporária ignorada pelo Git; a origem não é alterada. A publicação inclui apenas arquivos públicos, sem `node_modules` ou arquivos `.env`. ENTEC e Correio Elegante disponibilizam suas experiências públicas; painéis administrativos não fazem parte das cópias.

Alguns exports históricos de Next.js/Framer já trazem avisos de hidratação no navegador. O pacote-fonte da Bucco inclui as capas dos vídeos, mas não os MP4 originais; a área mantém as capas e as tentativas de vídeo retornam 404. A galeria da ENTEC e os dados públicos do Correio ainda dependem dos serviços externos originais.
