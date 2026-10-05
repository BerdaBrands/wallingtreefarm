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

  // Gallery viewer: one slideshow per event type (photos + videos)
  const projects = JSON.parse(document.getElementById('projects-data').textContent);
  const viewer = document.getElementById('viewer');
  const vTitle = viewer.querySelector('.viewer__title');
  const vCount = viewer.querySelector('.viewer__count');
  const vMedia = viewer.querySelector('.viewer__media');
  const vCaption = viewer.querySelector('.viewer__caption');
  const vThumbs = viewer.querySelector('.viewer__thumbs');
  const vPrev = viewer.querySelector('.viewer__nav--prev');
  const vNext = viewer.querySelector('.viewer__nav--next');
  let current = null;
  let index = 0;
  let opener = null;

  const show = (i) => {
    const items = current.items;
    index = (i + items.length) % items.length;
    const item = items[index];
    vMedia.innerHTML = '';
    let el;
    if (item.type === 'video') {
      el = document.createElement('video');
      el.src = item.src;
      el.poster = item.thumb;
      el.controls = true;
      el.playsInline = true;
      el.preload = 'metadata';
    } else {
      el = document.createElement('img');
      el.src = item.src;
      el.alt = item.alt;
    }
    vMedia.appendChild(el);
    vCaption.textContent = item.alt;
    vCount.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
    vPrev.hidden = vNext.hidden = items.length < 2;
    vThumbs.querySelectorAll('button').forEach((b, k) => {
      b.setAttribute('aria-current', k === index ? 'true' : 'false');
      if (k === index) b.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
  };

  const open = (p, btn) => {
    current = projects[p];
    opener = btn;
    vTitle.textContent = current.title;
    vThumbs.innerHTML = current.items.map((it, k) =>
      '<li><button class="' + (it.type === 'video' ? 'is-video' : '') + '" aria-label="Show item ' + (k + 1) + '">' +
      '<img src="' + it.thumb + '" alt="" loading="lazy"></button></li>').join('');
    vThumbs.querySelectorAll('button').forEach((b, k) => b.addEventListener('click', () => show(k)));
    viewer.hidden = false;
    document.body.classList.add('is-locked');
    show(0);
    viewer.querySelector('.viewer__close').focus();
  };

  const closeViewer = () => {
    vMedia.innerHTML = '';
    viewer.hidden = true;
    document.body.classList.remove('is-locked');
    if (opener) opener.focus();
  };

  document.querySelectorAll('[data-project]').forEach((btn) => {
    btn.addEventListener('click', () => open(+btn.dataset.project, btn));
  });
  viewer.querySelector('.viewer__close').addEventListener('click', closeViewer);
  vPrev.addEventListener('click', () => show(index - 1));
  vNext.addEventListener('click', () => show(index + 1));
  vMedia.addEventListener('click', (e) => { if (e.target === vMedia) closeViewer(); });
  document.addEventListener('keydown', (e) => {
    if (viewer.hidden) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  let touchX = null;
  vMedia.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  vMedia.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50 && current.items.length > 1) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // Scroll reveal
  const items = document.querySelectorAll('.animal, .events li, .steps li, .area, .project, .feature__img, .feature__copy');
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
