import { ACTIVE, FIXED } from './_variables';

/**
 * 변수 네이밍 prefix rule
 * s: { STRING }
 * n: { NUMBER }
 * is: { BOOLEAN }
 * o: { OBJECT }
 */

const oPopupDim = document.querySelector('.popup-dim');

// Open popup
export function popupOpen(item) {
  /**
   * 팝업 open
   * @param { string } 팝업 오픈 버튼의 data-popup-open 값(고유 식별자)
   * @param { boolean } 팝업을 오픈할때 dim 과 함께 오픈할것인지
   * @param { boolean } 풀팝업
   */

  const oPopupName = item.getAttribute('data-popup-open');
  const isDim = item.getAttribute('data-dim') === 'true' ? true : false;
  const oTargetPopup = document.querySelector(`[data-popup=${oPopupName}]`);
  const isFull = oTargetPopup.getAttribute('data-popup-type') && oTargetPopup.getAttribute('data-popup-type') === 'full' ? true : false;

  if (isFull || isDim) {
    bodyScrollControl();
  }

  // dim 과 함께 열려야 한다면
  if (isDim) {
    oPopupDim.classList.add(`${ACTIVE}`);
    oPopupDim.setAttribute('data-popup-close', `${oPopupName}`);
  }

  document.querySelector(`[data-popup=${oPopupName}]`).classList.add(`${ACTIVE}`);
}

// Close popup
export function popupClose(e) {
  const oTarget = e.target;
  const isDim = oTarget.classList.contains('popup-dim') ? true : false;
  const oBody = document.querySelector('body');

  oBody.classList.contains(`${FIXED}`) && bodyScrollControl();

  // dim 을 클릭시
  if (isDim) {
    const sPopupDimAttr = oTarget.getAttribute('data-popup-close');
    const oTargetPopup = document.querySelector(`[data-popup=${sPopupDimAttr}]`);

    oTargetPopup.classList.remove(`${ACTIVE}`);
    oPopupDim.classList.remove(`${ACTIVE}`);
  } else {
    // 딤드가 활성화 됐다면
    oPopupDim.classList.contains(`${ACTIVE}`)
    && oPopupDim.classList.remove(`${ACTIVE}`);

    const oClosestPopup = oTarget.closest('[data-popup]');

    oClosestPopup.classList.remove(`${ACTIVE}`);
  }
}

// toggleClass
export function toggleClass(oTarget) {
  /**
   * @param { string } toggle 대상
   */

  const oToggleClass = oTarget.getAttribute('data-toggle');

  oTarget.classList.contains(oToggleClass)
  ? oTarget.classList.remove(oToggleClass)
  : oTarget.classList.add(oToggleClass);
}

// layerClose
export function layerClose(oTarget, sClassName) {
  /**
   * @param { string } 레이어 닫기 버튼
   * @param { string } 레이어 오픈을 위해 추가된 class
   */
  const oParentNode = oTarget.closest('.layer');

  oParentNode.classList.contains(sClassName)
  && oParentNode.classList.remove(sClassName);
}

export function bodyScrollControl() {
  let nScrollTop = window.scrollY;
  const oBody = document.querySelector('body');
  if (oBody.classList.contains(`${FIXED}`)) {
    const nScrollTopValue = oBody.style.top.replace(/[^0-9]/g,"");
    oBody.classList.remove(`${FIXED}`);
    oBody.style.top = null;
    window.scrollTo(0, nScrollTopValue);
  } else {
    oBody.classList.add(`${FIXED}`);
    oBody.style.top = -nScrollTop + 'px';
  }
}