# CARDOSO — portfólio

Design, desenvolvimento e sistemas. HTML, CSS e JavaScript puros, sem build.

## Rodar localmente

```bash
python -m http.server 5540
```

Abra http://localhost:5540

## Estrutura

```
index.html        página única (início + página do projeto)
css/style.css     estilos; cores e fonte no topo (:root)
js/data.js        CONFIG (contatos), CATEGORIES e PROJECTS
js/main.js        rotas, categorias, página do projeto, animações
assets/work/<id>/ hero.webp (1600), hero-sm.webp (800), s1/s2.webp, m.webp (celular)
```

## Contato

Preencha `whatsapp`, `email` e `instagram` em `js/data.js` (`window.CONFIG`).
Os que estiverem preenchidos aparecem no rodapé.

## Adicionar um projeto

1. Capture a página inicial do site em 1600×1000 e no celular em 390×844 @2x.
2. Salve em `assets/work/<id>/` (`hero.webp`, `hero-sm.webp`, `m.webp` e, se quiser, `s1.webp`, `s2.webp`).
3. Adicione um objeto em `PROJECTS` com a categoria (`cat`). Use `featured: N` para aparecer em "Trabalhos selecionados"
   e `url` para mostrar o botão "Ver projeto".

## Rotas

- `#/categoria/<id>` abre a categoria
- `#/projeto/<id>` abre a página do projeto

Tudo roda na rolagem normal da página: sem camadas fixas e sem travar o scroll.
O botão Voltar do navegador retorna à posição anterior.
