import './include/polyfill/nodeListForEach';
import './include/polyfill/closest';
import './include/common/filter';
import './include/common/global-filter';
import './basicJs';

export default class Ranking {
  constructor() {
    this.init();
  }

  init() {
    this.cacheElement();
    this.setEvent();
  }

  cacheElement() {
    this.oGuideCloseButton = document.querySelector('.guide-link__button');
    this.oGuideLink = document.querySelector('.guide-link');
  }

  setEvent() {
    const GUIDE_LINK_ACTIVE = 'guide-link--active';

    this.oGuideCloseButton.addEventListener('click', () => {
      this.oGuideLink.classList.remove(`${GUIDE_LINK_ACTIVE}`);
      sessionStorage.setItem('guide-link', 0);
    });

    const isGuideLink = (() => {
      const sessionGuideLinkValue = sessionStorage.getItem('guide-link');

      if (Boolean(sessionGuideLinkValue)) {
        this.oGuideLink.classList.remove(`${GUIDE_LINK_ACTIVE}`);
      }
    })();
  }
}

const ranking = new Ranking();
