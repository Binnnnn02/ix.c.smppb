document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const blur = document.getElementById("blur");

  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("show");
      hamburger.classList.toggle("active");
      if (blur) blur.classList.toggle("show");
    });

    if (blur) {
      blur.addEventListener("click", () => {
        menu.classList.remove("show");
        hamburger.classList.remove("active");
        blur.classList.remove("show");
      });
    }
  }

  const slides = document.querySelector(".slides");

  if (!slides) return;

  let index = 0;
  const total = slides.children.length;

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function showSlide(i) {
    slides.style.transform = `translateX(-${i * 100}%)`;
  }

  function nextSlide() {
    index = (index + 1) % total;
    showSlide(index);
  }

  let autoSlide = setInterval(nextSlide, 4000);

  slides.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    clearInterval(autoSlide);
  }, { passive: true });

  slides.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  slides.addEventListener("touchend", () => {
    if (!isDragging) return;

    const diff = startX - currentX;

    if (diff > 50) {
      index = (index + 1) % total;
    } else if (diff < -50) {
      index = (index - 1 + total) % total;
    }

    showSlide(index);

    autoSlide = setInterval(nextSlide, 4000);
    isDragging = false;
  });

});