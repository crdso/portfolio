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
