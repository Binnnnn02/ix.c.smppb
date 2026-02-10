document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");

  if (hamburger && menu && overlay) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("show");
      hamburger.classList.toggle("active");
      overlay.classList.toggle("show");
    });

    overlay.addEventListener("click", () => {
      menu.classList.remove("show");
      hamburger.classList.remove("active");
      overlay.classList.remove("show");
    });
  }

  document.querySelectorAll(".folder-content img").forEach(img => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();

      const lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.innerHTML = `<img src="${img.src}">`;
      document.body.appendChild(lightbox);

      lightbox.addEventListener("click", () => {
        lightbox.remove();
      });
    });
  });

  const slides = document.querySelector(".slider .slides");
  if (!slides) return;

  let index = 0;
  const totalSlides = slides.children.length;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function showSlide(i) {
    slides.style.transform = `translateX(-${i * 100}%)`;
  }

  setInterval(() => {
    index = (index + 1) % totalSlides;
    showSlide(index);
  }, 3000);

  slides.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  slides.addEventListener("touchmove", e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  slides.addEventListener("touchend", () => {
    if (!isDragging) return;
    const diff = startX - currentX;
    if (diff > 50) index = (index + 1) % totalSlides;
    if (diff < -50) index = (index - 1 + totalSlides) % totalSlides;
    showSlide(index);
    isDragging = false;
  });

});