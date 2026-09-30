/* Ezequias Cardoso — Arquivo
   Sem dependências obrigatórias. Lenis (rolagem suave) é carregado só em
   desktop com ponteiro fino e sem movimento reduzido. */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobileMQ = matchMedia('(max-width: 760px)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = (n) => String(n).padStart(2, '0');
  const img = (path) => `assets/work/${path}.webp`;

  const FOLDERS = window.FOLDERS || [];
  const PROJECTS = window.PROJECTS || [];
  const CONFIG = window.CONFIG || {};
  const byFolder = (id) => PROJECTS.filter((p) => p.folder === id);
  const folderById = (id) => FOLDERS.find((f) => f.id === id);
  const projectById = (id) => PROJECTS.find((p) => p.id === id);

  /* ---------- mola → easing linear() ---------- */
  const SUPPORTS_LINEAR = window.CSS && CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)');
  function spring({ stiffness = 170, damping = 20, mass = 1 } = {}) {
    if (!SUPPORTS_LINEAR) return { easing: 'cubic-bezier(.2, 1.1, .3, 1)', duration: 900 };
    let x = 0, v = 0; const dt = 1 / 120; const pts = [];
    for (let i = 0; i < 480; i++) {
      const a = (-stiffness * (x - 1) - damping * v) / mass;
      v += a * dt; x += v * dt; pts.push(x);
      if (i > 30 && Math.abs(x - 1) < 0.0008 && Math.abs(v) < 0.002) break;
    }
    const step = Math.max(1, Math.floor(pts.length / 60));
    const list = pts.filter((_, i) => i % step === 0).map((p) => +p.toFixed(4));
    list[list.length - 1] = 1;
    return { easing: `linear(0, ${list.join(', ')})`, duration: Math.round(pts.length * dt * 1000) };
  }
  const SPRING_SOFT = spring({ stiffness: 140, damping: 17 });
  const EASE_OUT = 'cubic-bezier(.16, 1, .3, 1)';
  const EASE_IO = 'cubic-bezier(.76, 0, .24, 1)';

  /* ---------- split de letras ---------- */
  function split(el) {
    if (!el || el.dataset.splitDone) return;
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((c, i) => {
      const s = document.createElement('span');
      if (c === ' ') { el.appendChild(document.createTextNode(' ')); return; }
      s.className = 'ch'; s.style.setProperty('--i', i);
      s.textContent = c;
      el.appendChild(s);
    });
    el.dataset.splitDone = '1';
  }
  $$('[data-split]').forEach(split);
  $$('.name__work').forEach(split);

  /* ---------- relógio ---------- */
  const clockEl = $('[data-clock]');
  const tick = () => {
    if (!clockEl) return;
    clockEl.textContent = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Araguaina', hour: '2-digit', minute: '2-digit' }).format(new Date());
  };
  tick(); setInterval(tick, 15000);
  const yearEl = $('[data-year]'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nome: ajuste à largura ---------- */
  const nameEl = $('.name');
  const row1 = $('.name__row--1 .name__solid');
  function fitName() {
    if (!nameEl || !row1) return;
    const avail = nameEl.clientWidth;
    nameEl.style.setProperty('--fs', '100px');
    const w = row1.scrollWidth;
    const fs = Math.min(100 * (avail / w) * 0.995, window.innerHeight * 0.36);
    nameEl.style.setProperty('--fs', fs.toFixed(2) + 'px');
  }
  fitName();
  if (document.fonts) { document.fonts.load('800 100px Archivo').then(fitName).catch(() => {}); document.fonts.ready.then(fitName); }
  addEventListener('resize', fitName);

  /* ---------- intro ---------- */
  const intro = $('.intro');
  const hero = $('.hero');
  let seen = root.classList.contains('seen');
  const hasRoute = /^#\/arquivo\//.test(location.hash);

  function showHero() {
    hero && hero.classList.add('is-shown');
    $$('.name__solid').forEach((el) => el.parentElement.classList.add('is-shown'));
    $$('.name__row').forEach((el) => el.classList.add('is-shown'));
  }

  function runIntro() {
    if (!intro || seen || reduced || hasRoute) { if (intro) intro.remove(); showHero(); return; }
    try { sessionStorage.setItem('ec-intro', '1'); } catch (e) {}
    const typed = $('.intro__typed', intro);
    const list = $('.intro__list', intro);
    const count = $('[data-intro-count]', intro);
    const cmd = typed.dataset.type;
    FOLDERS.forEach((f) => {
      const li = document.createElement('li');
      const n = byFolder(f.id).length;
      li.innerHTML = `drwxr-xr-x&nbsp;&nbsp;<b>${f.id}/</b>&nbsp;&nbsp;${pad(n)} ${n === 1 ? 'arquivo' : 'arquivos'}`;
      list.appendChild(li);
    });
    let k = 0;
    const typeIv = setInterval(() => { typed.textContent = cmd.slice(0, ++k); if (k >= cmd.length) clearInterval(typeIv); }, 38);
    $$('li', list).forEach((li, i) => setTimeout(() => li.classList.add('is-in'), 520 + i * 90));
    const t0 = performance.now(); const D = 1500;
    const countUp = (t) => {
      const p = clamp((t - t0) / D);
      count.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * 100)).padStart(3, '0');
      if (p < 1) requestAnimationFrame(countUp);
      else setTimeout(() => { intro.classList.add('is-out'); setTimeout(showHero, 380); setTimeout(() => intro.remove(), 1000); }, 180);
    };
    requestAnimationFrame(countUp);
  }
  runIntro();

  if (!fine) { const hint = $('.hero__lens-hint'); if (hint) hint.innerHTML = '<span class="pulse"></span> Olhe dentro das letras — <em>o nome é feito dos meus sites.</em>'; }

  /* ---------- cursor ---------- */
  const cursor = $('.cursor');
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, inside: false };
  addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.inside = true; }, { passive: true });
  if (fine && cursor && !reduced) {
    const dot = $('.cursor__dot', cursor), ring = $('.cursor__ring', cursor), label = $('.cursor__label', cursor);
    let rx = pointer.x, ry = pointer.y;
    const loop = () => {
      rx = lerp(rx, pointer.x, 0.2); ry = lerp(ry, pointer.y, 0.2);
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) { label.textContent = t.dataset.cursor; cursor.classList.add('has-label'); }
    });
    document.addEventListener('pointerout', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t && !t.contains(e.relatedTarget)) cursor.classList.remove('has-label');
    });
    addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  }

  /* ---------- lente do nome + grade de pontos ---------- */
  const works = $$('.name__work');
  const canvas = $('.hero__dots');
  let heroVisible = true;
  if (hero) new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; if (heroVisible) startHero(); }, { threshold: 0 }).observe(hero);

  const lens = { x: -999, y: -999, r: 0, tr: 0 };
  let bx = 0, heroRaf = 0;
  const ctx = canvas && canvas.getContext('2d');
  let dots = [], cw = 0, ch = 0, dpr = 1;
  function sizeDots() {
    if (!canvas) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    cw = canvas.clientWidth; ch = canvas.clientHeight;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    const gap = mobileMQ.matches ? 26 : 24;
    dots = [];
    for (let y = gap / 2; y < ch; y += gap) for (let x = gap / 2; x < cw; x += gap) dots.push(x, y);
  }
  sizeDots(); addEventListener('resize', sizeDots);

  function drawDots(t) {
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    const hr = hero.getBoundingClientRect();
    const px = pointer.x - hr.left, py = pointer.y - hr.top;
    const cx = cw * 0.5, cy = ch * 0.55;
    const wave = reduced ? -1 : ((t / 1000) % 7) / 6 * Math.hypot(cw, ch) * 0.6; // onda a cada 7s
    for (let i = 0; i < dots.length; i += 2) {
      const x = dots[i], y = dots[i + 1];
      let a = 0.1, r = 0.8, hot = 0;
      if (fine) {
        const d = Math.hypot(x - px, y - py);
        if (d < 170) { const k = 1 - d / 170; a += k * 0.55; r += k * 1.3; hot = k; }
      }
      if (wave > 0) {
        const dw = Math.abs(Math.hypot(x - cx, y - cy) - wave);
        if (dw < 40) { const k = 1 - dw / 40; a += k * 0.28; r += k * 0.9; }
      }
      ctx.fillStyle = hot > 0.55 ? `rgba(255,79,31,${a})` : `rgba(236,231,222,${a})`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
  }

  function heroLoop(t) {
    heroRaf = 0;
    if (!heroVisible || !hero) return;
    // lente: segue o cursor com atraso; no toque, passeia sozinha pelo nome
    const nr = nameEl.getBoundingClientRect();
    let tx, ty, want;
    if (fine && pointer.inside) {
      tx = pointer.x; ty = pointer.y;
      const m = 60;
      want = tx > nr.left - m && tx < nr.right + m && ty > nr.top - m && ty < nr.bottom + m;
    } else {
      const s = t / 1000;
      tx = nr.left + nr.width * (0.5 + 0.42 * Math.sin(s * 0.45));
      ty = nr.top + nr.height * (0.5 + 0.34 * Math.sin(s * 0.9 + 1));
      want = true;
    }
    lens.tr = want ? Math.max(90, Math.min(nr.height * 0.42, 190)) : 0;
    lens.x = lens.x < -900 ? tx : lerp(lens.x, tx, 0.14);
    lens.y = lens.y < -900 ? ty : lerp(lens.y, ty, 0.14);
    lens.r = lerp(lens.r, lens.tr, 0.1);
    if (!reduced) bx -= 0.35;
    works.forEach((w) => {
      const r = w.getBoundingClientRect();
      w.style.setProperty('--lx', (lens.x - r.left).toFixed(1) + 'px');
      w.style.setProperty('--ly', (lens.y - r.top).toFixed(1) + 'px');
      w.style.setProperty('--lr', lens.r.toFixed(1) + 'px');
      w.style.setProperty('--bx', (bx - r.left * 0.0).toFixed(1) + 'px');
    });
    drawDots(t);
    heroRaf = requestAnimationFrame(heroLoop);
  }
  function startHero() { if (!heroRaf && hero) heroRaf = requestAnimationFrame(heroLoop); }
  startHero();
  if (reduced) setTimeout(() => { drawDots(0); }, 50);

  /* ---------- topo e caminho ---------- */
  const top = $('.top');
  const pathEl = $('[data-path]');
  let viewerPath = null;
  const sectionPaths = [['#contato', 'ezequias-cardoso/arquivo/nova-pasta'], ['#sobre', 'ezequias-cardoso/sobre.txt'], ['#arquivo', 'ezequias-cardoso/arquivo']];
  function onScroll() {
    const y = scrollY;
    top.classList.toggle('is-solid', y > innerHeight * 0.55);
    if (viewerPath) return;
    let p = 'ezequias-cardoso';
    for (const [sel, txt] of sectionPaths) { const el = $(sel); if (el && el.getBoundingClientRect().top < innerHeight * 0.45) { p = txt; break; } }
    if (pathEl.textContent !== p) pathEl.textContent = p;
    // parallax leve do hero
    if (hero && !reduced && y < innerHeight * 1.2) {
      $('.hero__inner').style.transform = `translate3d(0, ${(y * 0.22).toFixed(1)}px, 0)`;
      $('.hero__inner').style.opacity = String(clamp(1 - y / (innerHeight * 0.95)));
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-shown');
    if (en.target.matches('.cabinet')) setTimeout(() => en.target.classList.add('is-settled'), 1600);
    io.unobserve(en.target);
  }), { threshold: 0.12 });
  $$('.archive__big, .contact__title [data-split], [data-reveal]').forEach((el) => io.observe(el));

  /* frase do "sobre" acende palavra por palavra */
  const statement = $('[data-words]');
  if (statement) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(' '));
            else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(statement);
    const words = $$('.w', statement);
    const lightWords = () => {
      const r = statement.getBoundingClientRect();
      const p = clamp((innerHeight * 0.82 - r.top) / (r.height + innerHeight * 0.25));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
    };
    addEventListener('scroll', lightWords, { passive: true }); lightWords();
  }

  /* ---------- contato ---------- */
  const contact = $('[data-contact]');
  if (contact) {
    const links = [];
    if (CONFIG.email) links.push([`mailto:${CONFIG.email}`, CONFIG.email, 'escrever', true]);
    if (CONFIG.whatsapp) links.push([`https://wa.me/${CONFIG.whatsapp}`, 'WhatsApp ↗', 'conversar', !CONFIG.email]);
    if (CONFIG.instagram) links.push([CONFIG.instagram, 'Instagram ↗', 'ver']);
    if (CONFIG.github) links.push([CONFIG.github, `github.com/${CONFIG.github.split('/').pop()} ↗`, 'código', !links.length]);
    contact.innerHTML = links.map(([href, txt, cur, main]) =>
      `<a class="pill${main ? ' pill--signal' : ''}" href="${href}" target="_blank" rel="noopener" data-cursor="${cur}"><b>${txt}</b></a>`).join('');
  }

  /* ---------- armário de pastas ---------- */
  const cabinet = $('[data-cabinet]');
  const totalVariants = PROJECTS.reduce((n, p) => n + (p.variants ? p.variants.length : 0), 0);
  const setStat = (k, v) => { const el = $(`[data-stat="${k}"]`); if (el) el.textContent = pad(v); };
  setStat('folders', FOLDERS.length); setStat('projects', PROJECTS.length); setStat('variants', totalVariants);

  FOLDERS.forEach((f, i) => {
    const projects = byFolder(f.id);
    const vars = projects.reduce((n, p) => n + (p.variants ? p.variants.length : 0), 0);
    const wrap = document.createElement('div');
    wrap.setAttribute('role', 'listitem');
    wrap.innerHTML = `
      <button class="folder" type="button" data-folder="${f.id}" data-cursor="abrir"
        aria-haspopup="dialog" aria-label="Abrir pasta ${f.name}: ${projects.map((p) => p.name).join(', ')}"
        style="--accent:${f.accent};--i:${i};--tab:${(i % 3) * 20}%;--tab-m:${(i % 2) * 46}%">
        <span class="folder__back"><span class="folder__tab mono">${pad(i + 1)}·${f.id}</span></span>
        <span class="folder__sheets">
          ${f.sheets.map((s) => `<span class="sheet"><img src="${img(s)}" alt="" loading="lazy" decoding="async"></span>`).join('')}
        </span>
        <span class="folder__front">
          <span class="folder__n">${pad(i + 1)}</span>
          <span>
            <span class="folder__name">${f.name}${f.alias ? ` <span class="folder__alias">/ ${f.alias}</span>` : ''}</span>
            <span class="folder__meta mono"><span>${pad(projects.length)} ${projects.length === 1 ? 'projeto' : 'projetos'}${vars ? ` · ${pad(vars)} var.` : ''}</span><span class="folder__open">abrir ↗</span></span>
          </span>
        </span>
      </button>`;
    cabinet.appendChild(wrap);
  });
  io.observe(cabinet);

  /* inclinação sutil das pastas seguindo o cursor */
  if (fine && !reduced) {
    $$('.folder', cabinet).forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        el.style.transform = `translateY(-10px) rotateY(${(x * 10).toFixed(2)}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- visualizador ---------- */
  const viewer = $('.viewer');
  const vBg = $('.viewer__bg', viewer);
  const track = $('[data-v-track]', viewer);
  const big = $('.bigfolder', viewer);
  const bigFront = $('.bigfolder__front', big);
  const detail = $('.detail', viewer);
  const progress = $('[data-v-progress]', viewer);
  const state = { folder: null, project: null, source: null, busy: false, pushed: 0 };

  function renderFolder(f) {
    const idx = FOLDERS.indexOf(f);
    viewer.style.setProperty('--accent', f.accent);
    $('[data-v-crumb]', viewer).textContent = f.id + '/';
    $('[data-v-index]', viewer).textContent = `pasta ${pad(idx + 1)} de ${pad(FOLDERS.length)}`;
    const title = $('[data-v-title]', viewer);
    title.textContent = f.name; delete title.dataset.splitDone; split(title); title.style.setProperty('--chars', f.name.length);
    $('[data-v-note]', viewer).textContent = f.note;
    $('[data-v-tab]', viewer).textContent = `${pad(idx + 1)} / ${f.id}`;
    $('[data-v-flap]', viewer).textContent = f.name;
    const projects = byFolder(f.id);
    $('[data-v-count]', viewer).textContent = `${pad(projects.length)} ${projects.length === 1 ? 'arquivo' : 'arquivos'}`;
    track.innerHTML = projects.map((p) => {
      const url = p.repo ? `github.com/${p.repo}` : p.name.toLowerCase().replace(/\s+/g, '-');
      const stack = (p.variants || []).slice(0, 3).map((v) =>
        `<div class="frame"><div class="frame__chrome mono"><i></i><i></i><i></i></div><div class="frame__shot"><img src="${img(v.id + '/hero-sm')}" alt="" loading="lazy"></div></div>`).join('');
      return `
      <div class="file" data-project="${p.id}">
        <button class="file__card" type="button" data-cursor="abrir" aria-label="Abrir projeto ${p.name}">
          ${stack ? `<div class="file__stack" aria-hidden="true">${stack}</div>` : ''}
          <div class="frame">
            <div class="frame__chrome mono"><i></i><i></i><i></i><span>${url}</span></div>
            <div class="frame__shot">
              <picture>
                ${p.mobile ? `<source media="(max-width: 760px)" srcset="${img(p.id + '/m')}">` : ''}
                <img src="${img(p.id + '/hero')}" srcset="${img(p.id + '/hero-sm')} 720w, ${img(p.id + '/hero')} 1600w"
                  sizes="60vw" alt="Hero do site ${p.name}" decoding="async">
              </picture>
              <span class="frame__glare"></span>
            </div>
          </div>
          ${p.variants ? `<span class="file__badge mono">+${p.variants.length} ${p.variants.length === 1 ? 'variação' : 'variações'}</span>` : ''}
        </button>
        <div class="file__cap">
          <p class="file__name">${p.name}</p>
          <p class="file__niche">${p.niche}</p>
          <p class="file__meta mono"><span><b>${p.place}</b></span><span>${p.stack.join(' · ')}</span>${p.status ? '<span>em desenvolvimento</span>' : ''}</p>
        </div>
      </div>`;
    }).join('');
    track.scrollLeft = 0; trackTarget = 0;
    updateProgress();
    bindFiles();
  }

  /* posições da pasta grande */
  function bigStates() {
    const r = big.getBoundingClientRect(); // estado base (sem transform inline)
    const h = r.height;
    const center = mobileMQ.matches ? -(innerHeight * 0.34) : -(innerHeight * 0.3);
    let dock = mobileMQ.matches ? `translate(-50%, ${h * 1.2}px)` : `translate(-50%, ${h * 0.7}px) scale(.9)`;
    if (innerWidth > 1100) { // encaixa sob a coluna do título
      const pad = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pad')) || 32;
      const col = Math.min(innerWidth * 0.34, 460);
      const s = col / r.width;
      const dx = pad + col / 2 - innerWidth / 2;
      dock = `translate(calc(-50% + ${dx.toFixed(1)}px), ${(h * (1 - s) / 2 + h * s * 0.5).toFixed(1)}px) scale(${s.toFixed(3)})`;
    }
    return { base: r, stage: `translate(-50%, ${center}px)`, dock };
  }
  function sourceTransform(src, base) {
    const s = src.getBoundingClientRect();
    const sx = s.width / base.width;
    const dx = s.left + s.width / 2 - (base.left + base.width / 2);
    const dy = (s.top + s.height * 0.62) - (base.top + base.height / 2);
    return `translate(calc(-50% + ${dx.toFixed(1)}px), ${dy.toFixed(1)}px) scale(${sx.toFixed(4)})`;
  }
  function measureBase() {
    const cur = big.style.transform; big.style.transform = '';
    const s = bigStates(); big.style.transform = cur; return s;
  }

  let lenis = null;
  function lockPage(lock) {
    if (lenis) lock ? lenis.stop() : lenis.start();
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  async function openFolder(id, { instant = false } = {}) {
    const f = folderById(id); if (!f) return;
    if (state.folder === id) return;
    if (state.folder) { renderFolder(f); state.folder = id; setViewerPath(); return; }
    state.folder = id; state.busy = true;
    const src = $(`.folder[data-folder="${id}"]`, cabinet);
    state.source = src;
    renderFolder(f);
    lockPage(true);
    viewer.hidden = false;
    src && src.setAttribute('aria-expanded', 'true');
    setViewerPath();

    const files = $$('.file__card', track);
    if (reduced || instant) {
      vBg.style.opacity = 1; big.style.transform = bigStates().dock; bigFront.style.transform = 'rotateX(-118deg)';
      viewer.classList.add('is-open');
      files.forEach((c) => (c.style.opacity = 1));
      state.busy = false; focusViewer(); return;
    }

    big.style.transform = ''; bigFront.style.transform = '';
    const st = bigStates();
    const from = src ? sourceTransform(src, st.base) : st.stage;
    src && src.classList.add('is-source');
    big.style.transform = from;
    files.forEach((c) => (c.style.opacity = 0));

    vBg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: EASE_OUT, fill: 'forwards' });
    const a1 = big.animate([{ transform: from }, { transform: st.stage }], { duration: 700, easing: EASE_OUT, fill: 'forwards' });
    await a1.finished;
    viewer.classList.add('is-open');
    bigFront.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-118deg)' }], { duration: 650, easing: EASE_OUT, fill: 'forwards' });

    // arquivos saem de dentro da pasta
    const br = big.getBoundingClientRect();
    const fx = br.left + br.width / 2, fy = br.top + br.height * 0.35;
    files.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const dx = fx - (r.left + r.width / 2), dy = fy - (r.top + r.height / 2);
      const rot = (i % 2 ? 1 : -1) * (6 + i * 2);
      c.style.opacity = 1;
      c.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(.22) rotate(${rot}deg)`, opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { transform: 'none', opacity: 1 }
      ], { duration: SPRING_SOFT.duration, easing: SPRING_SOFT.easing, delay: 120 + i * 110, fill: 'backwards' });
    });
    setTimeout(() => {
      big.animate([{ transform: st.stage }, { transform: st.dock }], { duration: 900, easing: EASE_IO, fill: 'forwards' });
    }, 420);
    setTimeout(() => { state.busy = false; focusViewer(); }, 900);
  }

  async function closeFolder() {
    if (!state.folder || state.busy) return;
    state.busy = true;
    if (state.project) await closeDetail(true);
    const src = state.source;
    const files = $$('.file__card', track);
    viewer.classList.remove('is-open');
    if (reduced) {
      finishClose(); return;
    }
    big.getAnimations().forEach((a) => { if (a.commitStyles) a.commitStyles(); a.cancel(); });
    const st = measureBase();
    // a pasta sobe do encaixe e os arquivos voltam para dentro dela
    await big.animate([{ transform: big.style.transform || st.dock }, { transform: st.stage }], { duration: 420, easing: EASE_OUT, fill: 'forwards' }).finished;
    const br = big.getBoundingClientRect();
    const fx = br.left + br.width / 2, fy = br.top + br.height * 0.4;
    await Promise.all(files.map((c, i) => {
      const r = c.getBoundingClientRect();
      const dx = fx - (r.left + r.width / 2), dy = fy - (r.top + r.height / 2);
      return c.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(.2) rotate(${i % 2 ? 8 : -8}deg)`, opacity: 0 }],
        { duration: 460, easing: 'cubic-bezier(.5, 0, .75, 0)', delay: (files.length - 1 - i) * 60, fill: 'forwards' }).finished;
    }));
    bigFront.getAnimations().forEach((a) => a.cancel());
    await bigFront.animate([{ transform: 'rotateX(-118deg)' }, { transform: 'rotateX(0deg)' }], { duration: 420, easing: EASE_OUT, fill: 'forwards' }).finished;
    let to = st.stage;
    if (src) { const ss = src.getBoundingClientRect(); if (ss.bottom > 0 && ss.top < innerHeight) to = sourceTransform(src, st.base); }
    vBg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, easing: EASE_OUT, fill: 'forwards' });
    await big.animate([{ transform: st.stage }, { transform: to }], { duration: 560, easing: EASE_OUT, fill: 'forwards' }).finished;
    finishClose();
  }
  function finishClose() {
    const src = state.source;
    viewer.hidden = true;
    [big, bigFront, vBg].forEach((el) => { el.getAnimations().forEach((a) => a.cancel()); el.style.transform = ''; });
    vBg.style.opacity = '';
    track.innerHTML = '';
    if (src) { src.classList.remove('is-source'); src.setAttribute('aria-expanded', 'false'); src.focus({ preventScroll: true }); }
    state.folder = null; state.source = null; state.busy = false;
    lockPage(false); viewerPath = null; onScroll();
  }

  function setViewerPath() {
    const f = state.folder ? folderById(state.folder) : null;
    viewerPath = f ? `ezequias-cardoso/arquivo/${f.id}${state.project ? '/' + state.project : ''}` : null;
    if (viewerPath) pathEl.textContent = viewerPath;
  }

  function focusViewer() {
    const btn = state.project ? $('[data-d-close]', detail) : $('[data-close]', viewer);
    btn && btn.focus({ preventScroll: true });
  }

  /* trilho: roda vira horizontal, arrasto com inércia */
  let trackTarget = 0, trackRaf = 0;
  function updateProgress() {
    const max = track.scrollWidth - track.clientWidth;
    progress.parentElement.style.opacity = max > 4 ? 1 : 0;
    progress.style.setProperty('--p', max > 4 ? (track.scrollLeft / max).toFixed(3) : 1);
  }
  track.addEventListener('scroll', updateProgress, { passive: true });
  function glide() {
    trackRaf = 0;
    const d = trackTarget - track.scrollLeft;
    if (Math.abs(d) < 0.5) { track.scrollLeft = trackTarget; return; }
    track.scrollLeft += d * 0.14;
    trackRaf = requestAnimationFrame(glide);
  }
  track.addEventListener('wheel', (e) => {
    if (mobileMQ.matches) return;
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 0) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    trackTarget = clamp((trackRaf ? trackTarget : track.scrollLeft) + delta * 1.1, 0, max);
    if (!trackRaf) trackRaf = requestAnimationFrame(glide);
  }, { passive: false });
  let drag = null;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false, v: 0, lx: e.clientX, lt: performance.now() };
  });
  addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; track.classList.add('is-dragging'); }
    if (drag.moved) {
      const now = performance.now();
      drag.v = (e.clientX - drag.lx) / Math.max(1, now - drag.lt); drag.lx = e.clientX; drag.lt = now;
      track.scrollLeft = drag.left - dx; trackTarget = track.scrollLeft;
    }
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    if (drag.moved) {
      const max = track.scrollWidth - track.clientWidth;
      trackTarget = clamp(track.scrollLeft - drag.v * 260, 0, max);
      if (!trackRaf) trackRaf = requestAnimationFrame(glide);
      setTimeout(() => track.classList.remove('is-dragging'), 0);
    }
    drag = null;
  });

  /* inclinação dos arquivos */
  function bindFiles() {
    $$('.file__card', track).forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.closest('.file').dataset.project;
        state.flipFrom = $('.frame:not(.file__stack .frame)', card) || card;
        go(`#/arquivo/${state.folder}/${id}`);
      });
      if (!fine || reduced) return;
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, on = false;
      const shot = $('.frame__shot', card);
      const loop = () => {
        cx = lerp(cx, tx, 0.12); cy = lerp(cy, ty, 0.12);
        card.style.transform = `rotateY(${(cx * 9).toFixed(2)}deg) rotateX(${(-cy * 7).toFixed(2)}deg) translateZ(0)`;
        shot.style.setProperty('--ix', `${(-cx * 14).toFixed(1)}px`);
        shot.style.setProperty('--iy', `${(-cy * 10).toFixed(1)}px`);
        if (on || Math.abs(cx) + Math.abs(cy) > 0.002) raf = requestAnimationFrame(loop); else { raf = 0; card.style.transform = ''; }
      };
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
        shot.style.setProperty('--gx', ((tx + 0.5) * 100).toFixed(0) + '%'); shot.style.setProperty('--gy', ((ty + 0.5) * 100).toFixed(0) + '%');
        on = true; if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener('pointerleave', () => { on = false; tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    });
  }

  /* ---------- detalhe ---------- */
  const dScroll = $('[data-d-scroll]', detail);
  function fillDetail(p, variantId) {
    const f = folderById(p.folder);
    const v = variantId && p.variants ? p.variants.find((x) => x.id === variantId) : null;
    const shownId = v ? v.id : p.id;
    const repo = v ? v.repo : p.repo;
    viewer.style.setProperty('--accent', f.accent);
    $('[data-d-crumb]', detail).innerHTML = `~/arquivo/${f.id}/<b>${shownId}</b>`;
    $('[data-d-url]', detail).textContent = repo ? `github.com/${repo}` : p.name;
    const hero = $('[data-d-hero]', detail);
    hero.src = img(shownId + '/hero'); hero.alt = `Hero do site ${v ? v.name : p.name}`;
    $('[data-d-niche]', detail).textContent = `${p.niche} — ${p.place}`;
    $('[data-d-title]', detail).textContent = v ? v.name : p.name;
    const status = $('[data-d-status]', detail);
    status.hidden = !p.status; status.textContent = p.status || '';
    $('[data-d-summary]', detail).textContent = v ? `Variação de ${p.name}: a mesma base adaptada à identidade da ${v.name.split(' — ')[0]}. ${p.summary}` : p.summary;
    const meta = [['pasta', f.name], ['nicho', p.niche], ['local', p.place], ['stack', p.stack.join(', ')]];
    if (repo) meta.push(['código', `<a href="https://github.com/${repo}" target="_blank" rel="noopener" data-cursor="código">${repo} ↗</a>`]);
    $('[data-d-meta]', detail).innerHTML = meta.map(([k, val]) => `<dt>${k}</dt><dd>${val}</dd>`).join('');
    $('[data-d-highlights]', detail).innerHTML = p.highlights.map((h) => `<li>${h}</li>`).join('');

    const vwrap = $('[data-d-variants]', detail);
    if (p.variants) {
      const all = [{ id: p.id, name: p.name }, ...p.variants];
      vwrap.hidden = false;
      vwrap.innerHTML = `<h4>// mesma base, ${all.length} marcas — toque para trocar</h4><div class="variants">${all.map((x) => `
        <button class="variant" type="button" data-variant="${x.id}" data-cursor="trocar" aria-pressed="${x.id === shownId}">
          <div class="frame"><img src="${img(x.id + '/m')}" alt="Versão mobile ${x.name}" loading="lazy"></div>
          <span>${x.id === shownId ? '● ' : ''}${x.name}</span>
        </button>`).join('')}</div>`;
      $$('[data-variant]', vwrap).forEach((b) => b.addEventListener('click', () => {
        const id = b.dataset.variant;
        fillDetail(p, id === p.id ? null : id);
        dScroll.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      }));
    } else { vwrap.hidden = true; vwrap.innerHTML = ''; }

    const shots = [];
    if (!v) (p.screens || []).forEach((s, i) => shots.push(`<div class="frame${i === 0 ? ' frame--wide' : ''}"><div class="frame__chrome mono"><i></i><i></i><i></i><span>tela ${pad(i + 2)}</span></div><img src="${img(p.id + '/' + s)}" alt="Tela ${i + 2} do site ${p.name}" loading="lazy"></div>`));
    if (p.extra) shots.push(`<div class="frame frame--wide"><div class="frame__chrome mono"><i></i><i></i><i></i><span>${p.extra}</span></div><img src="${img(p.extra + '/hero')}" alt="Página complementar do projeto ${p.name}" loading="lazy"></div>`);
    if (p.mobile) shots.push(`<div class="frame frame--phone"><img src="${img(shownId + '/m')}" alt="Hero no celular — ${v ? v.name : p.name}" loading="lazy"></div>`);
    $('[data-d-screens]', detail).innerHTML = shots.length ? `<h4>// telas capturadas do site rodando</h4><div class="screens">${shots.join('')}</div>` : '';

    const i = PROJECTS.indexOf(p); const next = PROJECTS[(i + 1) % PROJECTS.length];
    const acts = [];
    if (repo) acts.push(`<a class="pill pill--signal" href="https://github.com/${repo}" target="_blank" rel="noopener" data-cursor="código"><b>Ver repositório ↗</b></a>`);
    acts.push(`<a class="pill" href="#/arquivo/${next.folder}/${next.id}" data-cursor="próximo"><b>Próximo arquivo — ${next.name} →</b></a>`);
    $('[data-d-actions]', detail).innerHTML = acts.join('');
  }

  async function openDetail(id) {
    const p = projectById(id); if (!p) return;
    if (state.folder !== p.folder) {
      if (!state.folder) await openFolder(p.folder, { instant: true });
      else { renderFolder(folderById(p.folder)); state.folder = p.folder; }
    }
    const first = !state.project;
    state.project = id; setViewerPath();
    fillDetail(p);
    detail.hidden = false;
    dScroll.scrollTop = 0;
    const heroFrame = $('.detail__hero .frame', detail);
    const body = $('.detail__body', detail);
    if (!reduced && first) {
      const fromEl = state.flipFrom; state.flipFrom = null;
      dScroll.animate([{ backgroundColor: 'rgba(11,10,9,0)' }, { backgroundColor: 'rgba(11,10,9,1)' }], { duration: 500, easing: EASE_OUT });
      if (fromEl && fromEl.isConnected) {
        const a = fromEl.getBoundingClientRect(), b = heroFrame.getBoundingClientRect();
        const sx = a.width / b.width;
        heroFrame.animate([
          { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${sx})`, transformOrigin: '0 0' },
          { transform: 'none', transformOrigin: '0 0' }
        ], { duration: 850, easing: EASE_OUT });
      } else heroFrame.animate([{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: EASE_OUT });
      body.animate([{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 250, easing: EASE_OUT, fill: 'backwards' });
    } else if (!reduced) {
      detail.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 400, easing: EASE_OUT });
    }
    focusViewer();
  }

  async function closeDetail(fast) {
    if (!state.project) return;
    if (!reduced && !fast) await detail.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(30px)' }], { duration: 380, easing: EASE_OUT }).finished;
    detail.hidden = true; state.project = null; setViewerPath();
    if (!fast) focusViewer();
  }

  /* ---------- rotas (#/arquivo/pasta/projeto) ---------- */
  function go(hash) { if (location.hash !== hash) { state.pushed++; location.hash = hash; } }
  function back() {
    if (state.pushed > 0) { state.pushed--; history.back(); }
    else location.hash = state.project ? `#/arquivo/${state.folder}` : '#arquivo';
  }
  async function route() {
    const m = location.hash.match(/^#\/arquivo\/([\w-]+)(?:\/([\w-]+))?/);
    if (!m) { if (state.folder) await closeFolder(); return; }
    const [, fid, pid] = m;
    if (pid) { await openDetail(pid); return; }
    if (state.project) await closeDetail();
    if (state.folder !== fid) await openFolder(fid);
  }
  addEventListener('hashchange', route);

  cabinet.addEventListener('click', (e) => {
    const b = e.target.closest('.folder'); if (!b) return;
    go(`#/arquivo/${b.dataset.folder}`);
  });
  $('[data-close]', viewer).addEventListener('click', back);
  $('[data-d-close]', detail).addEventListener('click', back);
  big.addEventListener('click', back);
  document.addEventListener('keydown', (e) => {
    if (viewer.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); back(); }
    if (!state.project && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const max = track.scrollWidth - track.clientWidth;
      trackTarget = clamp(track.scrollLeft + (e.key === 'ArrowRight' ? 1 : -1) * track.clientWidth * 0.6, 0, max);
      if (!trackRaf) trackRaf = requestAnimationFrame(glide);
    }
    if (e.key === 'Tab') { // prende o foco no diálogo
      const scope = state.project ? detail : viewer;
      const items = $$('a[href], button:not([disabled])', scope).filter((el) => el.offsetParent !== null && !(state.project === null && detail.contains(el)));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  addEventListener('resize', () => {
    if (!viewer.hidden && !state.busy) { big.getAnimations().forEach((a) => a.cancel()); big.style.transform = measureBase().dock; }
    updateProgress();
  });

  if (hasRoute) { const h = location.hash; history.replaceState(null, '', '#arquivo'); state.pushed = 0; setTimeout(() => { location.hash = h; state.pushed = 1; }, 60); }

  /* ---------- rolagem suave (desktop) ---------- */
  if (fine && !reduced) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
    s.onload = () => {
      if (!window.Lenis) return;
      lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      if (!viewer.hidden) lenis.stop();
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute('href').startsWith('#/')) return;
        const t = $(a.getAttribute('href') === '#topo' ? 'body' : a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t === document.body ? 0 : t, { offset: 0, duration: 1.4 });
      });
    };
    document.head.appendChild(s);
  }
})();
