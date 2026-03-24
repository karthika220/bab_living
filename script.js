/* ===================================
   BAB LIVING — SCRIPT.JS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- TOPBAR HIDE ON SCROLL ---- */
  const topbar = document.getElementById('topbar');
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('hero');
  const navLogo = document.querySelector('.nav-logo .logo-img');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    // Hide topbar after 60px scroll
    if (current > 60) {
      topbar.style.transform = 'translateY(-100%)';
      navbar.classList.add('topbar-hidden');
    } else {
      topbar.style.transform = 'translateY(0)';
      navbar.classList.remove('topbar-hidden');
    }

    // Add shadow to navbar when scrolled
    if (current > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Switch header theme after crossing hero section
    if (hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight - (navbar.offsetHeight + topbar.offsetHeight);
      const passedHero = current > heroBottom;
      topbar.classList.toggle('hero-passed', passedHero);
      navbar.classList.toggle('hero-passed', passedHero);
      if (navLogo) {
        const whiteLogo = navLogo.dataset.logoWhite;
        const blackLogo = navLogo.dataset.logoBlack;
        navLogo.src = passedHero && blackLogo ? blackLogo : (whiteLogo || navLogo.src);
      }
    }

    lastScroll = current;
  });

  /* ---- INTERSECTION OBSERVER (SCROLL REVEAL) ---- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- BRANDS CAROUSEL ---- */
  const brandsCarousel = document.getElementById('brandsCarousel');
  const brandCards = document.querySelectorAll('.brand-card');
  const brandPrev = document.getElementById('brandPrev');
  const brandNext = document.getElementById('brandNext');
  let brandIndex = 0;

  function updateBrandCarousel(dir) {
    const cardsPerView = window.innerWidth <= 768 ? 1 : 2;
    const maxIndex = Math.max(0, brandCards.length - cardsPerView);

    if (dir === 'next') {
      brandIndex = brandIndex >= maxIndex ? 0 : brandIndex + 1;
    } else {
      brandIndex = brandIndex <= 0 ? maxIndex : brandIndex - 1;
    }

    setBrandPosition();
  }

  function setBrandPosition() {
    if (!brandsCarousel || !brandCards.length) return;
    const gap = parseFloat(window.getComputedStyle(brandsCarousel).columnGap || window.getComputedStyle(brandsCarousel).gap || '0');
    const cardWidth = brandCards[0].getBoundingClientRect().width;
    const translateX = brandIndex * (cardWidth + gap);
    brandsCarousel.style.transform = `translateX(-${translateX}px)`;
  }

  window.addEventListener('resize', () => {
    const cardsPerView = window.innerWidth <= 768 ? 1 : 2;
    const maxIndex = Math.max(0, brandCards.length - cardsPerView);
    brandIndex = Math.min(brandIndex, maxIndex);
    setBrandPosition();
  });
  setBrandPosition();

  if (brandNext) brandNext.addEventListener('click', () => updateBrandCarousel('next'));
  if (brandPrev) brandPrev.addEventListener('click', () => updateBrandCarousel('prev'));
  let brandAuto = setInterval(() => updateBrandCarousel('next'), 4500);
  [brandPrev, brandNext].forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
      clearInterval(brandAuto);
      brandAuto = setInterval(() => updateBrandCarousel('next'), 4500);
    });
  });

  /* ---- TESTIMONIALS SLIDER ---- */
  const testiTrack = document.getElementById('testiTrack');
  const testiSlides = document.querySelectorAll('.testi-slide');
  const testiPrev = document.getElementById('testiPrev');
  const testiNext = document.getElementById('testiNext');
  let testiCurrent = 0;

  function goToTesti(idx) {
    testiCurrent = (idx + testiSlides.length) % testiSlides.length;
    testiTrack.style.transform = `translateX(-${testiCurrent * 100}%)`;
  }

  if (testiNext) testiNext.addEventListener('click', () => goToTesti(testiCurrent + 1));
  if (testiPrev) testiPrev.addEventListener('click', () => goToTesti(testiCurrent - 1));

  /* ---- BENEFIT ICON AUTO PREVIEW ---- */
  const benefitItems = document.querySelectorAll('.benefit-item');
  const benefitIcons = Array.from(benefitItems).map(item => ({
    item,
    icon: item.querySelector('.benefit-preview')
  })).filter(entry => entry.icon);

  let benefitActive = 0;
  let benefitAutoTimer = null;
  function setBenefitActive(index) {
    benefitIcons.forEach((entry, i) => {
      const defaultSrc = entry.icon.dataset.default;
      const previewSrc = entry.icon.dataset.preview;
      if (i === index) {
        if (previewSrc) entry.icon.src = previewSrc;
        entry.item.classList.add('is-active');
      } else {
        if (defaultSrc) entry.icon.src = defaultSrc;
        entry.item.classList.remove('is-active');
      }
    });
  }

  function startBenefitAuto() {
    if (benefitAutoTimer) clearInterval(benefitAutoTimer);
    benefitAutoTimer = setInterval(() => {
      benefitActive = (benefitActive + 1) % benefitIcons.length;
      setBenefitActive(benefitActive);
    }, 1800);
  }

  if (benefitIcons.length) {
    setBenefitActive(benefitActive);
    startBenefitAuto();
  }

  /* ---- FAQ ACCORDION ---- */
  window.toggleFaq = function(btn) {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));
    document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));

    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  };

  /* ---- FORM SUBMISSION ---- */
  window.submitForm = function() {
    const fname  = document.getElementById('fname')?.value.trim();
    const phone  = document.getElementById('phone')?.value.trim();
    const city   = document.getElementById('city')?.value;
    const space  = document.getElementById('space')?.value;
    const rooms  = document.getElementById('rooms')?.value;
    const budget = document.getElementById('budget')?.value;

    if (!fname || !phone || !city || !space || !rooms || !budget) {
      showToast('Please fill in all fields before submitting.', 'error');
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      return;
    }
    showToast('Thank you! We\'ll be in touch shortly.', 'success');
  };

  /* ---- TOAST NOTIFICATION ---- */
  function showToast(msg, type) {
    const existing = document.querySelector('.bab-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'bab-toast';
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 28px;
      background: ${type === 'success' ? '#1a1a1a' : '#c0392b'};
      color: #fff;
      padding: 14px 24px;
      font-family: 'Spline Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 6px 30px rgba(0,0,0,0.25);
      animation: toastIn 0.35s ease forwards;
      max-width: 320px;
      line-height: 1.5;
    `;
    document.body.appendChild(toast);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes toastIn {
        from { opacity:0; transform: translateY(16px); }
        to   { opacity:1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const topbarHeight = topbar ? topbar.offsetHeight : 0;
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const offset = topbarHeight + navHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- TRIGGER HERO REVEALS ON LOAD ---- */
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 180);
    });
  }, 300);

});
