import { ACTIVE } from './_variables';

import '../polyfill/closest';

const oBody = document.querySelector('body');

export function handlePopupWithDimmed(target) {
  bodyScrollControl();

  const dimmed = document.querySelector('.popup-dimm');
  const isDimmedOpen = Boolean(dimmed.classList.contains(`${ACTIVE}`));

  if (isDimmedOpen) {
    const openObject = document.querySelectorAll(`.${ACTIVE}[data-open='true']`);
    dimmed.classList.remove(`${ACTIVE}`);
    dimmed.setAttribute('data-open', 'false');
    openObject.forEach(obj => {
      obj.classList.remove(`${ACTIVE}`);
      obj.setAttribute('data-open', 'false');
    });
  } else {
    dimmed.classList.add(`${ACTIVE}`);
    dimmed.setAttribute('data-open', 'true');
    target.classList.add(`${ACTIVE}`);
    target.setAttribute('data-open', 'true');
  }
}

// DOM 의 절대 TOP 좌표
export function absoluteTopPosition(target) {
  const clientRect = target.getBoundingClientRect();
  const relativeTop = clientRect.top;
  const scrolledTopLength = window.pageYOffset;
  const absoluteTop = scrolledTopLength + relativeTop;

  return absoluteTop;
}

// DOM 의 상대 TOP 좌표
export function relativeTopPosition(target) {
  const getAbsoluteTop = (target) => {
    return window.pageYOffset + target.getBoundingClientRect().top;
  }

  const parentEle = target.parentElement;
  const parentAbsoluteTop = getAbsoluteTop(parentEle);
  const absoluteTop = getAbsoluteTop(target);
  const relativeTop = absoluteTop - parentAbsoluteTop;

  return relativeTop;
}
