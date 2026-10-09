/* ==========================================================
   Vidraçaria — comportamento
   JavaScript puro: topo fixo, menu, entradas e formulário.
   ========================================================== */
(function () {
  'use strict';
  var doc = document;
  var q  = function (s, c) { return (c || doc).querySelector(s); };
  var qa = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var menos = matchMedia('(prefers-reduced-motion: reduce)');

  /* --- a pílula do topo fica sólida depois do hero --- */
  var topo = q('#topo');
  addEventListener('scroll', function () {
    topo.classList.toggle('fixo', (scrollY || pageYOffset) > 40);
  }, { passive: true });

  /* --- gaveta do celular --- */
  var hamb = q('#hamb'), gaveta = q('#gaveta'), aberta = false;
  function alterna(abrir) {
    aberta = abrir;
    hamb.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    hamb.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    doc.body.classList.toggle('preso', abrir);
    if (abrir) { gaveta.hidden = false; requestAnimationFrame(function () { gaveta.classList.add('aberta'); }); }
    else { gaveta.classList.remove('aberta'); setTimeout(function () { if (!aberta) gaveta.hidden = true; }, 600); }
  }
  hamb.addEventListener('click', function () { alterna(!aberta); });
  qa('a', gaveta).forEach(function (a) { a.addEventListener('click', function () { alterna(false); }); });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && aberta) { alterna(false); hamb.focus(); }
  });

  /* --- entradas, uma vez só --- */
  var alvos = qa('[data-rv]');
  if (menos.matches || !('IntersectionObserver' in window)) {
    alvos.forEach(function (e) { e.classList.add('dentro'); });
  } else {
    var vistos = new WeakMap();
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (it) {
        if (!it.isIntersecting) return;
        var el = it.target, pai = el.parentNode, n = vistos.get(pai) || 0;
        el.style.setProperty('--d', (n * 0.06).toFixed(2) + 's');
        vistos.set(pai, n + 1);
        el.classList.add('dentro');
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    alvos.forEach(function (e) { obs.observe(e); });
  }

  /* --- link do topo acompanha a seção visível ---
     Antes isto era um IntersectionObserver com uma faixa de 5% no meio da
     tela. Dois problemas: quando duas seções entravam no mesmo lote de
     eventos, quem vencia era a última do array e não a que estava em cena;
     e dentro de uma seção sem link no menu (Processo, a faixa de números)
     nada disparava, então o destaque ficava preso no valor anterior.

     Agora a conta é direta: uma linha de referência a 30% da altura da
     tela, e ganha a última seção cujo topo já passou por ela. Determinístico,
     resistente a rolagem rápida e imune a buracos entre seções. */
  (function () {
    var elos = qa('.topo__menu a');
    var alvos = [];
    elos.forEach(function (a) {
      var sec = q(a.getAttribute('href'));
      if (sec) alvos.push({ elo: a, sec: sec, topo: 0 });
    });
    if (!alvos.length) return;

    /* Medir na hora, sem guardar: as imagens lazy carregam durante a rolagem
       e empurram as seções para baixo. Qualquer posição guardada envelhece —
       era por isso que, ao voltar ao topo, o menu ainda dizia Diferenciais.
       São seis getBoundingClientRect por quadro, custo irrelevante. */
    function marcar() {
      agendado = false;
      var linha = innerHeight * 0.3;
      var atual = alvos[0];
      for (var i = 0; i < alvos.length; i++) {
        if (alvos[i].sec.getBoundingClientRect().top <= linha) atual = alvos[i];
      }
      /* encostou no fim da página: a última seção é a que vale */
      if ((scrollY || pageYOffset) + innerHeight >= doc.documentElement.scrollHeight - 4) {
        atual = alvos[alvos.length - 1];
      }
      alvos.forEach(function (o) { o.elo.classList.toggle('aqui', o === atual); });
    }

    var agendado = false;
    function pedir() { if (!agendado) { agendado = true; requestAnimationFrame(marcar); } }
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', pedir, { passive: true });
    addEventListener('load', pedir);
    marcar();
  })();

  /* --- formulário: validação visual, sem servidor --- */
  var form = q('.form');
  if (form) {
    var aviso = q('.form__aviso', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var falhou = null;
      qa('.campo', form).forEach(function (campo) {
        var c = q('input,select,textarea', campo);
        if (!c || !c.required) return;
        var ok = c.value.trim() !== '';
        campo.classList.toggle('erro', !ok);
        if (!ok && !falhou) falhou = c;
      });
      if (falhou) { aviso.textContent = 'Preencha os campos obrigatórios para seguir.'; falhou.focus(); return; }

      /* sem servidor: montamos a mensagem e entregamos ao WhatsApp */
      var numero = form.dataset.zap;
      var val = function (id) { var c = q('#' + id); return c ? c.value.trim() : ''; };
      var linhas = [
        'Olá! Gostaria de um orçamento com a Porto Glass.',
        '',
        'Nome: ' + val('f-nome'),
        'WhatsApp: ' + val('f-zap'),
        'Tipo de projeto: ' + val('f-tipo')
      ];
      if (val('f-msg')) linhas.push('', val('f-msg'));
      aviso.textContent = 'Abrindo o WhatsApp com a sua mensagem…';
      window.open('https://wa.me/' + numero + '?text=' +
                  encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
    });
    qa('.campo input,.campo select,.campo textarea', form).forEach(function (c) {
      c.addEventListener('input', function () { c.closest('.campo').classList.remove('erro'); });
    });
  }


  /* --- a linha do tempo acende conforme a rolagem avança ---
     Um só listener, com o trabalho jogado para o próximo quadro e
     nada calculado enquanto a seção está fora da tela. */
  (function () {
    var linha = q('.linha');
    if (!linha) return;
    var itens = qa('li', linha);
    if (menos.matches) { itens.forEach(function (li) { li.classList.add('ativo'); }); return; }

    var vaos = itens.length - 1;          /* 6 marcos, 5 vãos entre eles */
    var agendado = false;
    function medir() {
      agendado = false;
      var r = linha.getBoundingClientRect();
      if (r.bottom < -120 || r.top > innerHeight + 120) return;

      /* Faixa longa de propósito: começa quando a linha aparece a 88% da
         tela e só fecha quando sobe a 13%. São ~0,75 de uma tela inteira
         de rolagem para percorrer os seis marcos — bem mais lento que antes. */
      var p = (innerHeight * 0.88 - r.top) / (innerHeight * 0.75);
      p = p < 0 ? 0 : p > 1 ? 1 : p;

      var andado = p * vaos;              /* quantos vãos já foram vencidos */
      for (var i = 0; i < itens.length; i++) {
        /* cada vão preenche de 0 a 1 conforme a linha o atravessa */
        var f = andado - i;
        f = f < 0 ? 0 : f > 1 ? 1 : f;
        itens[i].style.setProperty('--preenche', f.toFixed(3));
        /* o marco acende quando a linha chega nele */
        itens[i].classList.toggle('ativo', andado >= i - 0.02);
      }
    }
    function pedir() { if (!agendado) { agendado = true; requestAnimationFrame(medir); } }
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', pedir, { passive: true });
    medir();
  })();

  var ano = q('#ano'); if (ano) ano.textContent = new Date().getFullYear();
})();
