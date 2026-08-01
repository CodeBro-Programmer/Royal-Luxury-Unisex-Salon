/* ==========================================================================
   NAVIGATION.JS
   Handles: sticky navbar state, mobile menu toggle, smooth-scroll active
   link highlighting, back-to-top button, and the scroll progress bar.
   Exposes: window.RoyalNav (small helpers other modules can reuse)
   ========================================================================== */

(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navbarNav = document.getElementById('navbarNav');
  const navLinks = document.querySelectorAll('.navbar__link');
  const backToTop = document.getElementById('backToTop');
  const scrollProgress = document.getElementById('scrollProgress');
  const sections = document.querySelectorAll('main section[id]');

  const SCROLL_THRESHOLD = 40;

  /**
   * Toggle the "scrolled" compact navbar state and update the
   * scroll-progress bar + back-to-top visibility on every scroll tick.
   */
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Sticky navbar compact state
    if (navbar) {
      navbar.classList.toggle('is-scrolled', scrollY > SCROLL_THRESHOLD);
    }

    // Back-to-top visibility
    if (backToTop) {
      backToTop.classList.toggle('is-visible', scrollY > window.innerHeight * 0.6);
    }

    // Scroll progress bar (percentage of page scrolled)
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }

    updateActiveLink(scrollY);
  }

  /**
   * Highlights the nav link whose section is currently in view.
   */
  function updateActiveLink(scrollY) {
    let currentId = '';
    const offset = (navbar ? navbar.offsetHeight : 0) + 20;

    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('is-active', isActive);
    });
  }

  /**
   * Mobile menu open/close.
   */
  function toggleMenu(forceClose) {
    const shouldOpen = forceClose === true ? false : !navToggle.classList.contains('is-open');
    navToggle.classList.toggle('is-open', shouldOpen);
    navToggle.setAttribute('aria-expanded', String(shouldOpen));
    navbarNav.classList.toggle('is-open', shouldOpen);
    document.body.classList.toggle('no-scroll', shouldOpen);
  }

  if (navToggle && navbarNav) {
    navToggle.addEventListener('click', () => toggleMenu());

    // Close the mobile menu whenever a nav link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMenu(true));
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('load', handleScroll);

  // Small shared helper other modules (booking.js) can reuse to scroll
  // to a section without duplicating logic.
  window.RoyalNav = {
    scrollToSection(id) {
      const target = document.getElementById(id);
      if (target) {
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    },
  };
})();
