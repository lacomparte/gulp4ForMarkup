// Mypage JS

import { ISACTIVE } from './include/common/_variables';
import { toggleClass } from './include/common/_utils';

export default class Mypage {
  constructor() {
    this.init();
  }

  init() {
    this.cacheElement();
    this.setEvent();
  };

  cacheElement() {
    this.accountToggleButton = document.querySelector('.main-account__introduce');
  }

  setEvent() {
    this.accountToggleButton.addEventListener('click', () => {
      toggleClass(this.accountToggleButton, `${ISACTIVE}`);
    });
  }
}

const mypage = new Mypage();