/* CARDOSO — portfólio
   Rotas por hash, sem camadas fixas e sem travar a rolagem:
   #/                    início
   #/categoria/<id>      início com a categoria aberta
   #/projeto/<id>        página do projeto (rolagem normal da janela) */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  const src = (path) => `assets/work/${path}.webp`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const CATS = window.CATEGORIES || [];
  const PROJECTS = window.PROJECTS || [];
  const CONFIG = window.CONFIG || {};
  const catById = (id) => CATS.find((c) => c.id === id);
  const projById = (id) => PROJECTS.find((p) => p.id === id);
  const inCat = (id) => PROJECTS.filter((p) => p.cat === id);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  const home = $('#home');
  const page = $('#page');
  history.scrollRestoration = 'manual';

  /* ---------- tipografia que ocupa a largura ---------- */
  $$('[data-letters]').forEach((el) => {
    const t = el.textContent; el.textContent = '';
    [...t].forEach((c, i) => { const s = document.createElement('span'); s.className = 'ltr'; s.style.setProperty('--i', i); s.textContent = c; el.appendChild(s); });
  });
  function fit() {
    $$('[data-fit]').forEach((el) => {
      const box = el.parentElement;
      if (!box.offsetParent && box.offsetWidth === 0) return;
      el.style.setProperty('--fs', '100px');
      const w = el.getBoundingClientRect().width || 1;
      let fs = 100 * box.clientWidth / w;
      if (box.classList.contains('hero__name')) fs = Math.min(fs, innerHeight * 0.34);
      el.style.setProperty('--fs', (fs * 0.995).toFixed(2) + 'px');
    });
  }
  fit();
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(fit, 80); });
  const ready = () => { fit(); root.classList.add('is-ready'); };
  // CARDOSO aparece desde o primeiro frame: pronto imediato e síncrono
  // (sem esperar fonte, CSS externo ou próximo quadro). A fonte só refaz
  // a medição quando carregar.
  ready();
  if (document.fonts && document.fonts.load) {
    document.fonts.load('800 100px "Inter Tight"').then(fit, fit);
  }

  /* ---------- navegação ---------- */
  const nav = $('[data-nav]');
  let ticking = false;
  function onScroll() {
    ticking = false;
    nav.classList.toggle('is-solid', scrollY > 30);
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- rastro de tinta rubi que segue o cursor ----------
     Reinterpretação em vermelho da lógica de trail do portfólio de
     referência: um traço único em canvas que afina nas pontas,
     engrossa com a velocidade e some suave.
     Só com mouse, leve, sem bloquear clique, respeita reduced-motion. */
  (() => {
    if (!finePointer || reduced) return;
    const cv = document.createElement('canvas');
    cv.className = 'inkfx';
    cv.setAttribute('aria-hidden', 'true');
    document.body.prepend(cv);
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, run = false, last = null;
    const T = [];
    const MAX = 28;

    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      W = innerWidth; H = innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.clearRect(0, 0, W, H);
    }

    function draw() {
      if (T.length < 3) return;
      const n = T.length;
      const left = [], right = [];
      for (let i = 0; i < n; i++) {
        const p = T[i];
        const a = T[Math.max(0, i - 1)], b = T[Math.min(n - 1, i + 1)];
        let dx = b.x - a.x, dy = b.y - a.y;
        const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
        const t = i / (n - 1);
        const tip = Math.sin(Math.PI * t); // 0 nas pontas, 1 no meio
        const w = p.w * tip * p.life * 0.5;
        left.push([p.x - dy * w, p.y + dx * w]);
        right.push([p.x + dy * w, p.y - dx * w]);
      }
      ctx.beginPath();
      ctx.moveTo(left[0][0], left[0][1]);
      for (let i = 1; i < n; i++) {
        const [x, y] = left[i], [px, py] = left[i - 1];
        ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
      }
      for (let i = n - 1; i >= 0; i--) {
        const [x, y] = right[i], [px, py] = right[Math.min(n - 1, i + 1)];
        ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
      }
      ctx.closePath();
      const g = ctx.createLinearGradient(T[0].x, T[0].y, T[n - 1].x, T[n - 1].y);
      g.addColorStop(0, 'rgba(225, 29, 46, .08)');
      g.addColorStop(0.55, 'rgba(225, 29, 46, .30)');
      g.addColorStop(1, 'rgba(255, 106, 115, .48)');
      ctx.fillStyle = g;
      ctx.fill();
    }

    function point(x, y) {
      if (!last) last = { x, y };
      const d = Math.hypot(x - last.x, y - last.y);
      if (d < 1.5) return;
      const steps = Math.min(4, Math.floor(d / 14) + 1);
      const sp = Math.min(1, d / 32);
      for (let k = 1; k <= steps; k++) {
        T.push({
          x: last.x + (x - last.x) * k / steps,
          y: last.y + (y - last.y) * k / steps,
          life: 1, w: 6 + sp * 16
        });
        if (T.length > MAX) T.shift();
      }
      last = { x, y };
    }

    const wake = () => { if (run) return; run = true; requestAnimationFrame(frame); };
    addEventListener('pointermove', (e) => { point(e.clientX, e.clientY); wake(); }, { passive: true });
    document.addEventListener('pointerleave', () => { last = null; });

    function frame() {
      ctx.clearRect(0, 0, W, H);
      draw();
      for (let i = T.length - 1; i >= 0; i--) { T[i].life -= 0.035; if (T[i].life <= 0) T.splice(i, 1); }
      if (T.length) requestAnimationFrame(frame);
      else { run = false; ctx.clearRect(0, 0, W, H); }
    }

    size();
    addEventListener('resize', size);
    addEventListener('scroll', () => { T.length = 0; last = null; }, { passive: true });
  })();

  /* ---------- revelar ao rolar ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  const observe = (scope = document) => $$('[data-reveal]:not(.in)', scope).forEach((el) => io.observe(el));

  /* ---------- card de projeto ---------- */
  function card(p, { delay = 0 } = {}) {
    return `
      <a class="card" href="#/projeto/${p.id}" data-id="${p.id}" data-reveal style="--d:${delay}s">
        <div class="card__media">
          <img src="${src(p.id + '/hero-sm')}" srcset="${src(p.id + '/hero-sm')} 800w, ${src(p.id + '/hero')} 1600w"
            sizes="(max-width: 860px) 92vw, 50vw" alt="Página inicial do site ${esc(p.name)}" loading="lazy" decoding="async">
          <span class="card__go" aria-hidden="true">↗</span>
        </div>
        <div class="card__meta">
          <h3 class="card__name">${esc(p.name)}</h3>
          <p class="card__type">${esc(p.type)}</p>
        </div>
      </a>`;
  }

  /* ---------- categorias (seção principal: Projetos) ---------- */
  const shelf = $('[data-shelf]');
  shelf.innerHTML = CATS.map((c, i) => {
    const ps = inCat(c.id);
    const imgs = ps.slice(0, 3).map((p) => p.id + '/hero-sm');
    const extra = ps[0] ? (ps[0].shots || []).map((s) => (s.includes('/') ? s : ps[0].id + '/' + s)) : [];
    while (imgs.length < 3 && extra.length) imgs.push(extra.shift());
    while (imgs.length < 3 && ps[0]) imgs.push(ps[0].id + '/hero-sm');
    // ordem de pintura: laterais atrás, principal na frente
    const order = [imgs[1], imgs[2], imgs[0]];
    return `
      <a class="folder" href="#/categoria/${c.id}" data-cat="${c.id}" data-reveal style="--d:${(i % 4) * 0.06}s" aria-controls="drawer" aria-label="${esc(c.name)}: ${plural(ps.length, 'projeto', 'projetos')}">
        <span class="folder__back"></span>
        <span class="folder__screens">${order.map((s) => `<span class="folder__screen"><img src="${src(s)}" alt="" loading="lazy" decoding="async"></span>`).join('')}</span>
        <span class="folder__front">
          <span class="folder__name">${esc(c.name)}</span>
          <span class="folder__count">${plural(ps.length, 'projeto', 'projetos')}<span class="folder__arrow" aria-hidden="true">↗</span></span>
        </span>
      </a>`;
  }).join('');

  const drawer = $('[data-drawer]');
  drawer.id = 'drawer';
  const drawerGrid = $('[data-drawer-grid]');
  let openCat = null;

  function openDrawer(id, { scroll = true, animate = true } = {}) {
    const c = catById(id); if (!c) return;
    const ps = inCat(id);
    const folder = $(`.folder[data-cat="${id}"]`, shelf);
    $$('.folder', shelf).forEach((f) => f.classList.toggle('is-open', f === folder));
    if (openCat === id && !drawer.hidden) {
      if (scroll) drawer.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    openCat = id;
    $('[data-drawer-title]').textContent = c.name;
    $('[data-drawer-count]').textContent = plural(ps.length, 'projeto', 'projetos');
    drawerGrid.innerHTML = ps.map((p, i) => card(p, { delay: Math.min(i, 6) * 0.07 })).join('');
    drawer.hidden = false;
    const cards = $$('.card', drawerGrid);

    if (animate && !reduced && folder) {
      // os primeiros projetos saem das telas da pasta (FLIP em coordenadas do documento)
      const screens = $$('.folder__screen', folder).reverse();
      cards.forEach((el, i) => {
        el.classList.add('in');
        const media = $('.card__media', el);
        const from = screens[i];
        if (from && i < 3) {
          const a = from.getBoundingClientRect(), b = media.getBoundingClientRect();
          const sx = a.width / b.width;
          media.animate([
            { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${sx})`, transformOrigin: '0 0', opacity: 0.9 },
            { transform: 'none', transformOrigin: '0 0', opacity: 1 }
          ], { duration: 1100, delay: i * 70, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
          $('.card__meta', el).animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 500 + i * 70, easing: 'ease-out', fill: 'backwards' });
        } else {
          el.animate([{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 300 + i * 70, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
        }
      });
    } else cards.forEach((el) => el.classList.add('in'));

    if (scroll) requestAnimationFrame(() => drawer.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }));
  }
  function closeDrawer() {
    if (drawer.hidden) return;
    openCat = null;
    $$('.folder', shelf).forEach((f) => f.classList.remove('is-open'));
    drawer.hidden = true; drawerGrid.innerHTML = '';
  }
  document.addEventListener('click', (e) => {
    const close = e.target.closest('[data-drawer-close]');
    if (!close) return;
    e.preventDefault();
    closeDrawer();
    history.replaceState(null, '', '#projetos');
    const target = document.getElementById('projetos');
    if (target) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- página do projeto ---------- */
  function renderProject(p) {
    const c = catById(p.cat);
    const idx = PROJECTS.indexOf(p);
    const next = PROJECTS[(idx + 1) % PROJECTS.length];
    const shots = (p.shots || []).map((s) => (s.includes('/') ? s : p.id + '/' + s));
    const g = [];
    const phone = p.noMobile ? '' : `<figure class="shot shot--phone" data-reveal><img src="${src(p.id + '/m')}" alt="${esc(p.name)} no celular" loading="lazy"></figure>`;
    if (shots.length) {
      g.push(`<figure class="shot${phone ? ' shot--wide' : ''}" data-reveal><img src="${src(shots[0])}" alt="Outra seção do site ${esc(p.name)}" loading="lazy"></figure>`);
      if (phone) g.push(phone);
      shots.slice(1).forEach((s, i, arr) => g.push(`<figure class="shot${arr.length > 1 ? ' shot--half' : ''}" data-reveal style="--d:${i * 0.08}s"><img src="${src(s)}" alt="Outra seção do site ${esc(p.name)}" loading="lazy"></figure>`));
    } else if (phone) g.push(phone.replace('shot--phone', 'shot--phone shot--solo'));

    const variants = p.variants ? `
      <h2 class="proj__sub" data-reveal>A mesma base em outras marcas</h2>
      <div class="variants">${p.variants.map((v, i) => `
        <figure data-reveal style="--d:${i * 0.08}s"><div class="shot"><img src="${src(v.id + '/hero-sm')}" alt="Página inicial do site ${esc(v.name)}" loading="lazy"></div><figcaption>${esc(v.name)}</figcaption></figure>`).join('')}
      </div>` : '';

    const meta = [['Categoria', c.name], ['Local', p.place], ['Serviços', p.services.join(', ')], ['Tecnologias', p.tech.join(', ')]]
      .filter(([, v]) => v && v !== '—');

    page.innerHTML = `
      <div class="proj__bar">
        <a class="back" href="#/categoria/${c.id}">← Voltar</a>
        <span>${pad(idx + 1)} / ${pad(PROJECTS.length)}</span>
      </div>
      <header class="proj__head">
        <div>
          <p class="proj__cat">${esc(c.name)} — ${esc(p.type)}</p>
          <h1 class="proj__title" tabindex="-1">${esc(p.name)}</h1>
          ${p.status ? `<p class="proj__status">${esc(p.status)}</p>` : ''}
        </div>
        <div class="proj__side">
          <p class="proj__text">${esc(p.text)}</p>
          <dl class="proj__meta">${meta.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
          ${p.url ? `<a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">Ver projeto <span aria-hidden="true">↗</span></a>` : ''}
        </div>
      </header>
      <figure class="shot proj__hero" style="view-transition-name: shot"><img src="${src(p.id + '/hero')}" alt="Página inicial do site ${esc(p.name)}"></figure>
      <div class="proj__gallery">${g.join('')}</div>
      ${variants}
      <a class="next" href="#/projeto/${next.id}">
        <div><p class="next__label">Próximo projeto</p><p class="next__name">${esc(next.name)}</p></div>
        <div class="card__media"><img src="${src(next.id + '/hero-sm')}" alt="" loading="lazy"></div>
      </a>`;
    observe(page);
  }

  /* ---------- rotas ---------- */
  let view = 'home';
  let homeY = 0;
  let lastCardId = null;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.card[data-id]');
    if (a) lastCardId = a.dataset.id;
  });

  const canVT = !!document.startViewTransition && !reduced;
  function transition(apply, done) {
    if (canVT) {
      const t = document.startViewTransition(apply);
      t.finished.finally(() => done && done());
    } else { apply(); done && done(); }
  }
  const jump = (y) => window.scrollTo({ top: y, behavior: 'instant' });
  const enter = (el) => { if (canVT || reduced) return; el.classList.remove('is-entering'); void el.offsetWidth; el.classList.add('is-entering'); };

  function showProject(id) {
    const p = projById(id); if (!p) { location.hash = '#/'; return; }
    let named = null;
    if (view === 'home') {
      homeY = scrollY;
      const all = $$(`.card[data-id="${id}"] .card__media`, home);
      named = all.find((m) => { const r = m.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }) || null;
      if (named) named.style.viewTransitionName = 'shot';
    }
    transition(() => {
      if (named) named.style.viewTransitionName = '';
      home.hidden = true; page.hidden = false;
      renderProject(p);
      view = 'page';
      jump(0);
      document.title = `${p.name} — Cardoso`;
      enter(page);
    }, () => { const t = $('.proj__title', page); if (t) t.focus({ preventScroll: true }); });
  }

  function showHome(after) {
    transition(() => {
      page.hidden = true; page.innerHTML = '';
      home.hidden = false; view = 'home';
      document.title = 'Cardoso — Design, desenvolvimento e sistemas';
      fit();
      after();
      enter(home);
    });
  }

  function route() {
    const h = location.hash;
    let m;
    if ((m = h.match(/^#\/projeto\/([\w-]+)/))) { showProject(m[1]); return; }
    if ((m = h.match(/^#\/categoria\/([\w-]+)/))) {
      const id = m[1];
      if (view === 'page') showHome(() => { openDrawer(id, { scroll: false, animate: false }); jump(homeY || drawer.getBoundingClientRect().top + scrollY - 80); });
      else openDrawer(id);
      return;
    }
    const target = h.length > 1 && !h.startsWith('#/') ? document.getElementById(h.slice(1)) : null;
    if (view === 'page') {
      showHome(() => { if (target) target.scrollIntoView({ behavior: 'instant' }); else jump(!h || h === '#/' ? 0 : homeY); });
      return;
    }
    if (h === '#/') window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }
  addEventListener('hashchange', route);
  if (location.hash.startsWith('#/')) route();

  /* ---------- rodapé: contatos do CONFIG + palavra gigante animada ----------
     Estrutura do Mauricio (foot-word por letra, onda + proximidade do mouse),
     paleta adaptada à identidade Cardoso (vinho/rubi/branco). Sem inventar
     dados: só renderiza o que existir em window.CONFIG. */
  const waMsg = 'Olá! Vi seu portfólio e gostaria de fazer um orçamento.';
  const waHref = CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waMsg)}` : null;
  const footWa = $('[data-foot-wa]');
  if (footWa) {
    if (waHref) { footWa.href = waHref; }
    else { footWa.hidden = true; }
  }
  const footLinks = [];
  if (CONFIG.whatsapp) footLinks.push([waHref, 'WhatsApp', true]);
  if (CONFIG.email) footLinks.push([`mailto:${CONFIG.email}`, CONFIG.email, false]);
  if (CONFIG.instagram) footLinks.push([CONFIG.instagram, 'Instagram', true]);
  const footContact = $('[data-foot-contact]');
  if (footContact) {
    footContact.innerHTML = footLinks.map(([href, t, ext]) =>
      `<li><a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(t)}</a></li>`).join('');
  }
  const yr = $('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();

  /* palavra gigante do rodapé: onda contínua + destaque perto do mouse.
     Mesma técnica da referência: cada letra é um span, a cor mistura
     base → rubi → branco quente conforme a onda passa. */
  (() => {
    const word = $('[data-foot-word]');
    if (!word) return;
    const text = word.textContent;
    word.textContent = '';
    const letters = [...text].map((ch) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? ' ' : ch;
      word.append(s);
      return { el: s, k: 0 };
    });
    if (reduced) return;
    const foot = word.closest('.foot') || document.body;
    const base = [86, 50, 54], hi = [225, 60, 75], peak = [255, 232, 233];
    const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
    const mouse = { x: -9999, y: -9999 };
    if (finePointer) {
      foot.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
      foot.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    }
    let on = false, last = 0;
    const n = letters.length;
    let fs = parseFloat(getComputedStyle(word).fontSize) || 16;
    addEventListener('resize', () => { fs = parseFloat(getComputedStyle(word).fontSize) || 16; }, { passive: true });
    function frame(now) {
      if (!on) return;
      const t = now * 0.001;
      const dt = last ? Math.min((now - last) * 0.001, 0.05) : 1 / 60;
      last = now;
      const p = ((t * 0.32) % 1.5) * (n + 6) - 3;
      const pointerActive = finePointer && mouse.x > -9000;
      const bounds = pointerActive ? letters.map((L) => L.el.getBoundingClientRect()) : null;
      const targets = letters.map((L, i) => {
        const wave = Math.exp(-Math.pow(i - p, 2) / 5);
        if (!pointerActive) return wave * 0.85;
        const r = bounds[i];
        const d = Math.hypot(mouse.x - (r.left + r.width / 2), (mouse.y - (r.top + r.height / 2)) * 0.7);
        const near = Math.max(0, 1 - d / (fs * 1.5));
        return Math.max(wave * 0.85, near * near);
      });
      const ease = 1 - Math.exp(-dt * 10.5);
      letters.forEach((L, i) => {
        L.k += (targets[i] - L.k) * ease;
        const c = L.k < 0.6 ? mix(base, hi, L.k / 0.6) : mix(hi, peak, (L.k - 0.6) / 0.4);
        L.el.style.color = `rgb(${c})`;
        L.el.style.transform = `translateY(${-L.k * 0.14}em)`;
      });
      requestAnimationFrame(frame);
    }
    new IntersectionObserver(([e]) => {
      const visible = e.isIntersecting;
      if (visible && !on) { on = true; last = 0; requestAnimationFrame(frame); }
      else if (!visible) { on = false; last = 0; }
    }).observe(word);
  })();

  observe();
})();
