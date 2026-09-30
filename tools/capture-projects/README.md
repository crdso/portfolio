# Captura de projetos

O script usa Playwright, Chromium e Pillow para visitar os builds locais sem alterar os sites de origem. Ele espera fontes e imagens, percorre a página para acionar conteúdo lazy, volta ao topo e salva `hero.webp`, `hero-sm.webp` e até três `section-XX.webp` em `staging/`. Com `--full`, tenta também uma página completa para revisão. Páginas muito longas ou com elementos grandes fixos/sticky não geram `full.webp`.

```powershell
pip install playwright pillow
python -m playwright install chromium
python tools/capture-projects/capture.py --all --full
python tools/capture-projects/capture.py blackburguer --positions 1200,2400,3300
```

As posições automáticas são sugestões. Revise cada imagem em `staging/` antes de copiar as escolhidas para `assets/work/<id>/` e atualizar `js/data.js`. `--positions` seleciona trechos manualmente, `--hero-y` permite usar uma seção como imagem de abertura quando a primeira dobra do site original está inadequada, `--source-dir` aponta para outro build e `--sites-root` altera a pasta dos sites locais. O MiPhone é construído a partir do código atual em `tools/capture-projects/build/`, sem escrever no projeto original.

Os projetos Best Multimarcas e Correio Elegante têm código local sem dependências instaladas ou build disponível; Studio Tavares e FindMap não foram localizados em `Sites`. As imagens existentes desses projetos precisam ser mantidas até que suas fontes estejam disponíveis.

`smoke.py` testa as rotas e a navegação em Chromium nas larguras 1440, 1366 e 390 pixels:

```powershell
python tools/capture-projects/smoke.py
```
