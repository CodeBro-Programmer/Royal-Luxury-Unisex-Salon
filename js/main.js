/* ==========================================================================
   MAIN.JS
   Handles: testimonial slider, FAQ accordion, and small page-wide setup
   (footer year). Loaded last so it can assume navigation/animation/gallery/
   booking modules have already attached their own listeners.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (track && dotsWrap) {
    const slides = Array.from(track.children);
    let activeIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_MS = 6000;

    // Build one dot per slide
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-slider__dot';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      activeIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
      restartAutoplay();
    }

    function startAutoplay() {
      autoplayTimer = window.setInterval(() => goTo(activeIndex + 1), AUTOPLAY_MS);
    }

    function restartAutoplay() {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      startAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(activeIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(activeIndex + 1));

    // Pause autoplay while the user's pointer is over the slider
    const sliderWrap = track.closest('.testimonial-slider');
    if (sliderWrap) {
      sliderWrap.addEventListener('mouseenter', () => window.clearInterval(autoplayTimer));
      sliderWrap.addEventListener('mouseleave', restartAutoplay);
    }

    goTo(0);
    startAutoplay();
  }

  /* ---------- FAQ accordion ---------- */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close any other open item so only one is expanded at a time
      accordionItems.forEach((other) => {
        if (other === item) return;
        const otherTrigger = other.querySelector('.accordion__trigger');
        const otherPanel = other.querySelector('.accordion__panel');
        if (otherTrigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherPanel.style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });
})();
