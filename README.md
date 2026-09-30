# Ezequias Cardoso — Arquivo

Portfólio pessoal. HTML, CSS e JavaScript puros, sem build.

## Rodar localmente

```bash
python -m http.server 5540
```

Abra http://localhost:5540

## Estrutura

```
index.html          página única
css/style.css       estilos (tokens no topo)
js/data.js          CONFIG, pastas (FOLDERS) e projetos (PROJECTS)
js/main.js          intro, lente do nome, pastas, visualizador, detalhe, rotas
assets/strip.webp   faixa de heros vista dentro das letras do nome
assets/work/<id>/   hero.webp (1600), hero-sm.webp (720), s1–s3.webp (telas), m.webp (celular)
```

## Contato

Preencha `email`, `whatsapp` e `instagram` em `js/data.js` (`window.CONFIG`).
Só os campos preenchidos aparecem na seção de contato.

## Adicionar um projeto

1. Rode o site do projeto e capture a hero em 1600×1000 (desktop) e 390×844 @2x (celular).
2. Salve em `assets/work/<id>/` como `hero.webp`, `hero-sm.webp`, `m.webp` e, se quiser, `s1..s3.webp`.
3. Adicione um objeto em `PROJECTS` (`js/data.js`) com a `folder` do nicho.
4. Para um nicho novo, adicione uma pasta em `FOLDERS` (com `accent` e as três `sheets` que aparecem saindo dela).

Variações de um mesmo template (ex.: as lojas de celular) entram em `variants` do projeto principal,
e não como projetos separados.

## Rotas

- `#/arquivo/<pasta>` abre uma pasta
- `#/arquivo/<pasta>/<projeto>` abre o detalhe do projeto

O botão Voltar do navegador fecha o detalhe e depois a pasta.
O campo `caseStudy` de cada projeto está reservado para uma página de estudo de caso.
