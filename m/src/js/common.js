// Common JS

import ISACTIVE from './include/common/_variables';
import { toggleClass } from './include/common/_utils';

export default class Common {
  constructor() {
    this.init();
  }

  init() {
    this.cacheElement();
    this.setEvent();
  };

  cacheElement() {
    this.footerToggleButton = document.querySelector('.footer__button');
  }

  setEvent() {
    this.footerToggleButton.addEventListener('click', () => {
      toggleClass(this.footerToggleButton, `${ISACTIVE}`);
    });
  }
}

const common = new Common();