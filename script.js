document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HERO TYPING EFFECT
     ========================================================================== */
  const typingElement = document.getElementById('typing-text');
  const words = ["B.Tech IT Graduate.", "Cloud Enthusiast.", "AI Developer."];
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
  const tiltCards = document.querySelectorAll('.skills-card, .project-card, .cert-card, .hero-image-card, .contact-card');

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
     7. SCROLL REVEAL (INTERSECTION OBSERVER)
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
    '.skills-card, .project-card, .section-header, .about-text-col, .contact-card, .cert-card, .hero-image-card'
  );

  animTargets.forEach(target => {
    target.classList.add('reveal-ready');
    revealObserver.observe(target);
  });

  /* ==========================================================================
     8. SPOTLIGHT MOUSE-GLOW TRACKING
     ========================================================================== */
  const spotlightCards = document.querySelectorAll('.skills-card, .project-card, .cert-card, .hero-image-card, .contact-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     10. FLOATING ACCENT COLOR SWITCHER
     ========================================================================== */
  const themeSwitcher = document.getElementById('theme-switcher');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeOpts = document.querySelectorAll('.theme-opt');

  if (themeToggleBtn && themeMenu) {
    // Toggle Menu
    themeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (themeSwitcher && !themeSwitcher.contains(e.target)) {
        themeMenu.classList.remove('open');
      }
    });
  }

  const switchTheme = (themeName) => {
    // Remove previous themes
    document.body.classList.remove('theme-indigo', 'theme-emerald', 'theme-amber');
    
    // Add current theme
    document.body.classList.add(`theme-${themeName}`);

    // Set active option state
    themeOpts.forEach(opt => {
      opt.classList.remove('active');
      if (opt.getAttribute('data-theme') === themeName) {
        opt.classList.add('active');
      }
    });

    // Store in localStorage
    localStorage.setItem('portfolio-theme', themeName);
  };

  themeOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedTheme = opt.getAttribute('data-theme');
      switchTheme(selectedTheme);
    });
  });

  // Load Saved Theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'indigo';
  switchTheme(savedTheme);
});
