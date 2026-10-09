const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    primaryNav.classList.toggle('is-open', !isOpen);
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('is-open');
    });
  });
}

const themeToggle = document.querySelector('[data-theme-toggle]');
const themeLabel = document.querySelector('[data-theme-label]');

if (themeToggle) {
  const setHeroMode = (mode) => {
    const isNight = mode === 'night';
    document.documentElement.dataset.heroMode = isNight ? 'night' : 'day';
    themeToggle.setAttribute('aria-pressed', String(isNight));
    themeToggle.title = isNight ? 'Ativar modo dia' : 'Ativar modo noite';

    if (themeLabel) {
      themeLabel.textContent = isNight ? 'Ativar modo dia' : 'Ativar modo noite';
    }
  };

  setHeroMode('day');

  themeToggle.addEventListener('click', () => {
    const nextMode = document.documentElement.dataset.heroMode === 'night' ? 'day' : 'night';
    setHeroMode(nextMode);
  });
}

const heroCards = document.querySelectorAll('[data-hero-card]');
const heroSupport = document.querySelector('[data-hero-support]');

heroCards.forEach((card) => {
  card.addEventListener('click', () => {
    heroCards.forEach((item) => {
      const isSelected = item === card;
      item.classList.toggle('is-active', isSelected);
      item.setAttribute('aria-pressed', String(isSelected));
    });

    if (heroSupport) {
      heroSupport.textContent = card.dataset.heroCopy || '';
    }
  });
});

const contactForm = document.querySelector('[data-contact-form]');
const feedback = document.querySelector('[data-form-feedback]');

if (contactForm && feedback) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const name = contactForm.elements.name.value.trim();

    if (!contactForm.checkValidity()) {
      feedback.textContent = 'Confira os campos destacados para continuar.';
      contactForm.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.innerHTML = 'Preparando conversa <span aria-hidden="true">…</span>';

    window.setTimeout(() => {
      feedback.textContent = `Obrigado, ${name || 'tudo certo'}. Recebemos seu interesse. Esta demonstração está pronta para conectar ao canal de atendimento da Nowtech.`;
      feedback.classList.add('is-success');
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      submitButton.innerHTML = 'Enviar outra mensagem <span aria-hidden="true">↗</span>';
    }, 500);
  });
}

const solutionTabs = [...document.querySelectorAll('[data-solution-tab]')];
const solutionPanels = [...document.querySelectorAll('[data-solution-panel]')];

const activateSolution = (solutionName, shouldFocus = false) => {
  solutionTabs.forEach((tab) => {
    const isActive = tab.dataset.solutionTab === solutionName;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;

    if (isActive && shouldFocus) {
      tab.focus();
    }
  });

  solutionPanels.forEach((panel) => {
    const isActive = panel.dataset.solutionPanel === solutionName;
    panel.hidden = !isActive;
    panel.classList.toggle('is-active', isActive);
  });
};

solutionTabs.forEach((tab, tabIndex) => {
  tab.addEventListener('click', () => activateSolution(tab.dataset.solutionTab));

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const lastIndex = solutionTabs.length - 1;
    let nextIndex = tabIndex;

    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = lastIndex;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = tabIndex === lastIndex ? 0 : tabIndex + 1;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = tabIndex === 0 ? lastIndex : tabIndex - 1;

    activateSolution(solutionTabs[nextIndex].dataset.solutionTab, true);
  });
});

const methodPath = document.querySelector('[data-method-path]');

if (methodPath) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    methodPath.classList.add('is-visible');
  } else {
    const methodObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        methodPath.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    methodObserver.observe(methodPath);
  }
}
