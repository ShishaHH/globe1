const track = document.getElementById('carousel-track');
const slides = Array.from(track.children);
const leftZone = document.getElementById('left-zone');
const rightZone = document.getElementById('right-zone');


const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.classList.add('clone-first');
lastClone.classList.add('clone-last');

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

let realSlides = Array.from(track.children);
let total = realSlides.length;
let index = 1;

track.style.transform = `translateX(${-index * 100}%)`;

let autoTimer = null;

function updateSlide() {
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(${-index * 100}%)`;


  realSlides.forEach(slide => slide.classList.remove('active'));

  let displayIndex = index;
  if (realSlides[index].classList.contains('clone-first')) displayIndex = 1;
  if (realSlides[index].classList.contains('clone-last')) displayIndex = total - 2;

  setTimeout(() => {
    realSlides[displayIndex].classList.add('active');
  }, 50);
}

function nextSlide() {
  index = (index + 1) % total;
  updateSlide();
}

function prevSlide() {
  index = (index - 1 + total) % total;
  updateSlide();
}

let allowTransition = true;

function goToSlide(i) {
    if (allowTransition) {
        track.style.transition = "transform 0.6s ease";
    }
    track.style.transform = `translateX(-${i * 100}%)`;
}


track.addEventListener('transitionend', () => {
  if (realSlides[index].classList.contains('clone-first')) {
    track.style.transition = 'none';
    index = 1;
    track.style.transform = `translateX(${-index * 100}%)`;
    setTimeout(() => {
        track.style.transition = 'transform 0.6s ease';
    }, 20);
    // setTimeout(() => track.style.transition = 'transform 0.5s ease', 20);
  }
  if (realSlides[index].classList.contains('clone-last')) {
    track.style.transition = 'none';
    index = total - 2;
    track.style.transform = `translateX(${-index * 100}%)`;
    setTimeout(() => {
        track.style.transition = 'transform 0.6s ease';
    }, 20);
    // setTimeout(() => track.style.transition = 'transform 0.5s ease', 20);
  }
  realSlides.forEach(s => s.classList.remove('active'));
  realSlides[index].classList.add('active');
});


function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 20000);
}


rightZone.addEventListener('click', () => { nextSlide(); resetAuto(); });
leftZone.addEventListener('click', () => { prevSlide(); resetAuto(); });


function stopAutoTemporary() {
  if (autoTimer) clearInterval(autoTimer);
  setTimeout(() => { autoTimer = setInterval(nextSlide, 10000); }, 15000);
}


(function addSwipe() {
  let startX = 0, isDown = false;
  track.addEventListener('pointerdown', e => {
    isDown = true;
    startX = e.clientX;
    track.style.transition = 'none';
    if (autoTimer) clearInterval(autoTimer);
  });

  window.addEventListener('pointermove', e => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    const width = track.clientWidth / total;
    track.style.transform = `translateX(${-index*100 + (dx/track.clientWidth)*100}%)`;
    resetAuto()
  });

  window.addEventListener('pointerup', e => {
    if (!isDown) return;
    isDown = false;
    const dx = e.clientX - startX;
    const width = track.clientWidth / total;
    track.style.transition = 'transform 0.5s ease';
    if (dx > width*0.2) prevSlide();
    else if (dx < -width*0.2) nextSlide();
    else updateSlide();
    autoTimer = setInterval(nextSlide, 10000);
  });

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDown = true;
    track.style.transition = 'none';
    if (autoTimer) clearInterval(autoTimer);
  }, {passive:true});

  track.addEventListener('touchmove', e => {
    if (!isDown) return;
    const dx = e.touches[0].clientX - startX;
    const width = track.clientWidth / total;
    track.style.transform = `translateX(${-index*100 + (dx/track.clientWidth)*100}%)`;
  }, {passive:true});

  track.addEventListener('touchend', e => {
    if (!isDown) return;
    isDown = false;
    const dx = e.changedTouches[0].clientX - startX;
    const width = track.clientWidth / total;
    track.style.transition = 'transform 0.5s ease';
    if (dx > width*0.2) prevSlide();
    else if (dx < -width*0.2) nextSlide();
    else updateSlide();
    autoTimer = setInterval(nextSlide, 10000);
  }, {passive:true});
})();

// ресайз
window.addEventListener('resize', () => {
  track.style.transition = 'none';
  updateSlide();
  setTimeout(() => track.style.transition = 'transform 0.5s ease', 20);
});

// старт
resetAuto();
updateSlide();
