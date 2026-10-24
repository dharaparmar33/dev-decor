/**
 * DEV DECOR — Main Interactive JavaScript
 * Handles:
 *  - English / Hindi Language Switcher
 *  - Scroll-Reveal Animations (IntersectionObserver)
 *  - Mobile Navigation Drawer
 *  - Sticky Header Enhancements
 *  - Project Gallery Category Filtering
 *  - Contact Form to WhatsApp Integration
 *  - Dynamic Copyright Year
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initMobileNav();
  initStickyHeader();
  initScrollReveal();
  initGalleryFiltering();
  initFaqAccordion();
  initContactForm();
  initDynamicYear();
  initActiveNavLink();
});

/* -------------------------------------------------------------
 * 1. English / Hindi Language Switcher
 * ------------------------------------------------------------- */
function initLanguageSwitcher() {
  const enBtns = document.querySelectorAll('.lang-en-btn');
  const hiBtns = document.querySelectorAll('.lang-hi-btn');

  function applyLanguage(lang) {
    const isHindi = lang === 'hi';
    document.documentElement.lang = isHindi ? 'hi' : 'en';

    // Update all elements with data-en and data-hi attributes
    document.querySelectorAll('[data-en][data-hi]').forEach(el => {
      const text = isHindi ? el.getAttribute('data-hi') : el.getAttribute('data-en');
      if (text !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update active class on all language buttons
    enBtns.forEach(btn => btn.classList.toggle('active', !isHindi));
    hiBtns.forEach(btn => btn.classList.toggle('active', isHindi));

    // Update document title if page provides localized titles
    const metaTitleEn = document.querySelector('meta[name="title-en"]');
    const metaTitleHi = document.querySelector('meta[name="title-hi"]');
    if (isHindi && metaTitleHi) {
      document.title = metaTitleHi.getAttribute('content');
    } else if (!isHindi && metaTitleEn) {
      document.title = metaTitleEn.getAttribute('content');
    }

    localStorage.setItem('devDecorLanguage', lang);
  }

  enBtns.forEach(btn => btn.addEventListener('click', () => applyLanguage('en')));
  hiBtns.forEach(btn => btn.addEventListener('click', () => applyLanguage('hi')));

  // Check saved language preference
  const savedLang = localStorage.getItem('devDecorLanguage');
  if (savedLang === 'hi') {
    applyLanguage('hi');
  }
}

/* -------------------------------------------------------------
 * 2. Mobile Navigation Drawer
 * ------------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.navlinks');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* -------------------------------------------------------------
 * 3. Sticky Header
 * ------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('header.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* -------------------------------------------------------------
 * 4. Scroll-Reveal Animations (IntersectionObserver)
 * ------------------------------------------------------------- */
function initScrollReveal() {
  // Check user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  if (!('IntersectionObserver' in window)) {
    return;
  }

  document.documentElement.classList.add('reveal-ready');

  // Target individual cards and components, NEVER entire sections or hero
  const targets = document.querySelectorAll(
    '.service-card, .project-card, .value-card, .process-card, .contact-card, .trustitem, .faq-item'
  );

  targets.forEach((el, index) => {
    if (el.closest('header, nav, footer, .topbar, .hero')) return;
    el.classList.add('reveal');
    // Stagger items inside grids
    if (el.classList.contains('service-card') || el.classList.contains('project-card') || el.classList.contains('value-card')) {
      const delay = (index % 3) * 90;
      el.style.transitionDelay = `${delay}ms`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '50px 0px 0px 0px'
  });

  targets.forEach(el => {
    if (!el.closest('header, nav, footer, .topbar, .hero')) {
      observer.observe(el);
    }
  });
}

/* -------------------------------------------------------------
 * 5. Project Gallery Category Filtering
 * ------------------------------------------------------------- */
function initGalleryFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = '';
          // Re-trigger subtle reveal
          setTimeout(() => card.classList.add('is-visible'), 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}


/* -------------------------------------------------------------
 * 7. FAQ Accordion
 * ------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach(i => i.classList.remove('is-open'));
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

/* -------------------------------------------------------------
 * 8. Contact Consultation Form to WhatsApp
 * ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  // Disable native browser validation tooltips so custom accessible errors display near inputs
  form.noValidate = true;

  const nameInput = form.querySelector('[name="name"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const serviceSelect = form.querySelector('[name="service"]');
  const locationInput = form.querySelector('[name="location"]');
  const messageInput = form.querySelector('[name="message"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  function getOrCreateErrorEl(inputEl, id) {
    let errEl = document.getElementById(id);
    if (!errEl && inputEl && inputEl.parentNode) {
      errEl = document.createElement('div');
      errEl.id = id;
      errEl.className = 'field-error';
      errEl.setAttribute('role', 'alert');
      errEl.setAttribute('aria-live', 'polite');
      errEl.style.display = 'none';
      errEl.style.color = '#c0392b';
      errEl.style.fontSize = '0.82rem';
      errEl.style.marginTop = '6px';
      errEl.style.fontWeight = '500';
      inputEl.parentNode.appendChild(errEl);
      inputEl.setAttribute('aria-describedby', id);
    }
    return errEl;
  }

  const nameError = getOrCreateErrorEl(nameInput, 'nameError');
  const phoneError = getOrCreateErrorEl(phoneInput, 'phoneError');
  const serviceError = getOrCreateErrorEl(serviceSelect, 'serviceError');

  let statusEl = document.getElementById('formStatus');
  if (!statusEl && submitBtn && form) {
    statusEl = document.createElement('div');
    statusEl.id = 'formStatus';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.style.display = 'none';
    statusEl.style.marginBottom = '14px';
    statusEl.style.fontSize = '0.88rem';
    statusEl.style.padding = '10px 14px';
    statusEl.style.borderRadius = '4px';
    statusEl.style.background = '#F1ECE2';
    statusEl.style.border = '1px solid #B08D57';
    statusEl.style.color = '#4A3027';
    form.insertBefore(statusEl, submitBtn);
  }

  function showError(field, errorEl, enMsg, hiMsg) {
    if (!field || !errorEl) return;
    const isHindi = document.documentElement.lang === 'hi';
    errorEl.setAttribute('data-en', enMsg);
    errorEl.setAttribute('data-hi', hiMsg);
    errorEl.textContent = isHindi ? hiMsg : enMsg;
    errorEl.style.display = 'block';
    field.setAttribute('aria-invalid', 'true');
    field.style.borderColor = '#c0392b';
  }

  function clearError(field, errorEl) {
    if (!field || !errorEl) return;
    errorEl.removeAttribute('data-en');
    errorEl.removeAttribute('data-hi');
    errorEl.textContent = '';
    errorEl.style.display = 'none';
    field.removeAttribute('aria-invalid');
    field.style.borderColor = '';
  }

  function showStatus(htmlEn, htmlHi) {
    if (!statusEl) return;
    statusEl.dataset.statusEn = htmlEn;
    statusEl.dataset.statusHi = htmlHi;
    const isHindi = document.documentElement.lang === 'hi';
    statusEl.innerHTML = isHindi ? htmlHi : htmlEn;
    statusEl.style.display = 'block';
  }

  function clearStatus() {
    if (!statusEl) return;
    delete statusEl.dataset.statusEn;
    delete statusEl.dataset.statusHi;
    statusEl.innerHTML = '';
    statusEl.style.display = 'none';
  }

  // Update status message on language switch if active
  if (window.MutationObserver) {
    const langObserver = new MutationObserver(() => {
      if (statusEl && statusEl.style.display !== 'none' && statusEl.dataset.statusEn) {
        const isHindi = document.documentElement.lang === 'hi';
        statusEl.innerHTML = isHindi ? statusEl.dataset.statusHi : statusEl.dataset.statusEn;
      }
    });
    langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  function validateIndianPhone(rawValue) {
    const trimmed = (rawValue || '').trim();
    if (!trimmed) {
      return {
        isValid: false,
        reason: 'EMPTY',
        en: 'Please enter your phone number.',
        hi: 'कृपया अपना फोन नंबर दर्ज करें।'
      };
    }

    // Reject alphabetic characters
    if (/[a-zA-Z]/.test(trimmed)) {
      return {
        isValid: false,
        reason: 'LETTERS',
        en: 'Phone number cannot contain letters. Please enter a valid Indian mobile number.',
        hi: 'फोन नंबर में अक्षर नहीं हो सकते। कृपया मान्य भारतीय मोबाइल नंबर दर्ज करें।'
      };
    }

    // Allow only digits, optional leading '+', spaces, hyphens, and optional parentheses
    if (!/^\+?[\d\s\-()]+$/.test(trimmed)) {
      return {
        isValid: false,
        reason: 'INVALID_CHARS',
        en: 'Please enter a valid 10-digit Indian mobile number.',
        hi: 'कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें।'
      };
    }

    // Remove spaces, hyphens, parentheses
    let digits = trimmed.replace(/[\s\-()]/g, '');

    // Strip country code (+91 or 91) or leading zero
    if (digits.startsWith('+91')) {
      digits = digits.slice(3);
    } else if (digits.startsWith('91') && digits.length === 12) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0') && digits.length === 11) {
      digits = digits.slice(1);
    }

    // Must be exactly 10 digits and start with 6, 7, 8, or 9
    if (!/^[6-9]\d{9}$/.test(digits)) {
      return {
        isValid: false,
        reason: 'INVALID_INDIAN_MOBILE',
        en: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
        hi: 'कृपया 6, 7, 8 या 9 से शुरू होने वाला 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।'
      };
    }

    return {
      isValid: true,
      normalized: digits
    };
  }

  // Clear a field's error when the user corrects that field
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length > 0) {
        clearError(nameInput, nameError);
      }
      clearStatus();
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const phoneRes = validateIndianPhone(phoneInput.value);
      if (phoneRes.isValid) {
        clearError(phoneInput, phoneError);
      }
      clearStatus();
    });
  }

  if (serviceSelect) {
    const handleServiceChange = () => {
      if ((serviceSelect.value || '').trim().length > 0) {
        clearError(serviceSelect, serviceError);
      }
      clearStatus();
    };
    serviceSelect.addEventListener('change', handleServiceChange);
    serviceSelect.addEventListener('input', handleServiceChange);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearStatus();

    let isValid = true;
    let firstInvalidField = null;

    // 1. Name validation (required, trimmed, reject spaces only)
    const rawName = nameInput ? nameInput.value : '';
    const trimmedName = rawName.trim();
    if (!trimmedName) {
      isValid = false;
      showError(nameInput, nameError, 'Please enter your name.', 'कृपया अपना नाम दर्ज करें।');
      if (!firstInvalidField) firstInvalidField = nameInput;
    } else {
      clearError(nameInput, nameError);
    }

    // 2. Phone validation (required, 10-digit Indian mobile, starts with 6-9)
    const rawPhone = phoneInput ? phoneInput.value : '';
    const phoneRes = validateIndianPhone(rawPhone);
    if (!phoneRes.isValid) {
      isValid = false;
      showError(phoneInput, phoneError, phoneRes.en, phoneRes.hi);
      if (!firstInvalidField) firstInvalidField = phoneInput;
    } else {
      clearError(phoneInput, phoneError);
    }

    // 3. Service validation (required, reject placeholder)
    const rawService = serviceSelect ? serviceSelect.value : '';
    const trimmedService = (rawService || '').trim();
    if (!trimmedService) {
      isValid = false;
      showError(serviceSelect, serviceError, 'Please select a service of interest.', 'कृपया इच्छित सेवा का चयन करें।');
      if (!firstInvalidField) firstInvalidField = serviceSelect;
    } else {
      clearError(serviceSelect, serviceError);
    }

    // Prevent submission and focus first invalid field if validation fails
    if (!isValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    // 4. Optional fields with fallback (trimmed)
    const rawLocation = locationInput ? locationInput.value : '';
    const trimmedLocation = rawLocation.trim() || 'Bharuch';

    const rawMessage = messageInput ? messageInput.value : '';
    const trimmedMessage = rawMessage.trim();

    // 5. Build WhatsApp message and URL
    const text = `*New Interior Enquiry - DEV DECOR Web*\n\n*Name:* ${trimmedName}\n*Phone:* ${phoneRes.normalized}\n*Service Interested In:* ${trimmedService}\n*Location:* ${trimmedLocation}\n*Requirements:* ${trimmedMessage}`;
    const url = `https://wa.me/919712409158?text=${encodeURIComponent(text)}`;

    // 6. Open WhatsApp recipient in a new tab with graceful popup handling
    let openedWindow = null;
    try {
      openedWindow = window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      openedWindow = null;
    }

    const isBlocked = !openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined';
    if (isBlocked) {
      showStatus(
        'Pop-up was blocked. <a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:underline;font-weight:600;">Click here to open WhatsApp ↗</a>',
        'पॉपअप अवरुद्ध हो गया। <a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:underline;font-weight:600;">WhatsApp खोलने के लिए यहाँ क्लिक करें ↗</a>'
      );
    } else {
      showStatus(
        'Opening WhatsApp... If it did not open automatically, <a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:underline;font-weight:600;">click here ↗</a>.',
        'WhatsApp खोला जा रहा है... यदि यह स्वचालित रूप से नहीं खुला, तो <a href="' + url + '" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:underline;font-weight:600;">यहाँ क्लिक करें ↗</a>।'
      );
    }
  });
}

/* -------------------------------------------------------------
 * 9. Dynamic Copyright Year
 * ------------------------------------------------------------- */
function initDynamicYear() {
  const yearEls = document.querySelectorAll('.current-year, #year');
  const year = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = year;
  });
}

/* -------------------------------------------------------------
 * 10. Active Navigation Link Detection
 * ------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navlinks a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
