const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".dot"));
const phaseLabel = document.getElementById("phaseLabel");
const progressBar = document.getElementById("progressBar");
const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");
const printButton = document.getElementById("printDeck");

let current = 0;

function setSlide(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === current);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === current);
  });

  const active = slides[current];
  phaseLabel.textContent = active.dataset.phase || `Lamina ${current + 1}`;
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  prevButton.disabled = current === 0;
  nextButton.disabled = current === slides.length - 1;
  window.history.replaceState(null, "", `#slide-${current + 1}`);
}

function nextSlide() {
  setSlide(current + 1);
}

function prevSlide() {
  setSlide(current - 1);
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => setSlide(Number(dot.dataset.slide)));
});

nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);
printButton.addEventListener("click", () => window.print());

window.addEventListener("keydown", (event) => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    nextSlide();
  }

  if (["ArrowLeft", "PageUp"].includes(event.key)) {
    event.preventDefault();
    prevSlide();
  }

  if (event.key === "Home") {
    setSlide(0);
  }

  if (event.key === "End") {
    setSlide(slides.length - 1);
  }
});

const hashMatch = window.location.hash.match(/slide-(\d+)/);
setSlide(hashMatch ? Number(hashMatch[1]) - 1 : 0);
