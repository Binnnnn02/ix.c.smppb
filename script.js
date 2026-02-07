document.addEventListener("DOMContentLoaded", () => {
  
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("show");
      hamburger.classList.toggle("active");
    });
  }
  const slides = document.querySelector(".slides");

  if (!slides) return;

  let index = 0;
  const totalSlides = slides.children.length;

  setInterval(() => {
    index = (index + 1) % totalSlides;
    slides.style.transform = `translateX(-${index * 100}%)`;
  }, 3000);
});