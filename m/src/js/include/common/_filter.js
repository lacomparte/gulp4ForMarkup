// snap JS

import '../polyfill/nodeListForEach';
import '../polyfill/closest';
import Swiper, { Pagination } from 'swiper';

export default class Filter {
  constructor() {
    this.init();
    this.beforeFilter = 'default';
  }

  init() {
    this.cacheElement();
    this.setEvent();
    // this.initResult();
    this.initFilterContents();
  };

  cacheElement() {
    // filter item
    this.oFilterItemWrap = document.querySelector('.cm-filter__header__content');
    this.oFilterItems = this.oFilterItemWrap.querySelectorAll('.cm-filter__item');

    // filter contents
    this.oFilterContents = document.querySelectorAll('.cm-filter__contents');

    // filter contents items
    this.oFilterContentsItems = document.querySelectorAll('.cm-filter__lists');

    // filter translation
    this.oFilterTranslation = document.querySelector('.cm-filter__tabs__translation');
    this.oSortWrap = this.oFilterTranslation.parentElement.querySelector('.cm-filter__tabs__contents');

    // filter result
    this.oFilterResultWrap = document.querySelector('.cm-filter__result');
    this.oFilterChipsWrap = document.querySelector('.cm-filter__result__contents');
    this.oFilterChips = this.oFilterChipsWrap.querySelectorAll('.cm-filter__chip');

    // swiper
    this.oSwiperContainer = document.querySelectorAll('.cm-filter__swiper .cm-filter__inner');

    // filter input
    this.oFilterInput = document.querySelectorAll('.cm-filter__input');
    this.oFilterEmptyButton = document.querySelectorAll('.cm-filter__input__button');
    this.oFilterInputSumitButton = document.querySelector('.cm-filter__price').querySelector('.cm-filter__button');

    // 주력 카테고리
    this.oFilterMainCategoryButton = document.querySelectorAll('.cm-filter__category__button');
    this.oFilterMainCategory = document.querySelector('[data-filter="main_category"]');

    // 태그 영역
    this.oFilterHashTag = document.querySelector('.cm-filter__tag');

    // tooltip
    this.oToolTip = document.querySelector('.cm-filter__tooltip');
  }

