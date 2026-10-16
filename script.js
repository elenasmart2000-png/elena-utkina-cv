(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#nav-links');
  const links = [...menu.querySelectorAll('a')];
  function closeMenu(returnFocus = false) {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  links.forEach(link => link.addEventListener('click', () => {
    closeMenu();
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      section.setAttribute('tabindex', '-1');
      section.focus({preventScroll:true});
    }
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.navigation')) closeMenu();
  });
  matchMedia('(min-width:901px)').addEventListener('change', () => closeMenu());
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  function markCurrent() {
    scheduled = false;
    const threshold = document.querySelector('.navigation').offsetHeight + 60;
    let current = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section.id;
    }
    if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = 'contacts';
    links.forEach(link => {
      if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) {scheduled = true; requestAnimationFrame(markCurrent);}
  }, {passive:true});
  window.addEventListener('resize', markCurrent);
  document.querySelectorAll('.experience-card').forEach(card => card.addEventListener('toggle', markCurrent));
  markCurrent();
  let beforePrintState;
  window.addEventListener('beforeprint', () => {
    beforePrintState = [...document.querySelectorAll('.experience-card')].map(card => [card, card.open]);
    beforePrintState.forEach(([card]) => {card.open = true;});
  });
  window.addEventListener('afterprint', () => beforePrintState?.forEach(([card, open]) => {card.open = open;}));
})();
