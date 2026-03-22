/**
 * main.js — versão corrigida e estável
 */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ── NAVBAR ── */
  const initNavbar = () => {
    const header = document.querySelector('.header');
    const toggle = document.querySelector('.nav__toggle');
    const menu   = document.querySelector('.nav__menu');

    if (!header) return;

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    });
  };

  /* ── SCROLL TOP ── */
  const initScrollTop = () => {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* ── REVEAL (CORRIGIDO) ── */
  const initReveal = () => {
    const els = document.querySelectorAll(
      '.service-card, .testimonial-card, .gallery-card, .counter-item, .about__content, .about__visual, .section-header'
    );

    if (!els.length) return;

    // Segurança: nunca deixa invisível
    els.forEach(el => el.classList.add('visible'));

    if (prefersReducedMotion) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    els.forEach(el => obs.observe(el));
  };

  /* ── SCROLL SUAVE ── */
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        e.preventDefault();

        const offset = document.querySelector('.header')?.offsetHeight || 80;
        const top = target.offsetTop - offset;

        window.scrollTo({
          top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  };

  /* ── LAZY IMAGES ── */
  const initLazyImages = () => {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.style.opacity = '1';
      });
    });
  };

  /* ── ACTIVE LINK ── */
  const initActiveLinks = () => {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav__link');

    if (!sections.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;

        const id = e.target.id;

        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    }, { threshold: 0.4 });

    sections.forEach(s => obs.observe(s));
  };

  /* ── INIT ── */
  const init = () => {
    initNavbar();
    initScrollTop();
    initReveal();
    initSmoothScroll();
    initLazyImages();
    initActiveLinks();
  };

  document.addEventListener('DOMContentLoaded', init);

})();