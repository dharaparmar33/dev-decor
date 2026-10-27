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
  initLightboxModal();
  initVideoModal();
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


/* -------------------------------------------------------------
 * 11. Project Lightbox Modal Dialog Controller
 * ------------------------------------------------------------- */
function initLightboxModal() {
  const modal = document.getElementById('imageLightboxModal');
  if (!modal) return;

  const dialog = modal.querySelector('.modal-dialog');
  const mainImg = document.getElementById('lightboxMainImg');
  const projectTitle = document.getElementById('lightboxProjectTitle');
  const projectCat = document.getElementById('lightboxProjectCat');
  const photoCounter = document.getElementById('photoCounter');
  const inquireBtn = document.getElementById('lightboxInquireBtn');
  const thumbsList = document.getElementById('modalThumbsList');
  const closeBtn = document.getElementById('closeLightboxBtn');
  const prevBtn = document.getElementById('prevPhotoBtn');
  const nextBtn = document.getElementById('nextPhotoBtn');

  let currentPhotos = [];
  let currentIndex = 0;
  let lastFocusedElement = null;

  function adaptDialogToImage() {
    if (!dialog || !mainImg) return;
    const nw = mainImg.naturalWidth;
    const nh = mainImg.naturalHeight;
    if (!nw || !nh) return;

    const ratio = nw / nh;
    const vh = window.innerHeight || 800;
    const vw = window.innerWidth || 1200;

    if (ratio < 0.85) {
      // Portrait image (e.g. entrance doors, wardrobes ~9:16 or 3:4)
      const maxImgH = Math.min(vh * 0.74, 740);
      const idealImgW = maxImgH * ratio;
      // Frame snugly: width fits rendered image + 32px padding, minimum 380px for caption readability
      const targetW = Math.max(380, Math.min(Math.round(idealImgW + 36), Math.round(vw * 0.94)));
      dialog.style.maxWidth = `${targetW}px`;
      dialog.classList.add('is-portrait');
      dialog.classList.remove('is-landscape');
    } else if (ratio > 1.25) {
      // Generous landscape image (e.g. living rooms, kitchens, tv units ~16:9 or 3:2)
      const maxImgH = Math.min(vh * 0.70, 680);
      const idealImgW = maxImgH * ratio;
      const targetW = Math.max(760, Math.min(Math.round(idealImgW + 40), Math.round(vw * 0.94), 1100));
      dialog.style.maxWidth = `${targetW}px`;
      dialog.classList.add('is-landscape');
      dialog.classList.remove('is-portrait');
    } else {
      // Near-square / standard image (0.85 - 1.25)
      const maxImgH = Math.min(vh * 0.70, 680);
      const idealImgW = maxImgH * ratio;
      const targetW = Math.max(520, Math.min(Math.round(idealImgW + 48), Math.round(vw * 0.94), 860));
      dialog.style.maxWidth = `${targetW}px`;
      dialog.classList.remove('is-portrait', 'is-landscape');
    }
  }

  function updateModalView() {
    if (!currentPhotos.length) return;
    const currentSrc = currentPhotos[currentIndex];
    mainImg.src = currentSrc;
    photoCounter.textContent = `${currentIndex + 1} / ${currentPhotos.length}`;

    if (mainImg.complete && mainImg.naturalWidth > 0) {
      adaptDialogToImage();
    } else {
      mainImg.onload = adaptDialogToImage;
    }

    // Hide or show nav buttons if single photo
    if (currentPhotos.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      photoCounter.style.display = 'none';
      thumbsList.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
      photoCounter.style.display = 'block';
      thumbsList.style.display = 'flex';
    }

    // Update active thumbnail
    const thumbBtns = thumbsList.querySelectorAll('.modal-thumb-btn');
    thumbBtns.forEach((btn, idx) => {
      btn.classList.toggle('is-active', idx === currentIndex);
      btn.setAttribute('aria-current', idx === currentIndex ? 'true' : 'false');
    });
  }

  function openLightbox(photos, startIndex, titleEn, titleHi, catEn, catHi) {
    currentPhotos = photos;
    currentIndex = startIndex || 0;
    lastFocusedElement = document.activeElement;

    const isHindi = document.documentElement.lang === 'hi';
    const displayTitle = isHindi && titleHi ? titleHi : titleEn;
    const displayCat = isHindi && catHi ? catHi : catEn;

    projectTitle.textContent = displayTitle;
    projectTitle.setAttribute('data-en', titleEn);
    projectTitle.setAttribute('data-hi', titleHi || titleEn);

    projectCat.textContent = displayCat;
    projectCat.setAttribute('data-en', catEn);
    projectCat.setAttribute('data-hi', catHi || catEn);

    // Build WhatsApp inquiry URL
    const waText = `Hello DEV DECOR! I am interested in your project: ${titleEn} (${catEn}). Could you please share more details and estimated pricing?`;
    inquireBtn.href = `https://wa.me/919712409158?text=${encodeURIComponent(waText)}`;

    // Render thumbnails
    thumbsList.innerHTML = '';
    if (currentPhotos.length > 1) {
      currentPhotos.forEach((src, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `modal-thumb-btn ${idx === currentIndex ? 'is-active' : ''}`;
        btn.setAttribute('aria-label', `View photo ${idx + 1}`);
        btn.innerHTML = `<img src="${src}" alt="Thumbnail ${idx + 1}" loading="lazy">`;
        btn.addEventListener('click', () => {
          currentIndex = idx;
          updateModalView();
        });
        thumbsList.appendChild(btn);
      });
    }

    updateModalView();
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    requestAnimationFrame(adaptDialogToImage);
  }

  function closeLightbox() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    mainImg.src = '';
    if (dialog) {
      dialog.style.maxWidth = '';
      dialog.classList.remove('is-portrait', 'is-landscape');
    }
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  window.addEventListener('resize', () => {
    if (modal.classList.contains('is-active')) {
      adaptDialogToImage();
    }
  });

  function prevPhoto() {
    if (currentPhotos.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    updateModalView();
  }

  function nextPhoto() {
    if (currentPhotos.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    updateModalView();
  }

  // Bind project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const media = card.querySelector('.project-card-media');
    if (!media) return;

    function handleCardClick() {
      const rawGallery = media.getAttribute('data-gallery');
      const img = media.querySelector('img');
      const photos = rawGallery ? rawGallery.split(',').map(s => s.trim()) : [img.getAttribute('src')];
      
      const titleEl = card.querySelector('.project-card-body h3');
      const badgeEl = card.querySelector('.project-badge');

      const titleEn = media.getAttribute('data-title-en') || (titleEl ? titleEl.getAttribute('data-en') || titleEl.textContent : 'DEV DECOR Project');
      const titleHi = media.getAttribute('data-title-hi') || (titleEl ? titleEl.getAttribute('data-hi') || titleEl.textContent : titleEn);
      const catEn = media.getAttribute('data-cat-en') || (badgeEl ? badgeEl.getAttribute('data-en') || badgeEl.textContent : 'Interior Design');
      const catHi = media.getAttribute('data-cat-hi') || (badgeEl ? badgeEl.getAttribute('data-hi') || badgeEl.textContent : catEn);

      openLightbox(photos, 0, titleEn, titleHi, catEn, catHi);
    }

    media.addEventListener('click', handleCardClick);
    media.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick();
      }
    });
  });

  // Modal navigation events
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', prevPhoto);
  nextBtn.addEventListener('click', nextPhoto);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevPhoto();
    } else if (e.key === 'ArrowRight') {
      nextPhoto();
    }
  });

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 45) {
      nextPhoto();
    } else if (touchEndX > touchStartX + 45) {
      prevPhoto();
    }
  }, { passive: true });
}

/* -------------------------------------------------------------
 * 12. 60-Second Walkthrough Video Modal Controller
 * ------------------------------------------------------------- */
function initVideoModal() {
  const modal = document.getElementById('walkthroughVideoModal');
  if (!modal) return;

  const player = document.getElementById('walkthroughVideoPlayer');
  const closeBtn = document.getElementById('closeVideoModalBtn');
  let lastFocusedElement = null;

  const triggers = document.querySelectorAll(
    '#openHeroWalkthrough, #playProjectsWalkthrough, #posterProjectsTrigger, .btn-open-walkthrough'
  );

  function openVideo() {
    lastFocusedElement = document.activeElement;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();

    if (player) {
      player.currentTime = 0;
      const playPromise = player.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented by browser policy; user can tap native controls
        });
      }
    }
  }

  function closeVideo() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  triggers.forEach(trig => {
    trig.addEventListener('click', openVideo);
    trig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVideo();
      }
    });
  });

  closeBtn.addEventListener('click', closeVideo);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideo();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-active')) return;
    if (e.key === 'Escape') {
      closeVideo();
    }
  });
}
