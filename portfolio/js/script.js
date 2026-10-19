/**
 * YOGESHWAR MURUGASAMY — PROFESSIONAL PORTFOLIO
 * Vanilla JavaScript ES6+
 * Author: Senior UI/UX Designer & Full-Stack Developer
 */

(function () {
  'use strict';

  // Constants & Config
  const EMAIL_ADDRESS = 'Yogeshroa23@gmail.com';
  const CV_FILE_PATH = 'assets/Yogeshwar_Murugasamy_CV.pdf';
  const SCROLL_THRESHOLD = 400;

  // DOM Elements Cache
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYearSpan = document.getElementById('current-year');
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const toastContainer = document.getElementById('toast-container');
  const cvDownloadBtns = document.querySelectorAll('.cv-download-btn');
  const cvModal = document.getElementById('cv-modal');
  const cvModalCloseBtns = document.querySelectorAll('.modal-close-trigger');

  /* --------------------------------------------------------------------------
     1. Dynamic Year
     -------------------------------------------------------------------------- */
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     2. Mobile Navigation Toggle & Accessibility
     -------------------------------------------------------------------------- */
  function openMobileMenu() {
    if (!hamburgerBtn || !mobileNavDrawer || !mobileNavBackdrop) return;
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.classList.add('open');
    mobileNavBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!hamburgerBtn || !mobileNavDrawer || !mobileNavBackdrop) return;
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.classList.remove('open');
    mobileNavBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu on Escape key press
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeCvModal();
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  /* --------------------------------------------------------------------------
     3. Active Navigation State with IntersectionObserver
     -------------------------------------------------------------------------- */
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + activeId) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* --------------------------------------------------------------------------
     4. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // If reduced motion is preferred or no IntersectionObserver, make all immediately visible
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --------------------------------------------------------------------------
     5. Back to Top Button
     -------------------------------------------------------------------------- */
  function handleScroll() {
    if (!backToTopBtn) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Toast Feedback System
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const checkIcon = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;

    toast.innerHTML = `${checkIcon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Trigger reveal transition
    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    // Auto dismiss after 3.8s
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3800);
  }

  /* --------------------------------------------------------------------------
     7. Copy Email with Fallback
     -------------------------------------------------------------------------- */
  function copyEmailToClipboard() {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(EMAIL_ADDRESS)
        .then(function () {
          showToast('Email address copied to clipboard!');
        })
        .catch(function () {
          fallbackCopyText(EMAIL_ADDRESS);
        });
    } else {
      fallbackCopyText(EMAIL_ADDRESS);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showToast('Email address copied to clipboard!');
      } else {
        showToast('Could not copy automatically. Email: ' + EMAIL_ADDRESS);
      }
    } catch (err) {
      showToast('Email: ' + EMAIL_ADDRESS);
    }

    document.body.removeChild(textArea);
  }

  copyEmailBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      copyEmailToClipboard();
    });
  });

  /* --------------------------------------------------------------------------
     8. CV Download Validation & Informative Modal
     -------------------------------------------------------------------------- */
  function openCvModal() {
    if (cvModal) {
      cvModal.classList.add('open');
      cvModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCvModal() {
    if (cvModal) {
      cvModal.classList.remove('open');
      cvModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  cvModalCloseBtns.forEach(function (btn) {
    btn.addEventListener('click', closeCvModal);
  });

  if (cvModal) {
    cvModal.addEventListener('click', function (e) {
      if (e.target === cvModal) {
        closeCvModal();
      }
    });
  }

  // Intercept CV download to check file availability cleanly
  cvDownloadBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // Check if file exists via HEAD request if running on a server,
      // or gracefully handle file:// opening
      if (window.location.protocol.startsWith('http')) {
        e.preventDefault();
        fetch(CV_FILE_PATH, { method: 'HEAD' })
          .then(function (response) {
            if (response.ok) {
              // File exists, proceed with standard download
              const link = document.createElement('a');
              link.href = CV_FILE_PATH;
              link.download = 'Yogeshwar_Murugasamy_CV.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              openCvModal();
            }
          })
          .catch(function () {
            openCvModal();
          });
      } else {
        // When opened directly via file://, check if link target can trigger or warn
        // We let the link try and also provide clear modal access
      }
    });
  });

})();
