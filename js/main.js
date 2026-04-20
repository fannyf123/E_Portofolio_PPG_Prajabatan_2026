/* ============================================
   E-PORTFOLIO — MAIN JS
   Core interactions, nav, theme, scroll reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Loading Screen ----------
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1800);
  }

  // ---------- Scroll Progress Bar ----------
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // ---------- Typed Text Effect ----------
  const typedTextEl = document.getElementById('typedText');
  const phrases = [
    'Guru Teknik Manufaktur',
    'Peserta PPG Prajabatan 2026',
    'Pengajar Autodesk Inventor',
    'Pendidik yang Berdedikasi'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      typedTextEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typedTextEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typedTextEl) typeEffect();

  // ---------- Navbar Scroll ----------
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---------- Active Nav Link ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ---------- Hamburger ----------
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('open');
    });
  });

  // ---------- Dark / Light Mode Toggle ----------
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
  });

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Skill Bar Animation ----------
  const skillBars = document.querySelectorAll('.bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ---------- Portfolio Filter ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  const portfolioGridWrapper = document.getElementById('portfolioGridWrapper');
  const portfolioGridInner = document.getElementById('portfolioGridInner');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('active');
      
      filterBtns.forEach(b => b.classList.remove('active'));

      if (isActive) {
        // Toggle off (Collapse everything with animation)
        if (portfolioGridWrapper && portfolioGridInner) {
          portfolioGridWrapper.style.gridTemplateRows = '0fr';
          portfolioGridInner.style.opacity = '0';
          portfolioGridInner.style.marginTop = '-20px';
          // Kita tidak perlu display none pada cards, karena wrapper sudah hilang (tinggi 0).
        } else {
          // Fallback jika HTML wrapper tidak ada
          portfolioCards.forEach(card => card.style.display = 'none');
        }
      } else {
        // Toggle on (Expand with animation)
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        // Pertama siapkan card mana yang tampil sebelum expand
        portfolioCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.5s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });

        // Buka wrapper dengan animasi
        if (portfolioGridWrapper && portfolioGridInner) {
          portfolioGridWrapper.style.gridTemplateRows = '1fr';
          portfolioGridInner.style.opacity = '1';
          portfolioGridInner.style.marginTop = '0';
        }
      }
    });
  });

  // ---------- Back to Top ----------
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Contact Form ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formSuccess = document.getElementById('formSuccess');
      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = '⏳ Mengirim...';
      btn.disabled = true;
      setTimeout(() => {
        btn.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
        setTimeout(() => {
          btn.style.display = '';
          btn.textContent = 'Kirim Pesan 🚀';
          btn.disabled = false;
          if (formSuccess) formSuccess.style.display = 'none';
          contactForm.reset();
        }, 3000);
      }, 1000);
    });
  }

  // ---------- Smooth anchor scrolling ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Count-up Animation ----------
  const statNumbers = document.querySelectorAll('.about-stat .number');

  function countUp(el, target, suffix) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const text = entry.target.textContent;
        const num = parseInt(text);
        const suffix = text.includes('+') ? '+' : '';
        countUp(entry.target, num, suffix);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => countObserver.observe(el));

  // ---------- Portfolio Siklus Tabs ----------
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      portfolioCards.forEach(card => {
        const siklus = card.getAttribute('data-siklus') || 'siklus1';
        card.style.display = (siklus === tab) ? '' : 'none';
      });
    });
  });

  // ---------- Skills Tabs ----------
  const skillsTabBtns = document.querySelectorAll('.skills-tab-btn');
  skillsTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillsTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
      const target = document.getElementById('skills-' + btn.getAttribute('data-skills-tab'));
      if (target) target.classList.add('active');
    });
  });

  // ---------- Accordion ----------
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const isOpen = header.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-header').forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        h.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        header.setAttribute('aria-expanded', 'true');
        header.nextElementSibling.classList.add('open');
      }
    });
  });

  // ---------- Pillar Progress Animation ----------
  const pillarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.pillar-progress-fill');
        if (fill) {
          const styleAttr = fill.getAttribute('style') || '';
          const match = styleAttr.match(/--progress:\s*([^;"]+)/);
          const width = match ? match[1].trim() : '80%';
          fill.style.width = width;
        }
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.pillar-card').forEach(card => pillarObserver.observe(card));

  // ---------- Gallery Lightbox ----------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentGalleryIdx = 0;

  function openLightbox(idx) {
    currentGalleryIdx = idx;
    const item = galleryItems[idx];
    lightboxImg.src = item.getAttribute('data-src') || item.querySelector('img').src;
    lightboxCaption.textContent = item.getAttribute('data-caption') || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIdx = (currentGalleryIdx - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(currentGalleryIdx);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIdx = (currentGalleryIdx + 1) % galleryItems.length;
      openLightbox(currentGalleryIdx);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

}); // End DOMContentLoaded

// Fade-in keyframe (used by filter)
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
