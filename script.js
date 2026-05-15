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
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  const speed = 200;

  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText.replace("+", "");
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc) + (counter.innerText.includes("+") ? "+" : "");
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target + (counter.getAttribute("data-plus") === "true" ? "+" : "");
      }
    };
    updateCount();
  });
}

// Observer for Counters
const statsSection = document.querySelector(".stats-section");
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.unobserve(statsSection);
    }
  }, { threshold: 0.5 });
  observer.observe(statsSection);
}

if (window.lucide) {
  window.lucide.createIcons();
}
