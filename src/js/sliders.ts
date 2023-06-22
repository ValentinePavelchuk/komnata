import Swiper, {Navigation} from 'swiper';
import 'swiper/css/bundle';
const sliders = document.querySelectorAll('.swiper-container');
const prevBtn = document.querySelectorAll('.swiper-btn-prev');
const nextBtn = document.querySelectorAll('.swiper-btn-next');

for( let i= 0; i < sliders.length; i++ ) {

    sliders[i].classList.add(`swiper-container-${i}`);
    prevBtn[i].classList.add(`swiper-btn-prev-${i}`)
    nextBtn[i].classList.add(`swiper-btn-next-${i}`)

    const slider = new Swiper(`.swiper-container-${i}`, {
        modules: [ Navigation ],
        direction: 'horizontal',
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 16,
        // Navigation arrows
        navigation: {
            nextEl: `.swiper-btn-next-${i}`,
            prevEl: `.swiper-btn-prev-${i}`,
        },
        breakpoints: {
            960: {
                centeredSlides: false
            }
        }
    });
}