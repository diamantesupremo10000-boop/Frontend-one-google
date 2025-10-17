/* app.js
   Interacciones JS pequeñas y accesibles:
   - Toggle menú móvil
   - Buscar (filtrado simple de títulos)
   - Reveal on scroll con IntersectionObserver
   - Manejo pequeño de formulario (prevent default para demo)
   - Actualizar año en footer
*/

/* ------------------ Helpers ------------------ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const mobileToggle = $('#mobileToggle');
  const mobileMenu = $('#mobileMenu');
  const searchForm = $('#searchForm');
  const siteSearch = $('#siteSearch');
  const cards = $$('.card');
  const yearEl = $('#year');

  // Set current year in footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------ Mobile menu toggle ------------------ */
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!expanded));
      if (mobileMenu.hasAttribute('hidden')) {
        mobileMenu.removeAttribute('hidden');
        mobileToggle.setAttribute('aria-label', 'Cerrar menú');
      } else {
        mobileMenu.setAttribute('hidden', '');
        mobileToggle.setAttribute('aria-label', 'Abrir menú');
      }
    });

    // Close mobile menu when focus leaves (basic behavior)
    mobileMenu.addEventListener('focusout', (e) => {
      // if focus moves outside the mobileMenu and toggle, hide it
      setTimeout(() => {
        if (!mobileMenu.contains(document.activeElement) && document.activeElement !== mobileToggle) {
          mobileMenu.setAttribute('hidden', '');
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.setAttribute('aria-label', 'Abrir menú');
        }
      }, 10);
    });
  }

  /* ------------------ Simple search (client-side demo)
     This is only a UI filter to demonstrate behavior without backend.
     It filters article cards by title/content.
  */
  if (searchForm && siteSearch) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault(); // prevent navigation for demo
      const q = siteSearch.value.trim().toLowerCase();
      filterCards(q);
    });

    // Also filter as user types (debounced)
    let debounce;
    siteSearch.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const q = siteSearch.value.trim().toLowerCase();
        filterCards(q);
      }, 180);
    });
  }

  function filterCards(query) {
    // If empty query, show all
    cards.forEach(card => {
      const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
      const match = !query || title.includes(query) || desc.includes(query);
      card.style.display = match ? '' : 'none';
    });
  }

  /* ------------------ Reveal on scroll (IntersectionObserver) ------------------ */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // trigger a bit earlier
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve to avoid re-trigger and to keep performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with class 'reveal'
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ------------------ Small accessibility: keyboard "Enter" on cards
     pressing Enter anywhere on a card will activate the first link inside (if any).
  */
  cards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const link = card.querySelector('a');
        if (link) link.click();
      }
    });
  });

  /* ------------------ Form handlers (demo) ------------------ */
  // CTA subscription form: prevent default and offer tiny confirmation (accessible)
  const ctaForm = document.querySelector('.inline-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = ctaForm.querySelector('input[type="email"]')?.value || '';
      // Simple in-page acknowledgment (aria-live friendly could be used)
      alert(`Gracias — hemos registrado: ${email}`);
      ctaForm.reset();
    });
  }

  /* ------------------ Reduce motion preference respect ------------------ */
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // remove CSS transitions that might cause motion
    document.documentElement.style.setProperty('--transition', '0ms');
  }
});