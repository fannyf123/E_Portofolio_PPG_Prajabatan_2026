/* ============================================
   PARTICLE ANIMATION SYSTEM
   Enhanced with mouse interaction & click effects
   ============================================ */
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let ripples = [];
  let burstParticles = [];
  let animationId;
  let width, height;
  let mouseX = -1000, mouseY = -1000;

  const colors = [
    { r: 255, g: 107, b: 107 },
    { r: 46,  g: 196, b: 182 },
    { r: 155, g: 114, b: 207 },
    { r: 255, g: 179, b: 71  },
    { r: 86,  g: 204, b: 242 },
    { r: 107, g: 203, b: 119 },
    { r: 255, g: 111, b: 145 },
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function getParticleCount() {
    if (width < 768) return 35;
    if (width < 1024) return 50;
    return 70;
  }

  function createParticle(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      x: x !== undefined ? x : Math.random() * width,
      y: y !== undefined ? y : Math.random() * height,
      size: Math.random() * 5 + 1.5,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.4 - 0.15,
      color: color,
      alpha: isDark ? (Math.random() * 0.20 + 0.10) : (Math.random() * 0.30 + 0.15),
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      origSpeedX: 0,
      origSpeedY: 0,
    };
  }

  function initParticles() {
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
      const p = createParticle();
      p.origSpeedX = p.speedX;
      p.origSpeedY = p.speedY;
      particles.push(p);
    }
  }

  // --- Click Ripple Effect ---
  function createRipple(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    ripples.push({ x, y, radius: 0, maxRadius: 150 + Math.random() * 80, alpha: 0.4, color });
    ripples.push({ x, y, radius: 0, maxRadius: 80 + Math.random() * 60, alpha: 0.25, color: colors[Math.floor(Math.random() * colors.length)] });

    // Burst mini particles
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.3;
      const speed = 2 + Math.random() * 3;
      const bColor = colors[Math.floor(Math.random() * colors.length)];
      burstParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        alpha: 0.8,
        color: bColor,
        life: 1,
        decay: 0.015 + Math.random() * 0.015,
      });
    }
  }

  function drawRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 3;
      r.alpha -= 0.006;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, ${r.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function drawBurstParticles() {
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const b = burstParticles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.96;
      b.vy *= 0.96;
      b.life -= b.decay;
      b.alpha = b.life * 0.8;
      if (b.life <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.alpha})`;
      ctx.fill();

      // Trailing glow
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size * b.life * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.alpha * 0.15})`;
      ctx.fill();
    }
  }

  // --- Draw main particles with mouse repulsion ---
  function drawParticle(p) {
    const pulseFactor = Math.sin(p.pulse) * 0.3 + 0.7;
    const alpha = p.alpha * pulseFactor;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
    ctx.fill();

    if (p.size > 2.5) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.15})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    const connectionDistance = 120;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const maxAlpha = isDark ? 0.04 : 0.06;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * maxAlpha;
          const p = particles[i];
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const mouseRadius = 120;

    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius && dist > 0) {
        const force = (mouseRadius - dist) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * 2.5;
        p.y += Math.sin(angle) * force * 2.5;
      } else {
        // Gradually return to original speed
        p.speedX += (p.origSpeedX - p.speedX) * 0.01;
        p.speedY += (p.origSpeedY - p.speedY) * 0.01;
      }

      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      drawParticle(p);
    });

    drawConnections();
    drawRipples();
    drawBurstParticles();

    animationId = requestAnimationFrame(animate);
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  // Click ripple
  document.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
  });

  // Initialize
  resize();
  initParticles();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initParticles();
    }, 200);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();


/* ============================================
   STAGGERED SCROLL REVEAL
   Cards animate in one by one with delay
   ============================================ */
(function() {
  // Stagger children inside grids
  const grids = document.querySelectorAll('.portfolio-grid, .skills-grid, .cert-grid, .philosophy-pillars, .about-stats');

  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.reveal');
    cards.forEach((card, idx) => {
      card.style.transitionDelay = `${idx * 0.1}s`;
    });
  });

  // Parallax-lite for floating shapes on scroll
  const shapes = document.querySelector('.floating-shapes');
  if (shapes) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      shapes.style.transform = `translateY(${scrollY * 0.08}px)`;
    }, { passive: true });
  }

  // Counter animation for stat numbers
  const statNumbers = document.querySelectorAll('.about-stat .number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(\+?)$/);
    if (!match) return;
    const target = parseInt(match[1]);
    const suffix = match[2] || '';
    let current = 0;
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Tilt effect on hover for cards
  const tiltCards = document.querySelectorAll('.portfolio-card, .pillar-card, .skill-card, .cert-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
})();
