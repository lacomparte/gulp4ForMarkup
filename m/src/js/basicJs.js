import { ACTIVE } from './include/common/_variables';
import {
  popupOpen,
  popupClose,
  layerClose,
  toggleClass,
} from './include/common/_helper';

export default class BasicJs {
  constructor() {
    this.init();
  }

  init() {
    this.cacheElement();
    this.setEvent();
  }

  cacheElement() {
    this.oPopupDim = document.querySelector('.popup-dim');
    this.oPopupOpenButton = document.querySelectorAll('[data-popup-open]');
    this.oPopupCloseButton = document.querySelectorAll('[data-popup-close]');
    this.oLayerCloseButton = document.querySelectorAll('[data-layer-close]');
    this.oToggleButton = document.querySelectorAll('[data-toggle]');
  }

  setEvent() {
    // Triggers
    this.oPopupOpenButton && Array.prototype.forEach.call(this.oPopupOpenButton, (item) => {
      item.addEventListener('click', () => {
        popupOpen(item);
      });
    })

    // Triggers close
    this.oPopupCloseButton && Array.prototype.forEach.call(this.oPopupCloseButton, (item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        popupClose(e);
      });
    })

    // dim constrol
    this.oPopupDim && this.oPopupDim.addEventListener('click', (e) => {
      e.stopPropagation();
      popupClose(e);
    })

    // toggle class
    this.oToggleButton && Array.prototype.forEach.call(this.oToggleButton, (item) => {
      item.addEventListener('click', () => {
        toggleClass(item);
      });
    });

    // layer close
    this.oLayerCloseButton && Array.prototype.forEach.call(this.oLayerCloseButton, (item) => {
      item.addEventListener('click', () => {
        layerClose(item, `${ACTIVE}`)
      });
    });
  }
}

const basicJs = new BasicJs();