const track = document.getElementById('carousel-track');
const slides = Array.from(track.children);
const leftZone = document.getElementById('left-zone');
const rightZone = document.getElementById('right-zone');

// Клонируем слайды для бесконечной прокрутки
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.classList.add('clone-first');
lastClone.classList.add('clone-last');

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

let realSlides = Array.from(track.children);
let total = realSlides.length;
let index = 1; // Начинаем с первого реального слайда (после клона)

// Инициализация
track.style.transform = `translateX(${-index * 100}%)`;
track.style.transition = 'transform 0.9s ease';

let autoTimer = null;

function updateSlide() {
  track.style.transition = 'transform 0.9s ease';
  track.style.transform = `translateX(${-index * 100}%)`;

  // Обновляем активный слайд
  realSlides.forEach(slide => slide.classList.remove('active'));
  
  let displayIndex = index;
  if (realSlides[index].classList.contains('clone-first')) displayIndex = 1;
  if (realSlides[index].classList.contains('clone-last')) displayIndex = total - 2;
  
  realSlides[displayIndex].classList.add('active');
}

function nextSlide() {
  index++;
  updateSlide();
}

function prevSlide() {
  index--;
  updateSlide();
}

// ФИКС РЫВКА: Используем двойной requestAnimationFrame
track.addEventListener('transitionend', () => {
  // Если достигли клона первого слайда
  if (realSlides[index].classList.contains('clone-first')) {
    // Используем requestAnimationFrame для плавного перехода
    requestAnimationFrame(() => {
      track.style.transition = 'none';
      index = 1;
      track.style.transform = `translateX(${-index * 100}%)`;
      
      // Второй requestAnimationFrame для гарантии
      requestAnimationFrame(() => {
        track.style.transition = 'transform 0.9s ease';
        
        // Обновляем активный класс после перехода
        realSlides.forEach(s => s.classList.remove('active'));
        realSlides[index].classList.add('active');
      });
    });
  }
  
  // Если достигли клона последнего слайда
  if (realSlides[index].classList.contains('clone-last')) {
    requestAnimationFrame(() => {
      track.style.transition = 'none';
      index = total - 2;
      track.style.transform = `translateX(${-index * 100}%)`;
      
      requestAnimationFrame(() => {
        track.style.transition = 'transform 0.9s ease';
        
        realSlides.forEach(s => s.classList.remove('active'));
        realSlides[index].classList.add('active');
      });
    });
  }
});

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 15000); // 5 секунд
}

// Обработчики кнопок
rightZone.addEventListener('click', () => { 
  nextSlide(); 
  resetAuto(); 
});

leftZone.addEventListener('click', () => { 
  prevSlide(); 
  resetAuto(); 
});

// Свайп (ваш оригинальный код)
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
  });

  window.addEventListener('pointerup', e => {
    if (!isDown) return;
    isDown = false;
    const dx = e.clientX - startX;
    const width = track.clientWidth / total;
    track.style.transition = 'transform 0.9s ease';
    if (dx > width*0.2) prevSlide();
    else if (dx < -width*0.2) nextSlide();
    else updateSlide();
    autoTimer = setInterval(nextSlide, 15000);
  });

  // Touch события
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
    track.style.transition = 'transform 0.9s ease';
    if (dx > width*0.2) prevSlide();
    else if (dx < -width*0.2) nextSlide();
    else updateSlide();
    autoTimer = setInterval(nextSlide, 15000);
  }, {passive:true});
})();

// Ресайз
window.addEventListener('resize', () => {
  track.style.transition = 'none';
  updateSlide();
  setTimeout(() => track.style.transition = 'transform 0.9s ease', 20);
});

// Старт
resetAuto();

updateSlide();

