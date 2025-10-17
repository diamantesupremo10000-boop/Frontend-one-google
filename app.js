/* ========== app.js ========== */
/* Client-side interactions and progressive enhancements.
   - Simple scroll reveal using IntersectionObserver
   - Small behaviour: set current year, add keyboard accessible handlers
   - No external libraries, vanilla JS only
*/

document.addEventListener('DOMContentLoaded', function () {
  // Insert current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Scroll reveal: select elements with class .reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // reveal once
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    reveals.forEach(el => obs.observe(el));
  } else {
    // Fallback: if no IntersectionObserver, simply show elements
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Button subtle micro-interactions: add ripple-like focus effect
  const ctas = document.querySelectorAll('.btn-primary, .btn-outline');
  ctas.forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      // trigger on Enter or Space so keyboard users see interaction
      if (e.key === 'Enter' || e.key === ' ') {
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 160);
      }
    });
  });

  // Improve accessible search submission: keep default but announce via console (demo)
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      // Minimal progressive enhancement: prevent full navigation in demo
      e.preventDefault();
      const q = (document.getElementById('search-input') || {}).value || '';
      // For production: send q to backend or route appropriately.
      // Here we show a polite focus change for keyboard users.
      console.log('Búsqueda solicitada:', q);
      // Announce result visually via an aria-live region (create if missing)
      let live = document.getElementById('aria-live-search');
      if (!live) {
        live = document.createElement('div');
        live.id = 'aria-live-search';
        live.setAttribute('aria-live', 'polite');
        live.className = 'visually-hidden';
        document.body.appendChild(live);
      }
      live.textContent = q ? `Resultados para "${q}" (demo).` : 'Por favor ingresa términos de búsqueda.';
    });
  }

  // Small enhancement: keyboard shortcut "/" focuses search (like many apps)
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    // Ignore if user typing in an input or textarea
    if (e.key === '/' && active && (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA')) {
      const search = document.getElementById('search-input');
      if (search) {
        e.preventDefault();
        search.focus();
        search.select();
      }
    }
  });

  // Respect prefers-reduced-motion: avoid animations if user prefers reduced motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) {
    // Remove transitions for reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.transition = 'none';
    });
  }
});