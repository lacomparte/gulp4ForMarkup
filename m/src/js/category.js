// category JS
import Swiper, { Pagination } from 'swiper';
import { ACTIVE } from './include/common/_variables';
import './include/polyfill/nodeListForEach';
import './include/polyfill/closest';
import './include/common/filter';
import './include/common/global-filter';
import './basicJs';

// Category
export default class Category {
  constructor() {
    this.init();
  }

  init() {
    this.cacheElement();
    this.setEvent();
  };

  cacheElement() {
    this.headerUtilCategory = document.querySelector('.header__util--category');
    this.popupCategory = document.querySelector('.popup-category');
  }

  setEvent() {
    this.headerUtilCategory.addEventListener('click', (e) => {
      if(this.headerUtilCategory.classList.contains('active')) {
        this.headerUtilCategory.classList.add(`${ACTIVE}`);
        this.popupCategory.classList.add(`${ACTIVE}`);
        categorySwiper.update();
      } else {
        this.headerUtilCategory.classList.remove(`${ACTIVE}`);
        this.popupCategory.classList.remove(`${ACTIVE}`);
      }
      bodyScrollControl();
    });

    this.popupCategory.addEventListener('click', (e) => {
     if (e.target !== e.currentTarget) return;
      this.headerUtilCategory.classList.remove(`${ACTIVE}`);
      this.popupCategory.classList.remove(`${ACTIVE}`);
      bodyScrollControl();
    });
  }
}

Swiper.use([Pagination]);
var categorySwiper = new Swiper('.popup-category__swiper', {
  pagination: {
    el: '.popup-category__pagination',
    type: 'bullets',
    bulletActiveClass: 'active',
  },
})

const swiper = new Swiper();
const category = new Category();