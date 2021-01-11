import { ACTIVE } from './include/common/_variables';
import {
  popupOpen,
  popupClose,
  layerClose,
  toggleClass,
} from './include/common/_helper';

const oPopupDim = document.querySelector('.popup-dim');
const oPopupOpenButton = document.querySelectorAll('[data-popup-open]');
const oPopupCloseButton = document.querySelectorAll('[data-popup-close]');
const oLayerCloseButton = document.querySelectorAll('[data-layer-close]');
const oToggleButton = document.querySelectorAll('[data-toggle]');

// Triggers
Array.prototype.forEach.call(oPopupOpenButton, (item) => {
  item.addEventListener('click', () => {
    popupOpen(item);
  });
})

// Triggers close
Array.prototype.forEach.call(oPopupCloseButton, (item) => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    popupClose(e);
  });
})

// dim constrol
oPopupDim && oPopupDim.addEventListener('click', (e) => {
  e.stopPropagation();
  popupClose(e);
})

// toggle class
Array.prototype.forEach.call(oToggleButton, (item) => {
  item.addEventListener('click', () => {
    toggleClass(item);
  });
});

// layer close
Array.prototype.forEach.call(oLayerCloseButton, (item) => {
  item.addEventListener('click', () => {
    layerClose(item, `${ACTIVE}`)
  });
});