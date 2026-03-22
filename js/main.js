/**
 * main.js — Cinthia Ribeiro v3.0
 */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* ── 01. CURSOR ── */
  const initCursor = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    const dot  = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    }, { passive: true });

    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      rx = lerp(rx, mx, 0.13);
      ry = lerp(ry, my, 0.13);
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const targets = 'a, button, [role="button"], .service-card, .gallery-item';
    document.addEventListener('mouseover', e => {
      if (!e.target.closest(targets)) return;
      dot.style.width = '14px'; dot.style.height = '14px';
      ring.style.width = '50px'; ring.style.height = '50px';
    });
    document.addEventListener('mouseout', e => {
      if (!e.target.closest(targets)) return;
      dot.style.width = ''; dot.style.height = '';
      ring.style.width = ''; ring.style.height = '';
    });
  };

  /* ── 02. NAVBAR + HAMBURGER ── */
  const initNavbar = () => {
    const header = document.querySelector('.header');
    const toggle = document.querySelector('.nav__toggle');
    const menu   = document.querySelector('.nav__menu');
    if (!header) return;

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    if (!toggle || !menu) return;

    const overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    const openMenu = () => {
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      const first = menu.querySelector('a');
      if (first) setTimeout(() => first.focus(), 50);
    };

    const closeMenu = () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
      // SEM toggle.focus() — não sequestra o foco do link clicado
    };

    toggle.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Fechar ao clicar em link — delay para a navegação acontecer primeiro
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        setTimeout(closeMenu, 10);
      });
    });

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  };

  /* ── 03. BARRA DE PROGRESSO ── */
  const initReadProgress = () => {
    const bar = document.querySelector('.read-progress');
    if (!bar || prefersReducedMotion) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc   = document.documentElement;
        const total = doc.scrollHeight - doc.clientHeight;
        bar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0';
        ticking = false;
      });
    }, { passive: true });
  };

  /* ── 04. SCROLL TO TOP ── */
  const initScrollTop = () => {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  };

  /* ── 05. REVEAL ON SCROLL ── */
  const initReveal = () => {
    const els = document.querySelectorAll(
      '.service-card, .testimonial-card, .gallery-item, .gallery-card, .counter-item, .about__content, .about__visual, .section-header'
    );
    if (!els.length) return;
    if (prefersReducedMotion) {
      els.forEach(el => el.classList.add('reveal', 'visible'));
      return;
    }
    els.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
    els.forEach(el => obs.observe(el));
  };

  /* ── 06. GALERIA — touch + click ── */
  const initGallery = () => {
    document.querySelectorAll('.gallery-item').forEach(item => {
      const compare = item.querySelector('.gallery-item__compare');
      if (!compare) return;

      // Funciona tanto em touch quanto em mouse
      const toggle = (e) => {
        e.preventDefault();
        item.classList.toggle('revealed');
      };

      compare.addEventListener('click', toggle);
      compare.addEventListener('touchend', toggle, { passive: false });
    });
  };

  /* ── 07. SCROLL SUAVE ÂNCORAS ── */
  const initSmoothScroll = () => {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // navH calculado no momento do clique — sempre atualizado
      const navH = document.querySelector('.header')?.offsetHeight ?? 80;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  };

  /* ── 08. LAZY IMAGES ── */
  const initLazyImages = () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (img.complete) return;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      img.addEventListener('load',  () => { img.style.opacity = '1'; }, { once: true });
      img.addEventListener('error', () => {
        img.style.opacity = '1'; // ← mostra mesmo com erro, não some
        const p = img.closest('figure, .hero__photo, .about__visual');
        if (p) p.classList.add('img-error');
      }, { once: true });
    });
  };

  /* ── 09. PARALLAX HERO ── */
  const initParallax = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    const img = document.querySelector('.hero__photo img');
    if (!img) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const p = Math.min(window.scrollY / window.innerHeight, 1);
        img.style.transform = `translateY(${p * 38}px) scale(1.03)`;
        ticking = false;
      });
    }, { passive: true });
  };

  /* ── 10. ACTIVE LINK ── */
  const initActiveLinks = () => {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav__link[href^="#"]');
    if (!sections.length || !links.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.getAttribute('id');
        links.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${id}`) l.classList.add('active');
        });
      });
    }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });
    sections.forEach(s => obs.observe(s));
  };

  /* ── BOOT ── */
  const init = () => {
    initCursor();
    initNavbar();
    initReadProgress();
    initScrollTop();
    initReveal();
    initGallery();
    initSmoothScroll();
    initLazyImages();
    initParallax();
    initActiveLinks();
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();