  setEvent() {
    const CM_FILTER = 'cm-filter';
    const ITEM_SELECTED = `${CM_FILTER}__item--selected`;
    const ITEM_ACTIVE = `${CM_FILTER}__item--active`;
    const BUTTON_ACTIVE = `${CM_FILTER}__lists__button--active`;
    const SORT_ACTIVE = `${CM_FILTER}__sort--active`;
    const oWindowWidth = window.innerWidth;

    // filter tooltip
    setTimeout(() => {
      this.oToolTip.classList.remove(`${CM_FILTER}__tooltip--active`);
      sessionStorage.setItem('filter_tooltip', 1);
    }, 4000);

    // 태그 영역
    this.oFilterHashTag.addEventListener('click', (e) => {
      const welTarget = e.target;
      let oTarget = welTarget.nodeName !== 'DIV' ? welTarget.nodeName !== 'BUTTON' ? oTarget = welTarget.closest('BUTTON') : oTarget = welTarget : false;

      oTarget === null
      ? false
      : oTarget.classList.contains('cm-filter__chip--active')
      ? oTarget.classList.remove('cm-filter__chip--active')
      : oTarget.classList.add('cm-filter__chip--active');
    });

    // filter input
    this.oFilterInput.forEach(input => {
      input.addEventListener('keyup', (e) => {
        const aChild = [...e.target.parentElement.childNodes];
        const isCloseButton = aChild.some(item => item.nodeName === 'BUTTON');

        if (isCloseButton) {
          e.target.value.length > 0
          ? input.classList.add('cm-filter__input--active')
          : input.classList.remove('cm-filter__input--active')
        } else {
          e.target.value.length > 0
          ? this.oFilterInputSumitButton.classList.add('cm-filter__button--active')
          : this.oFilterInputSumitButton.classList.remove('cm-filter__button--active')
        }
      });
    });

    // filter input empty button
    this.oFilterEmptyButton.forEach(button => {
      button.addEventListener('click', () => {
        button.parentElement.classList.remove('cm-filter__input--active');
        button.previousElementSibling.value = '';
      });
    });

    // swiper
    const aFilterSwiperData = [...document.querySelectorAll(`[data-filter]`)];
    aFilterSwiperData.forEach(item => {
      if (item.querySelector('.cm-filter__inner')) {
        const isSwiper = item.querySelector('.cm-filter__inner').childElementCount > 1;
        if (isSwiper) {
          Swiper.use([Pagination]);
          const oSwiperElement = item.querySelector('.cm-filter__swiper');
          const oSwiperPagination = oSwiperElement.querySelector('.cm-filter__pagination');
          const oSwiper = new Swiper(oSwiperElement, {
            loop: false,
            pagination: {
              el: oSwiperPagination,
              type: 'fraction',
            },
          });
        }
      }
    });

    // filter content item 클릭시
    this.oFilterContentsItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const welTarget = e.target;
        let oTarget = welTarget.nodeName !== 'DIV' ? welTarget.nodeName !== 'BUTTON' ? oTarget = welTarget.closest('BUTTON') : oTarget = welTarget : false;

        if (oTarget) {
          const oTargetData = String(Object.keys(oTarget.dataset)).split('filter')[1].toLowerCase();
          const oTargetTab = document.querySelector(`[data-tab=${oTargetData}]`);

          if (oTarget.classList.contains(`${BUTTON_ACTIVE}`)) {
            oTarget.classList.remove(`${BUTTON_ACTIVE}`);

            const oTargetFilterButton = [...document.querySelectorAll(`[data-filter-${oTargetData}]`)];

            if (this.isContains(oTargetFilterButton, `${BUTTON_ACTIVE}`)) {
              if (oTargetTab.dataset.selected === undefined) {
                oTargetTab.classList.add(`${BUTTON_ACTIVE}`);
              }
            } else {
              oTargetTab.removeAttribute('data-selected');
            }
          } else {
            oTargetTab.setAttribute('data-selected', 'true');
            oTarget.classList.add(`${BUTTON_ACTIVE}`);
          }
        }
      })
    })

    // filter item 클릭시
    this.oFilterItemWrap.addEventListener('click', (e) => {
      const welTarget = e.target;
      let oTarget;

      if (welTarget.nodeName === 'DIV') {
        return false;
      }

      welTarget.nodeName !== 'DIV'
      && welTarget.nodeName !== 'BUTTON'
        ? oTarget = welTarget.closest('BUTTON')
        : oTarget = welTarget;

      const oTargetDataTab = oTarget.dataset.tab;
      const oTargetContent = document.querySelector(`[data-filter=${oTargetDataTab}]`);
      const oTargetTab = document.querySelector(`[data-tab=${oTargetDataTab}]`);

      const resetFilterItems = () => {
        this.oFilterItems.forEach(item => {
          if (item.classList.contains(`${ITEM_ACTIVE}`)) {
            item.classList.remove(`${ITEM_ACTIVE}`);
            document.querySelector(`[data-filter=${item.dataset.tab}]`).style.display = 'none';
          }

          if (item.dataset.selected === 'true') {
            item.classList.add(`${ITEM_SELECTED}`);
          }
        });
      }

      if (oTarget.dataset.tab === 'default') {
        if (oTarget.classList.contains(`${ITEM_SELECTED}`)) {
          oTarget.setAttribute('aria-selected', false);
        } else {
          oTarget.setAttribute('aria-selected', true);
        }

        resetFilterItems();

        oTarget.classList.contains(`${ITEM_SELECTED}`)
        ? oTarget.classList.remove(`${ITEM_SELECTED}`)
        : oTarget.classList.add(`${ITEM_SELECTED}`);

      } else if (oTargetDataTab.includes('camp')) {
        const oClass = `cm-filter__item--selected`;

        resetFilterItems();

        if (oTarget.classList.contains(`${oClass}`)) {
          oTarget.classList.remove(`${oClass}`);
        } else {
          oTarget.classList.add(`${oClass}`);
        }

      } else {
        this.oFilterItems.forEach(item => {
          if (item.dataset.tab !== 'default' && !item.dataset.tab.includes('campaign')) {
            item.setAttribute('aria-selected', 'false');
          }
        });

        if (oTargetTab.classList.contains(`${ITEM_SELECTED}`)) {
          this.oFilterItems.forEach(item => {
            if (item.classList.contains(`${ITEM_ACTIVE}`) && !item.dataset.multi) {
              item.classList.remove(`${ITEM_ACTIVE}`);
            }
            if (item.dataset.selected === 'true') {
              item.classList.add(`${ITEM_SELECTED}`);
            }
          });

          oTargetTab.classList.remove(`${ITEM_SELECTED}`);
          oTargetTab.classList.add(`${ITEM_ACTIVE}`);

          const isContent = document.querySelector(`[data-filter=${this.beforeFilter}]`);
          isContent && this.initFilterContents(this.beforeFilter);
        } else if (oTargetTab.classList.contains(`${ITEM_ACTIVE}`)) {
          oTargetTab.classList.remove(`${ITEM_ACTIVE}`);
          oTargetTab.setAttribute('aria-selected', false);

          if (oTargetTab.dataset.selected === 'true') {
            oTargetTab.classList.add(`${ITEM_SELECTED}`)
          }

          this.initFilterContents(oTargetDataTab);
        } else {
          if (this.beforeFilter !== 'default' && !this.beforeFilter.includes('campaign')) {
            this.initFilterContents(this.beforeFilter);
          }

          this.oFilterItems.forEach(item => {
            if (item.dataset.selected === 'true') {
              item.classList.remove(`${ITEM_ACTIVE}`);
              item.classList.add(`${ITEM_SELECTED}`);
            } else {
              item.classList.remove(`${ITEM_ACTIVE}`);
            }
          });

          oTargetTab.classList.add(`${ITEM_ACTIVE}`);
          oTargetTab.setAttribute('aria-selected', true);
        }

        if (oTargetTab.classList.contains(`${ITEM_ACTIVE}`) && oTargetContent != null) {
          oTargetContent.style.display = 'block';
        }
      }
      // 이전 필터값을 현재 필터값으로 업데이트
      this.beforeFilter = oTargetDataTab;
    });

    // oSortButton 클릭
    this.oSortWrap.addEventListener('click', (e) => {
      const welTarget = e.target;
      let oTarget;

      if (welTarget.nodeName === 'DIV') {
        return false;
      }

      welTarget.nodeName !== 'BUTTON'
        ? oTarget = welTarget.closest('BUTTON')
        : oTarget = welTarget;

      if (oTarget.classList.contains(`${SORT_ACTIVE}`)) {
        oTarget.classList.remove(`${SORT_ACTIVE}`);
        oTarget.removeAttribute('aria-selected');
      } else {
        const oButtons = this.oSortWrap.querySelectorAll('.cm-filter__sort');
        oButtons.forEach(item => {
          item.classList.remove(`${SORT_ACTIVE}`);
          oTarget.removeAttribute('aria-selected');
        })
        oTarget.classList.add(`${SORT_ACTIVE}`);
        oTarget.setAttribute('aria-selected', true);
      }
    });


    // brand filter 의 ABC, ㄱㄴㄷ 버튼 클릭시
    this.oFilterTranslation.addEventListener('click', (e) => {
      const welTarget = e.target;
      let oTarget;

      if (welTarget.nodeName === 'DIV') {
        return false;
      }

      welTarget.nodeName !== 'DIV'
      && welTarget.nodeName !== 'BUTTON'
        ? oTarget = welTarget.closest('BUTTON')
        : oTarget = welTarget;

      const oDataLang = oTarget.dataset.lang;
      const oSwiperWrap = this.oFilterTranslation.parentElement.nextElementSibling;
      const oBrandButtons = oSwiperWrap.querySelectorAll('.cm-filter__lists__button');
      const oSortButton = this.oSortWrap.querySelectorAll('.cm-filter__sort');

      // 언어전환
      const oChangeLang = (oDataLang) => {
        const aEng = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(',');
        const aKor = 'ᄀ,ᄂ,ᄃ,ᄅ,ᄆ,ᄇ,ᄉ,ᄋ,ᄌ,ᄎ,ᄏ,ᄐ,ᄑ,ᄒ'.split(',');

        const translater = (item, oTextNode, aLang) => {
          if (aLang.length !== 0) {
            item.dataset.filterSort = aLang[0];
            oTextNode.innerHTML = aLang[0].toUpperCase();
            aLang.shift();
          } else {
            this.oSortWrap.removeChild(item);
          }
        }

        const brandTranslater = () => {
          oBrandButtons.forEach(item => {
            item.classList.remove(`${SORT_ACTIVE}`);

            let oIndex = item.querySelector('.cm-filter__lists__index').innerText;
            let oIndexTemp = oIndex;
            let oDesc = item.querySelector('.cm-filter__lists__desc').innerText;

            item.querySelector('.cm-filter__lists__desc').innerText = oIndexTemp;
            item.querySelector('.cm-filter__lists__index').innerText = oDesc;
          });
        }

        if (oDataLang === 'kor') {
          oSortButton.forEach(item => {
            const oTextNode = item.querySelector('.cm-filter__sort__text');
            if (item.dataset.filterSort === 'all') {
              item.dataset.filterSort = '전체';
              oTextNode.innerHTML = '전체';
            } else if (item.dataset.filterSort === 'best') {
              item.dataset.filterSort = '인기';
              oTextNode.innerHTML = '인기';
            } else if (item.dataset.filterSort === 'like') {
              item.dataset.filterSort = '좋아요';
            } else {
              translater(item, oTextNode, aKor);
            }
          }, aKor);

          brandTranslater();
        } else {
          oSortButton.forEach(item => {
            const oTextNode = item.querySelector('.cm-filter__sort__text');
            if (item.dataset.filterSort === '전체') {
              item.dataset.filterSort = 'all';
              oTextNode.innerHTML = 'All';
            } else if (item.dataset.filterSort === '인기') {
              item.dataset.filterSort = 'best';
              oTextNode.innerHTML = 'Best';
            } else if (item.dataset.filterSort === '좋아요') {
              item.dataset.filterSort = 'like';
            } else {
              translater(item, oTextNode, aEng);
            }
          }, aEng);

          // aKor -> aEng 로 변경될때 oSortWrap 보다 aEng 의 길이가 더 크기때문에
          // aEng 를 기준으로 다시 .cm-filter__sort DOM 을 생성해서 다시 넣어준다.
          if (aEng.length !== 0) {
            aEng.forEach(item => {
              let oRestSortButton = document.createElement('button');
              oRestSortButton.classList.add('cm-filter__sort');
              oRestSortButton.setAttribute('data-filter-sort', item);

              let oRestSortButtonText = document.createElement('span');
              oRestSortButtonText.classList.add('cm-filter__sort__text');
              oRestSortButtonText.append(`${item}`.toUpperCase());
              oRestSortButton.append(oRestSortButtonText);

              this.oSortWrap.append(oRestSortButton);
            })
          }

          brandTranslater();
        }

        oSortButton.forEach(item => {
          if (item.dataset.filterSort === 'all' || item.dataset.filterSort === '전체') {
            item.classList.add(`${SORT_ACTIVE}`);
            item.setAttribute('aria-selected', true);
          } else {
            item.classList.remove(`${SORT_ACTIVE}`);
            item.removeAttribute('aria-selected');
          }
        })
      }

      if (!oTarget.classList.contains(`${SORT_ACTIVE}`)) {
        const oFilterTranslation = document.querySelector('.cm-filter__tabs__translation');
        const aChildNodes = [...oFilterTranslation.childNodes];
        const oSortWrap = oFilterTranslation.parentElement.querySelector('.cm-filter__tabs__contents');

        aChildNodes.forEach(item => {
          item.nodeName === 'BUTTON' && item.classList.remove(`${SORT_ACTIVE}`);
        });

        if (oDataLang !== oSortWrap.dataset.lang) {
          oSortWrap.setAttribute('data-lang', `${oDataLang}`);
          oChangeLang(oDataLang);
        }
        oTarget.classList.add(`${SORT_ACTIVE}`);
      }
    });

    window.addEventListener('load', () => {
      let oLeftScroll;
      const oCategory = document.querySelector('.cm-filter__category');
      const item = oCategory.querySelector('.cm-filter__category__button--active');
      const oLeft = item.offsetLeft + item.offsetWidth + 15;
      oLeftScroll = oLeft - oWindowWidth;
      oCategory.scrollLeft = oLeftScroll;
    })

    // main_category 주력 카페고리
    this.oFilterMainCategoryButton.forEach(item => {
      item.addEventListener('click', (e) => {
        const welTarget = e.target;
        const oMainCategory = document.querySelector('[data-filter="main_category');
        const oClassName = 'cm-filter__category__button--active';
        const oLeft = item.offsetLeft + item.offsetWidth + 15;
        let oTarget;
        let oLeftScroll;

        oLeftScroll = oLeft - oWindowWidth;
        document.querySelector('.cm-filter__category').scrollLeft = oLeftScroll;

        welTarget.nodeName !== 'BUTTON'
        ? oTarget = welTarget.closest('BUTTON')
        : oTarget = welTarget;

        if (oTarget.classList.contains(`${oClassName}`)) {
          oTarget.classList.remove(`${oClassName}`);
          oMainCategory.style.display = 'none';
        } else {
          this.oFilterMainCategoryButton.forEach(ele => {
            ele.classList.remove(`${oClassName}`);
          });

          oTarget.classList.add(`${oClassName}`);
          oMainCategory.style.display = 'block';
        }
      });
    });
  }

  initFilterContents(item) {
    if (!item) {
      this.oFilterContents.forEach(contents => {
        contents.style.display = 'none';
      });
    } else {
      document.querySelector(`[data-filter=${item}]`).style.display = 'none';
    }
  }

  initResult() {
    const parent = this.oFilterChipsWrap;
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
    this.oFilterResultWrap.style.display = 'none';
  }

  isContains(items, className) {
    return items.some(item => item.classList.contains(className));
  }
}

const filter = new Filter();