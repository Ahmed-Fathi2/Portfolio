/**
 * Ahmed Mohamed Fathi - Portfolio Scripts
 * Vanilla ES6+ JavaScript: Theme Management, CV Modal, Filterable Projects, Toast, Active Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initCvModal();
  initProjectFilters();
  initClipboardAndToast();
  initSmoothScroll();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';

  setTheme(savedTheme);

  function toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggle);
  if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggle);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio_theme', theme);

  const sunIcons = document.querySelectorAll('.theme-sun-icon');
  const moonIcons = document.querySelectorAll('.theme-moon-icon');

  if (theme === 'light') {
    sunIcons.forEach(icon => icon.classList.add('hidden'));
    moonIcons.forEach(icon => icon.classList.remove('hidden'));
  } else {
    sunIcons.forEach(icon => icon.classList.remove('hidden'));
    moonIcons.forEach(icon => icon.classList.add('hidden'));
  }
}

/* ==========================================================================
   2. Responsive Navigation & Mobile Menu
   ========================================================================== */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section observer for navbar links
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-cyan-400', 'font-semibold');
            link.classList.remove('text-slate-400');
          } else {
            link.classList.remove('text-cyan-400', 'font-semibold');
            link.classList.add('text-slate-400');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   3. Interactive CV Preview Modal
   ========================================================================== */
function initCvModal() {
  const openModalBtns = document.querySelectorAll('[data-open-cv-modal]');
  const closeModalBtns = document.querySelectorAll('[data-close-cv-modal]');
  const cvModal = document.getElementById('cv-modal');
  const cvIframe = document.getElementById('cv-iframe');
  const viewToggleBtn = document.getElementById('cv-view-toggle');

  let currentView = 'pdf'; // 'pdf' or 'html'

  function openCvModal() {
    if (!cvModal) return;
    cvModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Set default view to PDF
    if (cvIframe && !cvIframe.getAttribute('src')) {
      cvIframe.src = 'Ahmed_Mohamed_Fathi_CV.pdf#toolbar=1&navpanes=0';
    }
  }

  function closeCvModal() {
    if (!cvModal) return;
    cvModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCvModal();
  }));

  closeModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeCvModal();
  }));

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) closeCvModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal && cvModal.classList.contains('open')) {
      closeCvModal();
    }
  });

  // Switch between PDF and HTML CV render
  if (viewToggleBtn && cvIframe) {
    viewToggleBtn.addEventListener('click', () => {
      if (currentView === 'pdf') {
        currentView = 'html';
        cvIframe.src = 'cv.html';
        viewToggleBtn.textContent = 'Switch to PDF View';
      } else {
        currentView = 'pdf';
        cvIframe.src = 'Ahmed_Mohamed_Fathi_CV.pdf#toolbar=1&navpanes=0';
        viewToggleBtn.textContent = 'Switch to ATS HTML View';
      }
    });
  }
}

/* ==========================================================================
   4. Filterable Project Gallery
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('[data-project-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));
      btn.classList.add('active', 'bg-blue-600', 'text-white');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-project-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Copy to Clipboard & Toast Notifications
   ========================================================================== */
function initClipboardAndToast() {
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy-text');
      const label = btn.getAttribute('data-copy-label') || 'Copied to clipboard';

      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`✓ ${label}`);
        }).catch(() => {
          fallbackCopyText(text, label);
        });
      } else if (text) {
        fallbackCopyText(text, label);
      }
    });
  });

  function fallbackCopyText(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`✓ ${label}`);
    } catch (err) {
      showToast(`Contact: ${text}`);
    }
    document.body.removeChild(textArea);
  }

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* ==========================================================================
   6. Smooth Anchor Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
