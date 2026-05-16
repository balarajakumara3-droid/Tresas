const slides = [...document.querySelectorAll(".hero-slide")];
const nextButton = document.querySelector(".ctrl-next");
const prevButton = document.querySelector(".ctrl-prev");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-menu");
const enquiryForm = document.querySelector("#enquiry-form");
let currentSlide = 0;
let timerId;

function finishLoading() {
  // Ensure minimum 3 seconds for the cinematic animation to finish
  window.setTimeout(() => {
    document.body.classList.add("is-loaded");
    sessionStorage.setItem("tresas-loaded", "true");
  }, 650);
}

// Check if already loaded in this session
if (sessionStorage.getItem("tresas-loaded")) {
  document.body.classList.add("is-loaded-immediate");
  document.body.classList.add("is-loaded");
} else {
  // Standard load handling
  window.addEventListener("load", finishLoading);
  
  // Fallback in case load event takes too long
  window.setTimeout(finishLoading, 5000);
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
  timerId = setInterval(() => showSlide(currentSlide + 1), 5000);
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
  }, 650);
}

// ── MULTI-STEP INTEGRATED FORM ──
let currentEnquiryStep = 1;

function nextStep() {
  if (currentEnquiryStep === 1) {
    const fname = document.getElementById('fname')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const grade = document.getElementById('grade')?.value;
    const program = document.getElementById('program')?.value;
    
    if (!fname || !email || !phone || !grade || !program) {
      alert('Please fill all required fields (*)');
      return;
    }
  }

  if (currentEnquiryStep === 3) return;

  // Update UI
  document.getElementById('step' + currentEnquiryStep).style.display = 'none';
  document.getElementById('step' + currentEnquiryStep + '-tab').classList.remove('active');
  document.getElementById('step' + currentEnquiryStep + '-tab').classList.add('done');
  
  currentEnquiryStep++;
  
  document.getElementById('step' + currentEnquiryStep).style.display = 'flex';
  document.getElementById('step' + currentEnquiryStep + '-tab').classList.add('active');

  // Populate Summary
  if (currentEnquiryStep === 3) {
    document.getElementById('confirm-name').textContent = 
      document.getElementById('fname').value + ' ' + document.getElementById('lname').value;
    document.getElementById('confirm-email').textContent = document.getElementById('email').value;
    document.getElementById('confirm-phone').textContent = document.getElementById('phone').value;
    document.getElementById('confirm-grade').textContent = document.getElementById('grade').value;
    document.getElementById('confirm-program').textContent = document.getElementById('program').value;
  }
  
  initIcons();
}

function prevStep() {
  document.getElementById('step' + currentEnquiryStep).style.display = 'none';
  document.getElementById('step' + currentEnquiryStep + '-tab').classList.remove('active');
  
  currentEnquiryStep--;
  
  document.getElementById('step' + currentEnquiryStep).style.display = 'flex';
  document.getElementById('step' + currentEnquiryStep + '-tab').classList.remove('done');
  document.getElementById('step' + currentEnquiryStep + '-tab').classList.add('active');
  
  initIcons();
}

function submitEnquiry() {
  const btn = document.querySelector('.btn-submit-v4');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '<i data-lucide="check"></i> Enquiry Submitted!';
  initIcons();
  btn.style.backgroundColor = 'var(--navy)';
  
  // Show global toast if needed or alert
  alert('Thank you! Your enquiry for the Integrated Program has been received.');

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.backgroundColor = '';
    initIcons();
    
    // Reset to Step 1
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step3-tab').classList.remove('active', 'done');
    document.getElementById('step2-tab').classList.remove('active', 'done');
    document.getElementById('step1-tab').classList.remove('done');
    document.getElementById('step1-tab').classList.add('active');
    document.getElementById('step1').style.display = 'flex';
    
    // Clear inputs
    const ids = ['fname', 'lname', 'email', 'phone', 'grade', 'program', 'msg', 'parent-name', 'parent-phone'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    currentEnquiryStep = 1;
    initIcons();
  }, 650);
}

// Mobile UX: Hide floating buttons when typing to avoid overlapping form fields
const floatingButtons = document.querySelectorAll('.float-whatsapp, .float-admission');
const inputs = document.querySelectorAll('input, textarea, select');

inputs.forEach(input => {
  input.addEventListener('focus', () => {
    if (window.innerWidth <= 768) {
      floatingButtons.forEach(btn => btn.classList.add('floats-hidden'));
    }
  });
  input.addEventListener('blur', () => {
    floatingButtons.forEach(btn => btn.classList.remove('floats-hidden'));
  });
});
