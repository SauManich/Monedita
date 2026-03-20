let currentSlide = 1;
const totalSlides = 3;

function goToSlide(n) {
  if (n < 1 || n > totalSlides || n === currentSlide) return;

  const from = document.getElementById(`slide-${currentSlide}`);
  const to   = document.getElementById(`slide-${n}`);

  from.classList.add('exit');
  from.classList.remove('active');

  from.addEventListener('transitionend', () => {
    from.classList.remove('exit');
  }, { once: true });

  to.classList.add('active');
  currentSlide = n;
}