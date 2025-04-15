// js/main.js

document.addEventListener('DOMContentLoaded', function() {
  const header             = document.querySelector('.header');
  const mobileMenuToggle   = document.querySelector('.mobile-menu-toggle');
  const navMenu            = document.querySelector('.nav-menu');
  const backToTopButton    = document.querySelector('.back-to-top');
  const contactForm        = document.getElementById('contactForm');
  const sections           = document.querySelectorAll('section');
  const fadeElements       = document.querySelectorAll('.fade-in');
  const staggerElements    = document.querySelectorAll('.stagger-fade-in');
  const revealElements     = document.querySelectorAll('.reveal');
  const preloader          = document.querySelector('.preloader');
  const themeToggleBtn     = document.getElementById('themeToggleBtn');

  // EmailJS Initialization
  emailjs.init("YVc6ZlFBWRHkV2ue6");  // your public key
  const SERVICE_ID  = 'service_8txatrv';
  const TEMPLATE_ID = 'template_2x5s3p4';

  // Preloader
  window.addEventListener('load', function() {
    setTimeout(function() {
      preloader.classList.add('hidden');
    }, 500);
  });

  // Theme Toggle
  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
    themeToggleBtn.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem(
        'theme',
        document.body.classList.contains('dark-mode') ? 'dark' : 'light'
      );
    });
  }

  // Scroll‑progress bar
  const scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  document.body.appendChild(scrollProgress);
  window.addEventListener('scroll', function() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled     = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
  });

  // Mobile Menu Toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      if (navMenu.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        window.scrollTo({ top: targetEl.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  // Header & Back‑to‑Top behavior
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    if (backToTopButton) {
      if (window.scrollY > 500) backToTopButton.classList.add('visible');
      else backToTopButton.classList.remove('visible');
    }
    handleScrollAnimations();
  });

  if (backToTopButton) {
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll‑triggered animations
  function handleScrollAnimations() {
    fadeElements.forEach(el    => { if (isElementInViewport(el))    el.classList.add('visible'); });
    staggerElements.forEach(el => { if (isElementInViewport(el))    el.classList.add('visible'); });
    revealElements.forEach(el  => { if (isElementInViewport(el))    el.classList.add('active'); });
    sections.forEach(sec       => { if (isElementInViewport(sec, 0.3)) sec.classList.add('section-visible'); });
    document.querySelectorAll('.skill-progress').forEach(bar => {
      if (isElementInViewport(bar.parentElement)) {
        bar.style.width = bar.getAttribute('data-percentage') + '%';
      }
    });
  }

  function isElementInViewport(el, offset = 0.2) {
    const rect         = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight * (1 - offset) && rect.bottom >= windowHeight * offset;
  }

  // Contact form submission
  if (contactForm) {
    const formStatus   = document.getElementById('formStatus');
    const submitButton = document.getElementById('submitButton');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formStatus.textContent = '';
      submitButton.disabled = true;
      submitButton.classList.add('loading');
      formStatus.textContent = 'Sending…';

      // Match your template placeholders exactly:
      const templateParams = {
        name:    document.getElementById('name').value.trim(),    // {{name}}
        email:   document.getElementById('email').value.trim(),   // {{email}}
        subject: document.getElementById('subject').value.trim(), // {{subject}}
        message: document.getElementById('message').value.trim()  // {{message}}
      };

      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(() => {
          formStatus.textContent = 'Message sent successfully!';
          contactForm.reset();
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          formStatus.textContent = 'Failed to send. Please try again later.';
        })
        .finally(() => {
          submitButton.disabled = false;
          submitButton.classList.remove('loading');
        });
    });
  }

  // Project card hover effect
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hover'));
    card.addEventListener('mouseleave', () => card.classList.remove('hover'));
  });

  // Hero title typewriter effect
  const heroTitleEl = document.querySelector('.hero-title .text-shimmer');
  if (heroTitleEl) {
    const fullText = heroTitleEl.textContent;
    heroTitleEl.textContent = '';
    let i = 0;
    const typeWriter = () => {
      if (i < fullText.length) {
        heroTitleEl.innerHTML += fullText.charAt(i++);
        setTimeout(typeWriter, 100);
      } else {
        heroTitleEl.classList.add('custom-cursor');
      }
    };
    setTimeout(typeWriter, 1000);
  }

  // Lightbox for images
  const lightbox       = document.createElement('div');
  lightbox.className   = 'lightbox';
  const lightboxImg    = document.createElement('img');
  lightboxImg.className = 'lightbox-content';
  const lightboxClose  = document.createElement('span');
  lightboxClose.className = 'lightbox-close';
  lightboxClose.innerHTML = '&times;';
  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(lightboxClose);
  document.body.appendChild(lightbox);

  document.querySelectorAll('.project-image img, .case-study-image img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Custom cursor (desktop only)
  if (!('ontouchstart' in window)) {
    const cursorDot     = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className     = 'custom-cursor-dot';
    cursorOutline.className = 'custom-cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    document.addEventListener('mousemove', e => {
      cursorDot.style.transform     = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorOutline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.querySelectorAll('a, button, input, textarea, .project-card, .social-link')
      .forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorOutline.style.width       = '60px';
          cursorOutline.style.height      = '60px';
          cursorOutline.style.borderColor = 'var(--color-accent)';
        });
        el.addEventListener('mouseleave', () => {
          cursorOutline.style.width       = '40px';
          cursorOutline.style.height      = '40px';
          cursorOutline.style.borderColor = 'var(--color-accent)';
        });
      });
  }

  // Social link tooltips
  document.querySelectorAll('.social-link').forEach(link => {
    const icon = link.querySelector('i');
    let tooltip = '';
    if (icon.classList.contains('fa-linkedin-in')) tooltip = 'LinkedIn';
    if (icon.classList.contains('fa-github'))       tooltip = 'GitHub';
    link.classList.add('tooltip');
    link.setAttribute('data-tooltip', tooltip);
  });

  // Initial scroll animations on load
  setTimeout(() => {
    handleScrollAnimations();
    const heroSection = document.querySelector('.hero');
    if (heroSection) heroSection.classList.add('section-visible');
  }, 300);

}); // end DOMContentLoaded
