document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CUSTOM CURSOR TRACKING
     ========================================================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (cursorDot && cursorOutline) {
    // Only enable custom cursor if pointing device is fine (desktop)
    const isDesktop = window.matchMedia('(pointer: fine)').matches;

    if (isDesktop) {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';

      let mouseX = 0, mouseY = 0; // Mouse positions
      let dotX = 0, dotY = 0;     // Dot positions
      let outlineX = 0, outlineY = 0; // Outline positions

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for the dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      });

      // Smooth animation loop for the outline trailing effect
      const animateCursor = () => {
        // Linear interpolation (lerp) for smooth lag
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
      };
      requestAnimationFrame(animateCursor);

      // Mouse leaves/enters window
      document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
      });

      document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
      });

      // Add hover class on interactive elements
      const interactiveSelector = 'a, button, input, textarea, .filter-btn, .project-card, .social-icon';
      document.querySelectorAll(interactiveSelector).forEach(el => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
        });
      });
    }
  }

  /* ==========================================================================
     2. HERO TYPING EFFECT
     ========================================================================== */
  const typingElement = document.getElementById('typing-text');
  const words = ["B.Tech IT Student.", "Cloud Enthusiast.", "AI Developer."];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const type = () => {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Delete faster
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // Normal typing speed
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  };

  if (typingElement) {
    setTimeout(type, 1000);
  }

  /* ==========================================================================
     3. FLOATING HEADER SCROLL & NAV LINK ACTIVE STATES
     ========================================================================== */
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    // 1. Header background scroll class
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 2. Active nav link highlight based on scroll position
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150; // offset for nav header height
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Trigger once initially to set correct states on load
  handleScroll();

  /* ==========================================================================
     4. MOBILE NAV MENU TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close mobile nav when clicking a menu link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     5. PROJECT FILTERS
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Trigger slight fade-in animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ==========================================================================
     6. INTERACTIVE 3D TILT EFFECT
     ========================================================================== */
  const tiltCards = document.querySelectorAll('.skills-card, .project-card, .fact-card, .cert-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within element
      const y = e.clientY - rect.top;  // y coordinate within element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation strength (max 8 degrees)
      const rotateX = ((y / height) - 0.5) * -8;
      const rotateY = ((x / width) - 0.5) * 8;
      
      card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      // Smooth reset back to normal orientation
      card.style.transform = 'translateY(0px) rotateX(0deg) rotateY(0deg)';
    });
  });

  /* ==========================================================================
     7. CONTACT FORM VALIDATION & SUCCESS HANDLER
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');
  const successResetBtn = document.getElementById('btn-success-reset');

  if (contactForm && contactSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation (built-in HTML5 takes care of basic validity, but we can double check)
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (name && email && subject && message) {
        // Fake success trigger - hide form, show success state
        contactForm.style.display = 'none';
        contactSuccess.style.display = 'flex';
      }
    });

    if (successResetBtn) {
      successResetBtn.addEventListener('click', () => {
        // Reset form and return to input view
        contactForm.reset();
        contactSuccess.style.display = 'none';
        contactForm.style.display = 'flex';
      });
    }
  }

  /* ==========================================================================
     8. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  // Create intersection observer for fade-in scroll effects
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Unobserve once shown to prevent repeat animation overhead
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Target elements to animate on scroll
  const animTargets = document.querySelectorAll(
    '.skills-card, .project-card, .timeline-item, .section-header, .about-text-col, .about-timeline-col, .contact-info-col, .contact-form-col, .cert-card'
  );

  animTargets.forEach(target => {
    target.classList.add('reveal-ready');
    revealObserver.observe(target);
  });
});
