/* ==========================================================================
   GALLERY.JS
   Handles: masonry gallery category filtering + the lightbox viewer
   (open, close, next/prev, keyboard navigation).
   ========================================================================== */

(function () {
  'use strict';

  const filterButtons = document.querySelectorAll('.gallery__filter');
  const galleryItems = Array.from(document.querySelectorAll('.gallery__item'));

  /* ---------- Category filtering ---------- */
  function applyFilter(category) {
    galleryItems.forEach((item) => {
      const matches = category === 'all' || item.dataset.category === category;
      item.classList.toggle('is-hidden', !matches);
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('is-active'));
      button.classList.add('is-active');
      applyFilter(button.dataset.filter);
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;

  function visibleItems() {
    return galleryItems.filter((item) => !item.classList.contains('is-hidden'));
  }

  function openLightbox(index) {
    const items = visibleItems();
    if (!items.length) return;

    currentIndex = (index + items.length) % items.length;
    const img = items[currentIndex].querySelector('img');

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  function showRelative(step) {
    const items = visibleItems();
    if (!items.length) return;
    const targetItem = items[(currentIndex + step + items.length) % items.length];
    openLightbox(items.indexOf(targetItem));
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showRelative(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showRelative(1));

  if (lightbox) {
    // Click on the dark backdrop (not the image/buttons) closes the viewer
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });
})();
