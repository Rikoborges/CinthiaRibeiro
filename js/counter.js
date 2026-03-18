/**
 * counter.js — Cinthia Ribeiro
 * Animação dos contadores com IntersectionObserver
 * Leve, sem dependências, performance-first
 */

(() => {
  'use strict';

  // ── Easing suave (ease-out-expo) ──
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  /**
   * Anima um número de 0 até o target
   * @param {HTMLElement} el
   * @param {number} target
   * @param {string} suffix
   * @param {number} duration ms
   */
  const animateCounter = (el, target, suffix = '', duration = 1800) => {
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = isDecimal
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  // ── IntersectionObserver: dispara só quando visível ──
  const initCounters = () => {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    // Respeita preferência de redução de movimento
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const suffix = el.dataset.suffix ?? '';

          if (prefersReducedMotion) {
            // Sem animação: mostra valor final direto
            el.textContent = target + suffix;
          } else {
            animateCounter(el, target, suffix, 1800);
          }

          // Dispara só uma vez
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    counters.forEach((el) => observer.observe(el));
  };

  // ── Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }
})();