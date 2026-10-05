// Walling Tree Farm – small interactions
(function () {
  // Mobile menu
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Lightbox
  const box = document.getElementById('lightbox');
  const boxImg = box.querySelector('img');
  const close = () => { box.hidden = true; document.body.classList.remove('is-locked'); };
  document.querySelectorAll('.gallery__item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      boxImg.src = btn.dataset.full;
      boxImg.alt = img.alt;
      box.hidden = false;
      document.body.classList.add('is-locked');
    });
  });
  box.addEventListener('click', (e) => { if (e.target !== boxImg) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !box.hidden) close(); });

  // Gallery: show more
  const more = document.getElementById('gallery-more');
  more.addEventListener('click', () => {
    document.querySelectorAll('.gallery li[hidden]').forEach((li) => { li.hidden = false; });
    more.remove();
  });

  // Scroll reveal
  const items = document.querySelectorAll('.animal, .events li, .steps li, .area, .gallery li, .feature__img, .feature__copy');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
