document.addEventListener("DOMContentLoaded", () =>{
  const swiper = new Swiper('.swiper',{
    
    autoplay: {
      delay: 10000,
    },
    keyboard: {
    enabled: true,
    onlyInViewport: false,
  },
  loop: true,
  followFinger: false,
  pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
      },
  }); 
})
