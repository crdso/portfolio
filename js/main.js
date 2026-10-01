/* CARDOSO — portfólio. As pastas e os projetos vivem no mesmo modal sobre a home. */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const src = (path) => `assets/work/${path}.webp`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const CATS = window.CATEGORIES || [];
  const PROJECTS = window.PROJECTS || [];
  const CONFIG = window.CONFIG || {};
  const catById = (id) => CATS.find((c) => c.id === id);
  const projById = (id) => PROJECTS.find((p) => p.id === id);
  const inCat = (id) => PROJECTS.filter((p) => p.cat === id);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  const modal = $('[data-modal]');
  const panel = $('[data-modal-panel]');
  const content = $('[data-modal-content]');
  const backButton = $('[data-modal-back]');
  const context = $('[data-modal-context]');

  /* ---------- tipografia que ocupa a largura ---------- */
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
  // As entradas dos textos de apoio ainda usam is-ready; CARDOSO já está
  // visível no HTML e usa fit() só para ajustar a largura, sem esperar a fonte.
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

  /* ---------- pastas na home ---------- */
  function card(p, index) {
    return `
      <a class="card" href="#projetos" data-id="${p.id}" aria-label="Ver projeto ${esc(p.name)}">
        <div class="card__media">
          <img src="${src(p.id + '/hero-sm')}" srcset="${src(p.id + '/hero-sm')} 800w, ${src(p.id + '/hero')} 1600w"
            sizes="(max-width: 760px) 88vw, 42vw" alt="Página inicial do site ${esc(p.name)}" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async">
          <span class="card__go" aria-hidden="true">↗</span>
        </div>
        <div class="card__meta">
          <h3 class="card__name">${esc(p.name)}</h3>
          <p class="card__type">${esc(p.type)}</p>
        </div>
      </a>`;
  }

  const shelf = $('[data-shelf]');
  shelf.innerHTML = CATS.map((c, i) => {
    const ps = inCat(c.id);
    const imgs = ps.slice(0, 3).map((p) => p.id + '/hero-sm');
    const extra = ps[0] ? (ps[0].shots || []).map((s) => (s.includes('/') ? s : ps[0].id + '/' + s)) : [];
    while (imgs.length < 3 && extra.length) imgs.push(extra.shift());
    while (imgs.length < 3 && ps[0]) imgs.push(ps[0].id + '/hero-sm');
    const order = [imgs[1], imgs[2], imgs[0]];
    return `
      <button class="folder" type="button" data-cat="${c.id}" data-reveal style="--d:${(i % 4) * 0.06}s" aria-label="${esc(c.name)}: ${plural(ps.length, 'projeto', 'projetos')}">
        <span class="folder__back"></span>
        <span class="folder__screens">${order.map((s) => `<span class="folder__screen"><img src="${src(s)}" alt="" loading="lazy" decoding="async"></span>`).join('')}</span>
        <span class="folder__front">
          <span class="folder__name">${esc(c.name)}</span>
          <span class="folder__count">${plural(ps.length, 'projeto', 'projetos')}<span class="folder__arrow" aria-hidden="true">↗</span></span>
        </span>
      </button>`;
  }).join('');

  let activeCat = null;
  let activeProject = null;
  let opener = null;
  let savedScroll = 0;
  let categoryScroll = 0;
  let savedPaddingRight = '';

  function animateContent() {
    if (reduced) return;
    content.classList.remove('is-swapping');
    void content.offsetWidth;
    content.classList.add('is-swapping');
  }

  function renderCategory(c) {
    const ps = inCat(c.id);
    activeProject = null;
    backButton.hidden = true;
    context.textContent = 'Projetos';
    content.innerHTML = `
      <header class="modal-category__head">
        <p class="modal-category__eyebrow">Projetos / ${esc(c.name)}</p>
        <h2 id="portfolio-modal-title" class="modal-category__title" tabindex="-1">${esc(c.name)}</h2>
        <p class="modal-category__count">${plural(ps.length, 'projeto', 'projetos')}</p>
      </header>
      <div class="modal-category__grid">${ps.map(card).join('')}</div>`;
    animateContent();
  }

  function renderProject(p) {
    const c = catById(p.cat);
    activeProject = p;
    backButton.hidden = false;
    backButton.textContent = `← ${c.name}`;
    context.textContent = 'Projeto';
    const shots = (p.shots || []).slice(0, 2).map((s) => (s.includes('/') ? s : p.id + '/' + s));
    const variants = p.variants ? `
      <h3 class="proj__sub">A mesma base em outras marcas</h3>
      <div class="variants">${p.variants.map((v) => `
        <figure><div class="shot"><img src="${src(v.id + '/hero-sm')}" alt="Página inicial do site ${esc(v.name)}" loading="lazy" decoding="async"></div><figcaption>${esc(v.name)}</figcaption></figure>`).join('')}
      </div>` : '';
    const meta = [['Local', p.place], ['Serviços', p.services.join(' · ')], ['Tecnologias', p.tech.join(' · ')]]
      .filter(([, v]) => v && v !== '—');
    content.innerHTML = `
      <article class="portfolio-case">
        <header class="proj__head">
          <div>
            <p class="proj__cat">${esc(c.name)}</p>
            <h2 id="portfolio-modal-title" class="proj__title" tabindex="-1">${esc(p.name)}</h2>
            <p class="proj__type">${esc(p.type)}</p>
            ${p.status ? `<p class="proj__status">${esc(p.status)}</p>` : ''}
          </div>
          <div class="proj__side">
            <p class="proj__text">${esc(p.text)}</p>
            <dl class="proj__meta">${meta.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
            ${p.url ? `<a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">Ver projeto <span aria-hidden="true">↗</span></a>` : ''}
          </div>
        </header>
        <figure class="shot proj__hero"><img src="${src(p.id + '/hero')}" alt="Página inicial do site ${esc(p.name)}" decoding="async"></figure>
        ${shots.length ? `<h3 class="proj__sub">Outras telas</h3><div class="proj__gallery">${shots.map((s, i) => `<figure class="shot"><img src="${src(s)}" alt="Seção ${i + 1} do site ${esc(p.name)}" loading="lazy" decoding="async"></figure>`).join('')}</div>` : ''}
        ${variants}
      </article>`;
    animateContent();
  }

  function openModal(c, folder) {
    if (!c || !modal.hidden) return;
    activeCat = c;
    opener = folder;
    savedScroll = window.scrollY;
    categoryScroll = 0;
    savedPaddingRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    renderCategory(c);
    modal.hidden = false;
    $('#app').inert = true;
    $('[data-nav]').inert = true;
    $('footer').inert = true;
    root.classList.add('modal-open');
    panel.scrollTop = 0;
    panel.focus({ preventScroll: true });
  }

  function closeModal() {
    if (modal.hidden) return;
    root.classList.remove('modal-open');
    modal.hidden = true;
    $('#app').inert = false;
    $('[data-nav]').inert = false;
    $('footer').inert = false;
    document.body.style.paddingRight = savedPaddingRight;
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
    opener?.focus({ preventScroll: true });
    activeCat = null;
    activeProject = null;
  }

  shelf.addEventListener('click', (event) => {
    const folder = event.target.closest('.folder[data-cat]');
    if (folder) openModal(catById(folder.dataset.cat), folder);
  });
  content.addEventListener('click', (event) => {
    const item = event.target.closest('.card[data-id]');
    if (!item) return;
    event.preventDefault();
    const p = projById(item.dataset.id);
    if (!p) return;
    categoryScroll = panel.scrollTop;
    renderProject(p);
    panel.scrollTop = 0;
    $('#portfolio-modal-title').focus({ preventScroll: true });
  });
  backButton.addEventListener('click', () => {
    if (!activeCat || !activeProject) return;
    renderCategory(activeCat);
    panel.scrollTop = categoryScroll;
    backButton.focus({ preventScroll: true });
    panel.focus({ preventScroll: true });
  });
  $('[data-modal-close]').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
    if (event.key !== 'Tab') return;
    const focusables = $$('button:not([hidden]):not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', panel)
      .filter((el) => el.getClientRects().length);
    if (!focusables.length) { event.preventDefault(); panel.focus(); return; }
    const first = focusables[0], last = focusables.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });

  /* ---------- rodapé: CTA + contatos do CONFIG ----------
     Sem inventar dados: só renderiza o que existir em window.CONFIG. */
  const waMsg = 'Olá! Vi seu portfólio e gostaria de conversar sobre um projeto.';
  const waHref = CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waMsg)}` : null;
  const footWa = $('[data-foot-wa]');
  if (footWa) {
    if (waHref) { footWa.href = waHref; }
    else { footWa.hidden = true; }
  }
  const footLinks = [];
  if (CONFIG.instagram) footLinks.push([CONFIG.instagram, 'Instagram', true]);
  if (CONFIG.whatsapp) footLinks.push([waHref, 'WhatsApp', true]);
  if (CONFIG.email) footLinks.push([`mailto:${CONFIG.email}`, 'Email', false]);
  const footContact = $('[data-foot-contact]');
  if (footContact) {
    footContact.innerHTML = footLinks.map(([href, t, ext]) =>
      `<li><a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(t)}</a></li>`).join('');
  }
  const yr = $('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();

  observe();
})();
