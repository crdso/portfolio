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
  if (document.fonts && document.fonts.load) {
    Promise.race([document.fonts.load('800 100px "Inter Tight"'), new Promise((r) => setTimeout(r, 1200))]).then(ready, ready);
  } else ready();

  /* ---------- navegação e fundo ---------- */
  const nav = $('[data-nav]');
  const sun = $('.orb--sun');
  const spark = $('.orb--spark');
  let ticking = false;
  function onScroll() {
    ticking = false;
    nav.classList.toggle('is-solid', scrollY > 30);
    if (!reduced && sun) sun.style.translate = `0 ${(-scrollY * 0.04).toFixed(1)}px`;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (finePointer && !reduced && spark) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.04; cy += (ty - cy) * 0.04;
      spark.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 80; ty = (e.clientY / innerHeight - 0.5) * 60;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* ---------- revelar ao rolar ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  const observe = (scope = document) => $$('[data-reveal]:not(.in)', scope).forEach((el) => io.observe(el));

  /* ---------- card de projeto ---------- */
  function card(p, { tag = false, delay = 0 } = {}) {
    const c = catById(p.cat);
    return `
      <a class="card" href="#/projeto/${p.id}" data-id="${p.id}" data-reveal style="--d:${delay}s">
        <div class="card__media">
          <img src="${src(p.id + '/hero-sm')}" srcset="${src(p.id + '/hero-sm')} 800w, ${src(p.id + '/hero')} 1600w"
            sizes="(max-width: 860px) 92vw, 50vw" alt="Página inicial do site ${esc(p.name)}" loading="lazy" decoding="async">
          ${tag ? `<span class="card__tag">${esc(c.name)}</span>` : ''}
          <span class="card__go" aria-hidden="true">↗</span>
        </div>
        <div class="card__meta">
          <h3 class="card__name">${esc(p.name)}</h3>
          <p class="card__type">${esc(p.type)}</p>
        </div>
      </a>`;
  }

  /* trabalhos selecionados */
  const featured = PROJECTS.filter((p) => p.featured).sort((a, b) => a.featured - b.featured);
  $('[data-featured]').innerHTML = featured.map((p, i) => card(p, { tag: true, delay: (i % 2) * 0.1 })).join('');
  $('[data-count]').textContent = `${PROJECTS.length} projetos em ${CATS.length} categorias. Uma seleção:`;

  /* ---------- categorias ---------- */
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
    if (h === '#categorias') closeDrawer();
    if (view === 'page') {
      showHome(() => { if (target) target.scrollIntoView({ behavior: 'instant' }); else jump(!h || h === '#/' ? 0 : homeY); });
      return;
    }
    if (h === '#/') window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }
  addEventListener('hashchange', route);
  if (location.hash.startsWith('#/')) route();

  /* ---------- contato ---------- */
  const links = [];
  if (CONFIG.whatsapp) links.push([`https://wa.me/${CONFIG.whatsapp}`, 'WhatsApp']);
  if (CONFIG.email) links.push([`mailto:${CONFIG.email}`, CONFIG.email]);
  if (CONFIG.instagram) links.push([CONFIG.instagram, 'Instagram']);
  $('[data-contact]').innerHTML = links.map(([href, t]) => `<a href="${esc(href)}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(t)} <span aria-hidden="true">↗</span></a>`).join('');
  const yr = $('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();

  observe();
})();
