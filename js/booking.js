/* ==========================================================================
   BOOKING.JS
   Handles: booking form validation, prefilling the service field when a
   "Book" button is clicked on a service card, and the demo success screen.
   NOTE: This is a demonstration form. It never sends data anywhere — see
   the success message copy for the disclosure shown to the user.
   ========================================================================== */

(function () {
  'use strict';

  const form = document.getElementById('bookingForm');
  if (!form) return;

  const successPanel = document.getElementById('bookingSuccess');
  const resetButton = document.getElementById('bookingReset');
  const dateInput = document.getElementById('date');
  const serviceSelect = document.getElementById('service');

  const VALIDATORS = {
    fullName: (value) => value.trim().length >= 2 || 'Please enter your full name.',
    phone: (value) => /^[0-9+()\-\s]{7,20}$/.test(value.trim()) || 'Enter a valid phone number.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Enter a valid email address.',
    service: (value) => value.trim().length > 0 || 'Please select a service.',
    date: (value) => value.trim().length > 0 || 'Please choose a preferred date.',
    time: (value) => value.trim().length > 0 || 'Please choose a preferred time.',
  };

  // Prevent picking a date in the past
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Prefill the service dropdown when a "Book" link on a service card is used
  document.querySelectorAll('.service-card__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceName = btn.dataset.service;
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
    });
  });

  function showFieldError(fieldName, message) {
    const group = form.querySelector(`[name="${fieldName}"]`)?.closest('.form-group');
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (group) group.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateForm() {
    let isValid = true;

    Object.keys(VALIDATORS).forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field) return;

      const result = VALIDATORS[fieldName](field.value);
      if (result !== true) {
        showFieldError(fieldName, result);
        isValid = false;
      } else {
        showFieldError(fieldName, '');
      }
    });

    return isValid;
  }

  // Clear a field's error as soon as the user starts fixing it
  form.addEventListener('input', (e) => {
    const name = e.target.name;
    if (name && VALIDATORS[name]) {
      const result = VALIDATORS[name](e.target.value);
      showFieldError(name, result === true ? '' : '');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = form.querySelector('.has-error input, .has-error select');
      if (firstError) firstError.focus();
      return;
    }

    // This is a demonstration site: no data is sent anywhere. We simply
    // reveal the success panel, which discloses that clearly to the user.
    if (successPanel) {
      successPanel.hidden = false;
      successPanel.querySelector('h3')?.focus();
    }
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      form.reset();
      if (successPanel) successPanel.hidden = true;
      Object.keys(VALIDATORS).forEach((fieldName) => showFieldError(fieldName, ''));
    });
  }
})();
