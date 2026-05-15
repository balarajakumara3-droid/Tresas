const slides = [...document.querySelectorAll(".hero-slide")];
const nextButton = document.querySelector(".ctrl-next");
const prevButton = document.querySelector(".ctrl-prev");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-menu");
const enquiryForm = document.querySelector("#enquiry-form");
let currentSlide = 0;
let timerId;

function finishLoading() {
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
  window.addEventListener("load", finishLoading);
  window.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(finishLoading, 1400);
  });
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
  const speed = 200;

  elements.forEach(counter => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const suffix = counter.getAttribute("data-suffix") || (counter.getAttribute("data-plus") === "true" ? "+" : "");
    const decimals = parseInt(counter.getAttribute("data-decimals")) || 0;
    
    let current = 0;
    const inc = target / speed;

    const updateCount = () => {
      current += inc;
      if (current < target) {
        counter.innerText = current.toFixed(decimals) + suffix;
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target.toFixed(decimals) + suffix;
      }
    };
    updateCount();
  });
}

// Observer for Counters
const observerOptions = { threshold: 0.5 };
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll(".stat-number, .stat-num");
      animateCounters(counters);
      statsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".impact-section, .stats-section, .education").forEach(section => {
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
