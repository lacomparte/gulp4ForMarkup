import { ACTIVE } from './include/common/_variables';
import {
    toggleClass,
} from './include/common/_helper';

const oToggleButton = document.querySelectorAll('[data-toggle]');

// toggle class
Array.prototype.forEach.call(oToggleButton, (item) => {
    item.addEventListener('click', () => {
        toggleClass(item);
    });
});