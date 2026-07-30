// Mobile hamburger toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Close menu when a link is clicked (mobile)
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

// Shrink navbar on scroll
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });
}

// Active nav link via IntersectionObserver
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a[data-nav]");

if (sections.length && navAnchors.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach((a) =>
            a.classList.toggle("active", a.dataset.nav === id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => navObserver.observe(s));
}

// Scroll reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ========================================================
   Smooth Fluid Typing Animation
   ======================================================== */
const phrases = ["SOFTWARE DEVELOPER", "JAVA DEVELOPER", "BACKEND ENGINEER"];
const typedEl = document.querySelector(".typed-text");

if (typedEl) {
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIdx);
      charIdx++;
      if (charIdx > current.length) {
        deleting = true;
        setTimeout(typeLoop, 750);
        return;
      }
      setTimeout(typeLoop, 55);
    } else {
      typedEl.textContent = current.slice(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeLoop, 180);
        return;
      }
      setTimeout(typeLoop, 30);
    }
  }
  typeLoop();
}

/* ========================================================
   High-Performance 60FPS Particle Mesh Canvas
   ======================================================== */
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d", { alpha: true });
  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 160 };

  const particleColors = [
    "rgba(99, 102, 241, ",   // Indigo
    "rgba(168, 85, 247, ",  // Purple
    "rgba(45, 212, 191, ",   // Teal
    "rgba(251, 191, 36, "   // Amber
  ];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 1;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.colorPrefix = particleColors[Math.floor(Math.random() * particleColors.length)];
      this.alpha = Math.random() * 0.35 + 0.25;
      this.pulseSpeed = Math.random() * 0.002 + 0.001;
    }

    update(time) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        if (Math.abs(dx) < mouse.radius && Math.abs(dy) < mouse.radius) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.2;
            this.y -= Math.sin(angle) * force * 1.2;
          }
        }
      }

      this.currentAlpha = this.alpha + Math.sin(time * this.pulseSpeed) * 0.1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorPrefix + Math.max(0.1, Math.min(0.6, this.currentAlpha)) + ")";
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 60);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 120;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
    ctx.lineWidth = 0.75;

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;

        if (Math.abs(dx) < maxDist && Math.abs(dy) < maxDist) {
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDist * maxDist) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
    }
    ctx.stroke();

    // Mouse line connections
    if (mouse.x !== null && mouse.y !== null) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(99, 102, 241, 0.25)";
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        if (Math.abs(dx) < mouse.radius && Math.abs(dy) < mouse.radius) {
          if (dx * dx + dy * dy < mouse.radius * mouse.radius) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
          }
        }
      }
      ctx.stroke();
    }
  }

  function animate(timestamp) {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(timestamp);
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  requestAnimationFrame(animate);
}

/* ========================================================
   Email Helper: Copies Email to Clipboard & Shows Toast
   ======================================================== */
document.querySelectorAll('a[href*="praveen19k12@gmail.com"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("praveen19k12@gmail.com").then(() => {
        showToast("📋 Copied email: praveen19k12@gmail.com");
      }).catch(() => {});
    }
  });
});

function showToast(message) {
  let toast = document.querySelector(".custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "custom-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
