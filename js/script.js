document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const navLinks = document.querySelectorAll("#menu a");

  if (hamburger && menu) {

    hamburger.addEventListener("click", () => {
      menu.classList.toggle("show");
      hamburger.classList.toggle("active");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("show");
        hamburger.classList.remove("active");
      });
    });
  }

  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href");

    // otomatis aktif sesuai halaman
    if (linkPage === currentPage) {
      link.classList.add("active");
    }

    // animasi klik
    link.addEventListener("click", function () {
      navLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  const slider = document.querySelector(".slider");
  const slides = document.querySelector(".slider .slides");

  if (!slider || !slides) return;

  let index = 0;
  const totalSlides = slides.children.length;

  if (totalSlides <= 1) return;

  function showSlide(i) {
    slides.style.transform = `translateX(-${i * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % totalSlides;
    showSlide(index);
  }

  let autoSlide = setInterval(nextSlide, 4000);
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  slides.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isDragging = true;
    clearInterval(autoSlide);
  }, { passive: true });

  slides.addEventListener("touchmove", e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  slides.addEventListener("touchend", () => {
    if (!isDragging) return;

    const diff = startX - currentX;

    if (diff > 50) {
      index = (index + 1) % totalSlides;
    } else if (diff < -50) {
      index = (index - 1 + totalSlides) % totalSlides;
    }

    showSlide(index);

    autoSlide = setInterval(nextSlide, 4000);
    isDragging = false;
  });

});