const slides = [...document.querySelectorAll(".hero-slide")];
const nextButton = document.querySelector(".ctrl-next");
const prevButton = document.querySelector(".ctrl-prev");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-menu");
const enquiryForm = document.querySelector("#enquiry-form");
let currentSlide = 0;
let timerId;

function revealSplash() {
  document.body.classList.add("is-loaded");
  sessionStorage.setItem("tresas-loaded", "true");
}

const splashScreen = document.querySelector("#splash-screen");

if (!splashScreen) {
  document.body.classList.add("is-loaded-immediate", "is-loaded");
} else if (sessionStorage.getItem("tresas-loaded")) {
  document.body.classList.add("is-loaded-immediate", "is-loaded");
} else {
  window.setTimeout(revealSplash, 3000);
}

function showSlide(index) {
  if (slides.length === 0) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSlide);
  });
}

function startSlider() {
  if (slides.length === 0) return;
  clearInterval(timerId);
  timerId = setInterval(() => showSlide(currentSlide + 1), 6000);
}

nextButton?.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  startSlider();
});

prevButton?.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  startSlider();
});

menuButton?.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

menu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menu.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

enquiryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const note = enquiryForm.querySelector(".form-note");
  if (note) {
    note.textContent = "Thank you. The school office will follow up on your enquiry.";
  }
  enquiryForm.reset();
});

startSlider();

// Counter Animation Logic
function animateCounters(elements) {
  const duration = 2000; // 2 seconds

  elements.forEach(counter => {
    if (counter.classList.contains('counted')) return;
    
    const targetValue = parseFloat(counter.getAttribute("data-target"));
    if (isNaN(targetValue)) return;

    counter.classList.add('counted');
    const suffix = counter.getAttribute("data-suffix") || (counter.getAttribute("data-plus") === "true" ? "+" : "");
    const decimals = parseInt(counter.getAttribute("data-decimals")) || 0;
    
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Power 4 Out easing
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = ease * targetValue;
      
      counter.innerText = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.innerText = targetValue.toFixed(decimals) + suffix;
      }
    };
    window.requestAnimationFrame(step);
  });
}

// Robust Observer for Counters and Animations
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Trigger Counters
      const counters = entry.target.querySelectorAll(".stat-number, .stat-num");
      if (counters.length > 0) {
        animateCounters(counters);
      }
      
      // Trigger Fade-up animations
      if (entry.target.classList.contains('fade-up')) {
        entry.target.classList.add('in');
      }
    }
  });
}, { threshold: 0.1 });

// Initialize Observers
document.querySelectorAll(".impact-section, .stats-section, .education, .welcome-section, .vision-section-v2, .fade-up").forEach(el => {
  scrollObserver.observe(el);
});

// Initialize Lucide icons on page load and after dynamic changes
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Call init once immediately
initIcons();

// Also call on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initIcons);

// Final fallback for icons
window.addEventListener('load', initIcons);

// Contact Form Handler
function handleContactSubmit() {
  const name = document.getElementById('f-name-v2')?.value.trim();
  const email = document.getElementById('f-email-v2')?.value.trim();
  const subject = document.getElementById('f-subject-v2')?.value;
  const msg = document.getElementById('f-msg-v2')?.value.trim();
  
  if (!name || !email || !subject || !msg) {
    alert('Please fill all required fields (*)');
    return;
  }
  
  const btn = document.querySelector('.btn-submit-v2');
  if (!btn) return;

  const originalText = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="check"></i> Message Sent!';
  initIcons();
  btn.style.backgroundColor = 'var(--green)';
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.backgroundColor = '';
    initIcons();
    
    // Reset form
    const inputs = ['f-name-v2', 'f-email-v2', 'f-phone-v2', 'f-subject-v2', 'f-msg-v2'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }, 3500);
}

// ── SIMPLE ADMISSION ENQUIRY HANDLER ──
function handleSimpleEnquiry(event) {
  event.preventDefault();
  
  const name = document.getElementById('student-name')?.value.trim();
  const email = document.getElementById('parent-email')?.value.trim();
  const phone = document.getElementById('parent-phone')?.value.trim();
  const grade = document.getElementById('grade-seeking')?.value;
  
  if (!name || !email || !phone || !grade) {
    alert('Please fill all required fields (*)');
    return;
  }
  
  const btn = document.querySelector('.btn-submit-simple');
  if (!btn) return;

  const originalText = btn.innerHTML;
  btn.innerHTML = '<i data-lucide="check"></i> Enquiry Submitted!';
  btn.disabled = true;
  initIcons();
  btn.style.backgroundColor = 'var(--navy)';
  btn.style.color = '#fff';
  
  // Simulation of success
  setTimeout(() => {
    alert('Thank you! Your admission enquiry has been received. Our team will contact you soon.');
    
    // Reset button
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.style.backgroundColor = '';
    btn.style.color = '';
    initIcons();
    
    // Reset form
    document.getElementById('simple-enquiry-form').reset();
  }, 1500);
}

// Mobile UX: Hide floating buttons when typing to avoid overlapping form fields
const floatingButtons = document.querySelectorAll('.float-whatsapp, .float-admission');
const formInputs = document.querySelectorAll('input, textarea, select');

formInputs.forEach(input => {
  input.addEventListener('focus', () => {
    if (window.innerWidth <= 768) {
      floatingButtons.forEach(btn => btn.classList.add('floats-hidden'));
    }
  });
  input.addEventListener('blur', () => {
    floatingButtons.forEach(btn => btn.classList.remove('floats-hidden'));
  });
});
