/* Comet interactions, navbar, reveals, carousel, counters */
(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav
  const burger = $('.hamburger');
  const menu = $('#primary-menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  // Sticky nav shadow
  const navbar = $('.navbar');
  const toggleNavShadow = () => {
    if (!navbar) return;
    const sc = window.scrollY;
    navbar.style.boxShadow = sc > 4 ? '0 10px 30px rgba(0,0,0,.35)' : 'none';
  };
  window.addEventListener('scroll', toggleNavShadow);
  toggleNavShadow();

  // Reveal on scroll
  const revealEls = $$('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => io.observe(el));

  // Carousel
  const slides = $$('.slide');
  const dots = $$('.dot');
  const nextBtn = $('.slider-btn.next');
  const prevBtn = $('.slider-btn.prev');
  let idx = 0;
  let timer;

  function show(i){
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
    if (dots[idx]) dots[idx].classList.add('active');
  }
  function next(){ show(idx + 1); }
  function prev(){ show(idx - 1); }
  function autoplay(){
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); autoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); autoplay(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); autoplay(); }));
  show(0); autoplay();

  // Smooth scroll for in-page anchors
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id && $(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Animated counters (optional if elements exist)
  $$('.counter[data-target]').forEach(el => {
    const target = Number(el.dataset.target || 0);
    const dur = 1200;
    let start = null;
    const fmt = (v) => Math.floor(v).toLocaleString();
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start)/dur);
      el.textContent = fmt(p * target);
      if (p < 1) requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((ents) => {
      if (ents[0].isIntersecting) { requestAnimationFrame(step); obs.disconnect(); }
    }, { threshold: 0.6 });
    obs.observe(el);
  });
})();
