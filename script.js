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
  }, 3000);
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

// Counter Animation
function animateCounters(elements) {
  const duration = 2500; // 2.5 seconds for a premium feel

  elements.forEach(counter => {
    if (counter.classList.contains('counted')) return;
    counter.classList.add('counted');

    const target = parseFloat(counter.getAttribute("data-target"));
    if (isNaN(target)) return;

    const suffix = counter.getAttribute("data-suffix") || (counter.getAttribute("data-plus") === "true" ? "+" : "");
    const decimals = parseInt(counter.getAttribute("data-decimals")) || 0;
    
    let startTime = null;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother finish (easeOutExpo-ish)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = easeProgress * target;
      
      counter.innerText = (progress === 1 ? target : current).toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    requestAnimationFrame(updateCount);
  });
}

// Observer for Counters
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll(".stat-number, .stat-num");
      if (counters.length > 0) {
        animateCounters(counters);
        // We only unobserve if all counters in this section are animated
        statsObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.15 }); // Lower threshold for better reliability on mobile

document.querySelectorAll(".impact-section, .stats-section, .education, .welcome-section, .vision-section-v2").forEach(section => {
  statsObserver.observe(section);
});

if (window.lucide) {
  window.lucide.createIcons();
}

// Fade-up Animation Observer
const fadeObserverOptions = { threshold: 0.12 };
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      fadeObserver.unobserve(entry.target);
    }
  });
}, fadeObserverOptions);

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

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
  if (window.lucide) window.lucide.createIcons();
  btn.style.backgroundColor = 'var(--green)';
  
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.backgroundColor = '';
    if (window.lucide) window.lucide.createIcons();
    
    // Reset form
    const inputs = ['f-name-v2', 'f-email-v2', 'f-phone-v2', 'f-subject-v2', 'f-msg-v2'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }, 3000);
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
  
  if (window.lucide) window.lucide.createIcons();
}

function prevStep() {
  document.getElementById('step' + currentEnquiryStep).style.display = 'none';
  document.getElementById('step' + currentEnquiryStep + '-tab').classList.remove('active');
  
  currentEnquiryStep--;
  
  document.getElementById('step' + currentEnquiryStep).style.display = 'flex';
  document.getElementById('step' + currentEnquiryStep + '-tab').classList.remove('done');
  document.getElementById('step' + currentEnquiryStep + '-tab').classList.add('active');
  
  if (window.lucide) window.lucide.createIcons();
}

function submitEnquiry() {
  const btn = document.querySelector('.btn-submit-v4');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '<i data-lucide="check"></i> Enquiry Submitted!';
  if (window.lucide) window.lucide.createIcons();
  btn.style.backgroundColor = 'var(--navy)';
  
  // Show global toast if needed or alert
  alert('Thank you! Your enquiry for the Integrated Program has been received.');

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.backgroundColor = '';
    if (window.lucide) window.lucide.createIcons();
    
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
    if (window.lucide) window.lucide.createIcons();
  }, 3000);
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

// Initialize Lucide icons on page load
if (window.lucide) {
  window.lucide.createIcons();
}
