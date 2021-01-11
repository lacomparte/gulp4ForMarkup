// Global Filter
export default class GlobalFilter {
  constructor() {
    this.init();
  }

  init() {
    this.cacheElement();
    this.setEvent();
  };

  cacheElement() {
    this.globalFilterWrap = document.querySelector('.global-filter-v2');
    this.globalFilterButton = document.querySelectorAll('.global-filter-v2__button');
  }

  setEvent() {
    const body = document.querySelector('body');
    const GLOBAL_FILTER = 'global-filter-v2';
    const isContain = (ele, className) => ele.classList.contains(`${className}`) ? true : false;

    this.globalFilterButton && this.globalFilterButton.forEach(button => {
      button.addEventListener('click', () => {

        if(isContain(this.globalFilterWrap, `${GLOBAL_FILTER}--hide`)) {
          this.globalFilterWrap.classList.remove(`${GLOBAL_FILTER}--hide`);
        } else {
          this.globalFilterWrap.classList.add(`${GLOBAL_FILTER}--hide`);
          if(isContain(button, `${GLOBAL_FILTER}__button--mensinsa`)) {
            filterSelect('mensinsa');
            this.globalFilterWrap.classList.remove(`${GLOBAL_FILTER}--wusinsa`);
            body.classList.remove('wusinsa');
          }else if(isContain(button, `${GLOBAL_FILTER}__button--wusinsa`)) {
            filterSelect('wusinsa');
            this.globalFilterWrap.classList.remove(`${GLOBAL_FILTER}--mensinsa`);
            body.classList.remove('mensinsa');
          }
        }
      });
    });

    function filterSelect(filter) {
      const activeClass = `${GLOBAL_FILTER}--${filter}`;
      const globalFilterWrap = document.querySelector(`.${GLOBAL_FILTER}`);

      if(isContain(globalFilterWrap, activeClass)) {
        globalFilterWrap.classList.remove(activeClass);
        body.classList.remove(filter);
      } else {
        globalFilterWrap.classList.add(activeClass);
        body.classList.add(filter);
      }
    }
  }
}

const globalFilter = new GlobalFilter();