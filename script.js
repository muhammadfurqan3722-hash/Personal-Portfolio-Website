/*
   Muhammad Furqan Portfolio - Core Interactive Logic
   Features: Loader, Custom Cursor, Canvas Particle System, Typewriter, Scroll Reveal, 3D Tilt, Stats Counter, Contact Handler
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. PRELOADER ANIMATION
  // ==========================================
  const preloader = document.getElementById('preloader');
  const barFill = document.querySelector('.loader-bar-fill');
  const percentText = document.querySelector('.loader-percentage');
  
  let percentage = 0;
  const loadInterval = setInterval(() => {
    percentage += Math.floor(Math.random() * 8) + 4;
    if (percentage >= 100) {
      percentage = 100;
      clearInterval(loadInterval);
      
      // Animate preloader fadeout
      setTimeout(() => {
        preloader.style.opacity = 0;
        preloader.style.visibility = 'hidden';
        
        // Trigger skill bar and counter animation once page is loaded
        setTimeout(() => {
          initScrollObserver();
        }, 300);
      }, 500);
    }
    barFill.style.width = `${percentage}%`;
    percentText.textContent = `${percentage}%`;
  }, 40);


  // ==========================================
  // 2. CUSTOM CURSOR & MOUSE FOLLOW LIGHT
  // ==========================================
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorOutline = document.querySelector('.custom-cursor-outline');
  const mouseGradient = document.getElementById('mouse-gradient');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;
  
  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position cursor dot instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    
    // Position background light gradient instantly
    mouseGradient.style.left = `${mouseX}px`;
    mouseGradient.style.top = `${mouseY}px`;
  });

  // Smooth custom cursor outline interpolation (lerp)
  function animateCursorOutline() {
    const lerpFactor = 0.15;
    outlineX += (mouseX - outlineX) * lerpFactor;
    outlineY += (mouseY - outlineY) * lerpFactor;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateCursorOutline);
  }
  requestAnimationFrame(animateCursorOutline);

  // Add Hover Class to Cursor
  const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .project-card, .why-card, .contact-method-card, .hamburger, .timeline-item');
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      document.body.classList.add('hover-state');
    });
    elem.addEventListener('mouseleave', () => {
      document.body.classList.remove('hover-state');
    });
  });

  // Mouse Click Event Cursors
  window.addEventListener('mousedown', () => {
    document.body.classList.add('click-state');
  });
  window.addEventListener('mouseup', () => {
    document.body.classList.remove('click-state');
  });


  // ==========================================
  // 3. CANVAS PARTICLE SYSTEM (BACKGROUND)
  // ==========================================
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  let connectionDistance = 120;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.25)' : 'rgba(168, 85, 247, 0.25)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Mouse repulsion
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  // Create particle pool
  const maxParticles = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - (dist / connectionDistance)) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          // Gradient line
          const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
          grad.addColorStop(0, `rgba(99, 102, 241, ${alpha})`);
          grad.addColorStop(1, `rgba(168, 85, 247, ${alpha})`);
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  requestAnimationFrame(drawParticles);


  // ==========================================
  // 4. HERO SECTION TYPEWRITER ANIMATION
  // ==========================================
  const textTarget = document.querySelector('.hero-title');
  const words = ['Computer Science Graduate', 'Software Developer', 'Website Developer'];
  
  let wordIndex = 0;
  let textIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeText() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Erasing
      textTarget.textContent = currentWord.substring(0, textIndex - 1);
      textIndex--;
      typingSpeed = 50;
    } else {
      // Typing
      textTarget.textContent = currentWord.substring(0, textIndex + 1);
      textIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && textIndex === currentWord.length) {
      // Pause at full word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && textIndex === 0) {
      // Move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(typeText, typingSpeed);
  }
  // Start the typewriter loop
  setTimeout(typeText, 1200);


  // ==========================================
  // 5. STICKY NAVBAR & SCROLL PROGRESS INDICATOR
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    // Scroll progress bar calculation
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolledPercent = (windowScroll / height) * 100;
    scrollProgressBar.style.width = `${scrolledPercent}%`;

    // Sticky nav state
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (window.scrollY > 600) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });


  // ==========================================
  // 6. SCROLL REVEAL & NAVIGATION HIGHLIGHTS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-hidden');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  function initScrollObserver() {
    // Reveal On Scroll Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          
          // Animate skill bars specifically if it is inside the skills section
          if (entry.target.closest('#skills')) {
            animateSkillBars();
          }
          // Animate counters if it is inside the about section
          if (entry.target.closest('#about')) {
            animateCounters();
          }
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Active Section Observer for Nav Menu Links
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.4
    });

    sections.forEach(sec => sectionObserver.observe(sec));
  }


  // ==========================================
  // 7. ANIMATED SKILL BARS
  // ==========================================
  let skillsAnimated = false;
  function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;
    
    const skillFills = document.querySelectorAll('.skill-bar-fill');
    skillFills.forEach(fill => {
      const targetWidth = fill.getAttribute('data-percentage');
      fill.style.width = targetWidth;
    });
  }


  // ==========================================
  // 8. STATS COUNTER ANIMATION
  // ==========================================
  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    const counterElements = document.querySelectorAll('.counter');
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepValue = target / steps;
      let current = 0;
      let stepCount = 0;

      const counterInterval = setInterval(() => {
        current += stepValue;
        stepCount++;
        
        if (Number.isInteger(target)) {
          counter.textContent = Math.floor(current);
        } else {
          counter.textContent = current.toFixed(1);
        }

        if (stepCount >= steps) {
          clearInterval(counterInterval);
          counter.textContent = target;
        }
      }, duration / steps);
    });
  }


  // ==========================================
  // 9. 3D HOVER-TILT CARD EFFECT
  // ==========================================
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      
      // Calculate mouse coordinates relative to card center
      const mouseXRel = e.clientX - cardRect.left - cardWidth / 2;
      const mouseYRel = e.clientY - cardRect.top - cardHeight / 2;
      
      // Max rotation angles (degrees)
      const maxRotateX = 10;
      const maxRotateY = 10;
      
      // Calculate rotations
      const rotateX = (-mouseYRel / (cardHeight / 2)) * maxRotateX;
      const rotateY = (mouseXRel / (cardWidth / 2)) * maxRotateY;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });


  // ==========================================
  // 10. MOBILE HAMBURGER MENU TOGGLE
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const menuLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });


  // ==========================================
  // 11. CONTACT FORM ANIMATIONS & VALIDATION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const sendBtnText = document.querySelector('.btn-text');
  const sendBtnIcon = document.querySelector('.btn-icon');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous status
      formStatus.className = 'form-status';
      formStatus.style.display = 'none';

      // Basic Validation
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      // Send form data via Fetch API
      setButtonLoading(true);

      const endpoint = contactForm.getAttribute('action') || 'https://formspree.io/f/mvoywzjo';

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message
        })
      })
      .then(response => {
        setButtonLoading(false);
        if (response.ok) {
          showStatus('Message sent successfully! Muhammad Furqan will get back to you soon.', 'success');
          contactForm.reset();
        } else {
          response.json().then(data => {
            if (data && data.errors) {
              showStatus(data.errors.map(error => error.message).join(', '), 'error');
            } else {
              showStatus('Oops! There was a problem submitting your form.', 'error');
            }
          });
        }
      })
      .catch(error => {
        setButtonLoading(false);
        showStatus('Oops! There was a problem connecting to the server.', 'error');
      });
    });
  }

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setButtonLoading(isLoading) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (isLoading) {
      submitBtn.disabled = true;
      sendBtnText.textContent = 'Sending Message...';
      submitBtn.style.opacity = '0.8';
      // Loading SVG rotate icon swap
      sendBtnIcon.innerHTML = `
        <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;
    } else {
      submitBtn.disabled = false;
      sendBtnText.textContent = 'Send Message';
      submitBtn.style.opacity = '1';
      // Revert to paper-plane icon
      sendBtnIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      `;
    }
  }

});
