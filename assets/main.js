/**
 * DEV DECOR — Main Interactive JavaScript
 * Handles:
 *  - English / Hindi Language Switcher
 *  - Scroll-Reveal Animations (IntersectionObserver)
 *  - Mobile Navigation Drawer
 *  - Sticky Header Enhancements
 *  - Project Gallery Category Filtering
 *  - Interactive Image Lightbox with WhatsApp Lead Generation
 *  - Contact Form to WhatsApp Integration
 *  - Dynamic Copyright Year
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initMobileNav();
  initStickyHeader();
  initScrollReveal();
  initGalleryFiltering();
  initLightbox();
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
 * 6. Interactive Image Lightbox
 * ------------------------------------------------------------- */
function initLightbox() {
  let modal = document.querySelector('.lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Project Photo View');
    modal.innerHTML = `
      <div class="lightbox-content">
        <button type="button" class="lightbox-close" aria-label="Close dialog">&times;</button>
        <div class="lightbox-image-wrap">
          <img src="" alt="" id="lightboxImg">
        </div>
        <div class="lightbox-details">
          <span class="eyebrow" id="lightboxCategory">CATEGORY</span>
          <h3 id="lightboxTitle">Project Title</h3>
          <p id="lightboxDesc">Project details and craftsmanship description.</p>
          <div class="lightbox-actions">
            <a href="#" target="_blank" rel="noopener" class="btn btn-whatsapp" id="lightboxWhatsappBtn">
              Enquire on WhatsApp ↗
            </a>
            <a href="tel:+919712409158" class="btn btn-outline" id="lightboxCallBtn">
              Call 9712409158
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const closeBtn = modal.querySelector('.lightbox-close');
  const lightboxImg = modal.querySelector('#lightboxImg');
  const lightboxCategory = modal.querySelector('#lightboxCategory');
  const lightboxTitle = modal.querySelector('#lightboxTitle');
  const lightboxDesc = modal.querySelector('#lightboxDesc');
  const lightboxWhatsappBtn = modal.querySelector('#lightboxWhatsappBtn');

  function openLightbox(card) {
    const img = card.querySelector('img');
    const titleEl = card.querySelector('.project-card-body h3');
    const descEl = card.querySelector('.project-card-body p');
    const badgeEl = card.querySelector('.project-badge');

    if (!img) return;

    const currentLang = document.documentElement.lang === 'hi' ? 'hi' : 'en';

    const titleText = titleEl ? (currentLang === 'hi' && titleEl.dataset.hi ? titleEl.dataset.hi : titleEl.textContent.trim()) : 'DEV DECOR Project';
    const descText = descEl ? (currentLang === 'hi' && descEl.dataset.hi ? descEl.dataset.hi : descEl.textContent.trim()) : '';
    const categoryText = badgeEl ? badgeEl.textContent.trim() : 'Interior Design';

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || titleText;
    lightboxCategory.textContent = categoryText;
    lightboxTitle.textContent = titleText;
    lightboxDesc.textContent = descText;

    // Prefill WhatsApp link with exact design title
    const encodedMsg = encodeURIComponent(`Hello DEV DECOR! I am interested in your project: "${titleText}" (${categoryText}). Could you share more details and estimated pricing?`);
    lightboxWhatsappBtn.href = `https://wa.me/919712409158?text=${encodedMsg}`;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeLightbox();
    }
  });

  // Attach click listener to project cards
  document.querySelectorAll('.project-card-media, .project-card-body h3').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const card = el.closest('.project-card');
      if (card) openLightbox(card);
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const service = form.querySelector('[name="service"]')?.value || '';
    const location = form.querySelector('[name="location"]')?.value || 'Bharuch';
    const message = form.querySelector('[name="message"]')?.value || '';

    const text = `*New Interior Enquiry - DEV DECOR Web*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Service Interested In:* ${service}\n*Location:* ${location}\n*Requirements:* ${message}`;
    const url = `https://wa.me/919712409158?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
