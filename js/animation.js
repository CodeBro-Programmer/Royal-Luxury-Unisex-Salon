/* ==========================================================================
   ANIMATION.JS
   Handles: page-load preloader, scroll-reveal animations (IntersectionObserver)
   and the animated stat counters in the hero section.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    // Remove from the accessibility tree / tab order once hidden
    window.setTimeout(() => {
      preloader.setAttribute('aria-hidden', 'true');
    }, 900);
  }

  // Hide once everything (including fonts/images) has loaded, with a small
  // minimum display time so the animation doesn't just flash on fast loads.
  const MIN_DISPLAY_MS = 700;
  const loadStart = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - loadStart;
    const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);
    window.setTimeout(hidePreloader, remaining);
  });

  // Safety net: never let the preloader block the site for more than 4s
  window.setTimeout(hidePreloader, 4000);

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // No IntersectionObserver support: just show everything immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1800; // ms
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease-out for a natural deceleration toward the final number
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }
})();
