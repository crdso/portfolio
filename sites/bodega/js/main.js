/* ==========================================================================
   BODEGA — Comportamento do site
   Renderização do cardápio (a partir de js/dados.js) + animações.
   ========================================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Utilitários ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const preco = (n) => `<small>R$</small>${Number(n).toLocaleString("pt-BR")}`;
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- Templates ---------- */
  function itemHTML(it, i) {
    const medida = it.medida ? `<span class="item__medida">${esc(it.medida)}</span>` : "";
    const badge = it.destaque ? `<span class="item__badge">Destaque da casa</span>` : "";
    const tag = it.tag ? `<p class="item__tag">${esc(it.tag)}</p>` : "";
    const perfil = it.perfil ? `<p class="item__perfil">${esc(it.perfil)}</p>` : "";
    const desc = it.desc ? `<p class="item__desc">${esc(it.desc)}</p>` : "";
    return `
      <li class="item reveal" style="--i:${i % 8}">
        ${badge}
        <div class="item__row">
          <span class="item__name">${esc(it.nome)}${medida}</span>
          <span class="item__leader" aria-hidden="true"></span>
          <span class="item__price">${preco(it.preco)}</span>
        </div>
        ${tag}${perfil}${desc}
      </li>`;
  }

  function listHTML(itens, compacto) {
    return `<ul class="menu-list${compacto ? " menu-list--compact" : ""}">${itens.map(itemHTML).join("")}</ul>`;
  }

  function tableHTML(t) {
    const head = `<tr><th scope="col"></th>${t.colunas.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr>`;
    const rows = t.linhas
      .map((l) => `<tr><td>${esc(l.nome)}</td>${l.precos.map((p) => `<td>${preco(p)}</td>`).join("")}</tr>`)
      .join("");
    return `<div class="reveal"><table class="menu-table"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
  }

  function groupHTML(g) {
    const aviso = g.aviso ? `<p class="menu-section__aviso">${esc(g.aviso)}</p>` : "";
    const body = g.tabela ? tableHTML(g.tabela) : listHTML(g.itens, g.compacto);
    return `
      <div class="menu-group">
        <h4 class="menu-group__title reveal">${esc(g.subtitulo)}</h4>
        ${body}
        ${aviso}
      </div>`;
  }

  function sectionHTML(sec, idx) {
    const intro = sec.intro ? `<p class="menu-section__intro reveal">${esc(sec.intro)}</p>` : "";
    const aviso = sec.aviso ? `<p class="menu-section__aviso reveal">${esc(sec.aviso)}</p>` : "";
    const body = sec.grupos ? sec.grupos.map(groupHTML).join("") : listHTML(sec.itens);
    return `
      <section class="menu-section" id="${esc(sec.id)}" data-nav="${esc(sec.nav || sec.titulo)}">
        <header class="menu-section__head">
          <div class="menu-section__title">
            <span class="menu-section__num reveal">${pad(idx + 1)}</span>
            <h3 class="subtitle reveal">${esc(sec.titulo)}</h3>
          </div>
          <div class="divider"></div>
          ${intro}
          ${aviso}
        </header>
        ${body}
      </section>`;
  }

  function wineHTML(w, i) {
    const country = w.pais
      ? `<span class="wine__country" title="${esc(PAISES[w.pais] || w.pais)}"><i></i>${esc(PAISES[w.pais] || w.pais)}</span>`
      : `<span class="wine__country"><i></i>${esc(w.medida || "")}</span>`;
    const alc = w.alc ? `<span class="wine__alc">${esc(w.alc)} alc.</span>` : "";
    const notes = w.notas ? `<p class="wine__notes">${esc(w.notas)}</p>` : `<p class="wine__notes"></p>`;
    return `
      <article class="wine reveal" style="--i:${i % 8}">
        <div class="wine__top">${country}</div>
        <h4 class="wine__name">${esc(w.nome)}</h4>
        ${notes}
        <div class="wine__price"><span>${preco(w.preco)}</span>${alc}</div>
      </article>`;
  }

  function wineSectionHTML(sec, idx) {
    const aviso = sec.aviso ? `<p class="menu-section__aviso reveal">${esc(sec.aviso)}</p>` : "";
    return `
      <section class="menu-section" id="${esc(sec.id)}" data-nav="${esc(sec.titulo)}">
        <header class="menu-section__head">
          <div class="menu-section__title">
            <span class="menu-section__num reveal">${pad(idx + 1)}</span>
            <h3 class="subtitle reveal">${esc(sec.titulo)}</h3>
          </div>
          <div class="divider"></div>
          ${aviso}
        </header>
        <div class="wine-grid">${sec.itens.map(wineHTML).join("")}</div>
      </section>`;
  }

  /* ---------- Render ---------- */
  function render() {
    $("#cardapioRoot").innerHTML = CARDAPIO.map(sectionHTML).join("");
    $("#bebidasRoot").innerHTML = BEBIDAS.map((s, i) => sectionHTML(s, CARDAPIO.length + i)).join("");
    $("#vinhosRoot").innerHTML = VINHOS.map(wineSectionHTML).join("");

    // Subnav de categorias (comida | bebidas | vinhos)
    const track = $("#subnavTrack");
    const link = (s) => `<a href="#${esc(s.id)}" class="subnav__link" data-target="${esc(s.id)}">${esc(s.nav || s.titulo)}</a>`;
    track.innerHTML =
      CARDAPIO.map(link).join("") +
      `<span class="subnav__sep"></span>` +
      BEBIDAS.map(link).join("") +
      `<span class="subnav__sep"></span>` +
      `<a href="#vinhos" class="subnav__link" data-target="vinhos">Vinhos</a>`;

    // Chips da carta de vinhos
    $("#vinhosChips").innerHTML = VINHOS.map((s) => `<a href="#${esc(s.id)}" class="chip">${esc(s.titulo)}</a>`).join("");
  }

  /* ---------- Contato / links dinâmicos ---------- */
  function applyConfig() {
    const has = (k) => {
      const v = CONFIG[k];
      if (Array.isArray(v)) return v.length > 0;
      if (v && typeof v === "object") return Object.values(v).some(Boolean);
      return Boolean(v);
    };

    $$("[data-if]").forEach((el) => { if (!has(el.dataset.if)) el.hidden = true; });

    const wa = has("whatsapp") ? `https://wa.me/${CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Olá! Gostaria de fazer uma reserva na Bodega.")}` : "";
    $$("[data-whatsapp]").forEach((a) => { if (wa) { a.href = wa; a.target = "_blank"; a.rel = "noopener"; } });

    $$("[data-instagram]").forEach((a) => {
      if (has("instagram")) a.href = `https://instagram.com/${CONFIG.instagram}`;
      if (a.classList.contains("contato__value")) a.textContent = "@" + (CONFIG.instagram || "");
    });

    $$("[data-fill]").forEach((el) => {
      const k = el.dataset.fill;
      if (k === "whatsappFmt") el.textContent = CONFIG.telefoneFmt || formatPhone(CONFIG.whatsapp);
      else el.textContent = CONFIG[k] || "";
    });
    $$("[data-href]").forEach((a) => { const v = CONFIG[a.dataset.href]; if (v) a.href = v; else { a.removeAttribute("target"); a.hidden = true; } });

    if (has("mapEmbed")) $("#mapFrame").src = CONFIG.mapEmbed;

    renderHorario();
    $("#ano").textContent = new Date().getFullYear();
  }

  function formatPhone(d) {
    d = String(d || "").replace(/\D/g, "");
    const m = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
    return m ? `(${m[1]}) ${m[2]}-${m[3]}` : d;
  }

  /* ---------- Horário de funcionamento + "aberto agora" ---------- */
  const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const hora = (h) => (h === 24 ? "meia-noite" : `${h}h`);

  function renderHorario() {
    const f = CONFIG.funcionamento;
    if (!f) return;
    // Agrupa dias consecutivos com o mesmo horário
    const grupos = [];
    for (let d = 1; d <= 7; d++) {
      const dia = d % 7, h = f[dia];
      const key = h ? h.join("-") : "x";
      const last = grupos[grupos.length - 1];
      if (last && last.key === key) last.dias.push(dia); else grupos.push({ key, h, dias: [dia] });
    }
    const label = (g) => {
      const nome = (i) => DIAS[i].toLowerCase();
      const dias = g.dias.length > 2 ? `${DIAS[g.dias[0]]} a ${nome(g.dias[g.dias.length - 1])}`
        : g.dias.map((i, k) => (k ? nome(i) : DIAS[i])).join(" e ");
      const horas = g.h ? `${hora(g.h[0])} às ${hora(g.h[1])}` : "fechado";
      return `<span class="hours__row${g.h ? "" : " hours__row--off"}"><span>${dias}</span><span>${horas}</span></span>`;
    };
    const el = $("#horarioLista");
    if (el) el.innerHTML = grupos.map(label).join("");

    // Status ao vivo (horário de Brasília)
    const agora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const dia = agora.getDay(), hh = agora.getHours() + agora.getMinutes() / 60;
    const h = f[dia];
    const aberto = Boolean(h) && hh >= h[0] && hh < h[1];
    let texto;
    if (aberto) texto = `Aberto agora · até ${hora(h[1])}`;
    else if (h && hh < h[0]) texto = `Fechado · abre hoje às ${hora(h[0])}`;
    else {
      let n = 1; while (!f[(dia + n) % 7]) n++;
      const prox = (dia + n) % 7;
      texto = `Fechado · abre ${n === 1 ? "amanhã" : DIAS[prox].toLowerCase()} às ${hora(f[prox][0])}`;
    }
    $$("#statusAberto, #statusPill").forEach((s) => {
      s.textContent = s.id === "statusPill" ? (aberto ? "Aberto agora" : "Fechado agora") : texto;
      s.classList.toggle("is-open", aberto);
      s.classList.toggle("is-closed", !aberto);
    });
  }

  /* ---------- Preloader ---------- */
  function preloader() {
    const pre = $("#preloader");
    const done = () => {
      pre.classList.add("is-done");
      document.body.classList.add("is-loaded");
      setTimeout(() => pre.remove(), 1400);
    };
    if (reduceMotion) { done(); return; }
    document.body.classList.add("is-locked");
    const minTime = 1500;
    const start = performance.now();
    let fired = false;
    const finish = () => {
      if (fired) return; fired = true;
      const wait = Math.max(0, minTime - (performance.now() - start));
      setTimeout(() => { document.body.classList.remove("is-locked"); done(); }, wait);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(finish);
    window.addEventListener("load", finish);
    setTimeout(finish, 2500); // segurança: nunca segura o usuário além disso
  }

  /* ---------- Cursor: anel que acompanha o mouse (o cursor nativo continua visível) ---------- */
  function cursor() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ring = $("#cursorRing");
    let x = -100, y = -100, rx = -100, ry = -100, active = false;
    document.body.classList.add("has-cursor");
    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!active) { active = true; rx = x; ry = y; ring.classList.add("is-on"); requestAnimationFrame(loop); }
    }, { passive: true });
    function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    const hoverSel = "a, button, .wine, .foto";
    document.addEventListener("mouseover", (e) => { if (e.target.closest(hoverSel)) document.body.classList.add("cursor-hover"); });
    document.addEventListener("mouseout", (e) => { if (e.target.closest(hoverSel)) document.body.classList.remove("cursor-hover"); });
    document.addEventListener("mousedown", () => document.body.classList.add("cursor-down"));
    document.addEventListener("mouseup", () => document.body.classList.remove("cursor-down"));
    document.documentElement.addEventListener("mouseleave", () => ring.classList.remove("is-on"));
    document.documentElement.addEventListener("mouseenter", () => ring.classList.add("is-on"));
  }

  /* ---------- Parallax das fotos da galeria ---------- */
  function fotoParallax() {
    const imgs = $$("[data-parallax]");
    if (reduceMotion || !imgs.length) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      imgs.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 … 0.5
        img.style.transform = `translateY(${p * -10}%) scale(1.15)`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  /* ---------- Header inteligente ---------- */
  function header() {
    const el = $("#header");
    const totop = $("#totop");
    let last = window.scrollY, ticking = false;
    const update = () => {
      const y = window.scrollY;
      el.classList.toggle("header--solid", y > 40);
      const hidden = y > last && y > 240 && !$("#nav").classList.contains("is-open");
      el.classList.toggle("header--hidden", hidden);
      document.body.classList.toggle("header-hidden", hidden);
      totop.classList.toggle("is-visible", y > window.innerHeight);
      last = y; ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
    totop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* ---------- Menu mobile ---------- */
  function burger() {
    const btn = $("#burger"), nav = $("#nav");
    const toggle = (open) => {
      const o = open ?? !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", o);
      btn.classList.toggle("is-open", o);
      btn.setAttribute("aria-expanded", String(o));
      btn.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("is-locked", o);
      if (o) $("#header").classList.remove("header--hidden");
    };
    btn.addEventListener("click", () => toggle());
    $$("a", nav).forEach((a) => a.addEventListener("click", () => toggle(false)));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });
  }

  /* ---------- Reveal ao rolar ---------- */
  function reveal() {
    const els = $$(".reveal, .divider");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Scrollspy (nav + subnav) ---------- */
  function scrollspy() {
    const subLinks = $$(".subnav__link");
    const navLinks = $$(".nav__link");
    const subTargets = subLinks.map((l) => $("#" + l.dataset.target)).filter(Boolean);
    const navTargets = navLinks.map((l) => $(l.getAttribute("href"))).filter(Boolean);
    const track = $("#subnavTrack");

    const setActive = (links, id, attr) => {
      links.forEach((l) => {
        const on = (attr === "sub" ? l.dataset.target : l.getAttribute("href").slice(1)) === id;
        l.classList.toggle("is-active", on);
        if (on && attr === "sub") {
          const r = l.getBoundingClientRect(), tr = track.getBoundingClientRect();
          if (r.left < tr.left || r.right > tr.right) track.scrollTo({ left: l.offsetLeft - tr.width / 2 + r.width / 2, behavior: "smooth" });
        }
      });
    };

    let ticking = false;
    const update = () => {
      const line = window.innerHeight * 0.35;
      const pick = (targets) => {
        let cur = null;
        for (const t of targets) { if (t.getBoundingClientRect().top <= line) cur = t; }
        return cur ? cur.id : null;
      };
      setActive(subLinks, pick(subTargets), "sub");
      setActive(navLinks, pick(navTargets), "nav");
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  /* ---------- Parallax leve no hero (desktop) ---------- */
  function parallax() {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const hero = $("#hero"), photo = $(".hero__photo"), glow = $(".hero__glow"), content = $(".hero__content");
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      photo.style.translate = `${px * -18}px ${py * -18}px`;
      glow.style.translate = `${px * 60}px ${py * 60}px`;
      content.style.transform = `translate(${px * 8}px, ${py * 8}px)`;
    }, { passive: true });
    hero.addEventListener("mouseleave", () => { photo.style.translate = glow.style.translate = ""; content.style.transform = ""; });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    render();
    applyConfig();
    preloader();
    cursor();
    header();
    burger();
    reveal();
    scrollspy();
    parallax();
    fotoParallax();
  });
})();
