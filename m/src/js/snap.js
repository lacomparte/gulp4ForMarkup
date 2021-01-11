// snap JS

import './include/polyfill/nodeListForEach';
import lottie from 'lottie-web';
import like from './include/assets/lottie/snap_like_on.json';
import { ACTIVE } from './include/common/_variables';
import Swiper, { Pagination } from 'swiper';
import {
  popupOpen,
  popupClose,
  toggleClass,
} from './include/common/_helper';

export default class UserSnap {
  constructor() {
    this.init();
  }

  init() {
    this.cacheElement();
    this.setEvent();
  };

  cacheElement() {
    this.listOptionButton = document.querySelectorAll('.snap-list__user .list-option');
    this.dimmed = document.querySelector('.popup-dim');
    this.layerList = document.querySelector('.layer-list');
    this.layerCloseButton = document.querySelector('.layer-list__cancel')
    this.commentWriteBox = document.querySelectorAll('.comment-write__content');
    this.commentWriteButtons = document.querySelectorAll('.comment-write__buttons');
    this.commentOrderBy = document.querySelector('.comment-wrap .comment-header');
    this.commentListOption = document.querySelectorAll('.comment-list__options .list-option');
    this.snapDescription = document.querySelectorAll('.snap-description[data-toggle]');
    this.popupShareButton = document.querySelector('.floating-menu__button[data-popup-open="share"]');
    this.popupShareCloseButton = document.querySelector('.popup-share__close');
    // swiper
    this.swiperElement = document.querySelectorAll('.snap-list__image .snap-image');
    //lottie
    this.likeLottie = document.querySelectorAll('.snap-action__button__like');
  }

  setEvent() {
    // swiper
    this.swiperElement.forEach(oSwiper => {
      oSwiper.addEventListener('load', swiperEvent(oSwiper));
    });

    function swiperEvent (item) {
      Swiper.use([Pagination]);
      const oSwiperPagination = item.parentElement.querySelector('.indicator');
      const oSwiper = new Swiper(item, {
        loop: false,
        pagination: {
          el: oSwiperPagination,
          type: 'fraction',
          renderFraction: function (currentClass, totalClass) {
            return '<strong class="indicator__current ' + currentClass + '"></strong>'
                    + '/' +
                    '<span class="indicator__total ' + totalClass + '"></span>';
          }
        },
      });
    };

    this.likeLottie.forEach(item => {
      const animation = lottie.loadAnimation({
        container: item,
        renderer: 'svg',
        animationData: like,
        autoplay: false,
        loop: false,
      });

      const likeButton = item.parentElement;

      likeButton.addEventListener('click', () => {
        if (animation.currentFrame === 0) {
          animation.setDirection(1);
          animation.play();
        } else {
          animation.setDirection(-1);
          animation.goToAndPlay(1);
        }
      });
    });

    this.listOptionButton.forEach(button => {
      button.addEventListener('click', () => {
        popupOpen(button);
      });
    });

    this.dimmed && this.dimmed.addEventListener('click', (e) => {
      e.stopPropagation();
      popupClose(e);
    });

    this.layerCloseButton && this.layerCloseButton.addEventListener('click', (e) => {
      e.stopPropagation();
      popupClose(e);
    });

    this.popupShareCloseButton && this.popupShareCloseButton.addEventListener('click', (e) => {
      popupClose(e);
    });

    this.popupShareButton && this.popupShareButton.addEventListener('click', () => {
      popupOpen(this.popupShareButton);
    });

    this.commentWriteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();

        if (e.target.outerText === '취소') {
          this.closeTextareaWrap(this.commentWriteBox);
          const oCommentWriteBox = e.target.parentNode.parentNode.parentNode.childNodes;

          oCommentWriteBox.forEach(node => {
            if (node.classList !== undefined) {
              if (node.classList.contains('comment-write__box')) {
                node.childNodes.forEach(node => {
                  if(node.classList !== undefined) {
                    if (node.nodeName === 'TEXTAREA') {
                      node.removeAttribute('placeholder');
                    } else if (node.classList.contains('comment-write__placeholder')) {
                      node.style.display = 'block';
                    }
                  }
                })
              }
            }
          });
        }
      });
    });

    this.commentWriteBox.forEach(commentBox => {
      commentBox.addEventListener('click', (e) => {
        this.openWriteBox(commentBox, this.commentWriteBox, e);
      });
    });

    this.commentOrderBy && this.commentOrderBy.addEventListener('click', (e) => {
      this.commentArrange(e)
    });

    this.snapDescription && this.snapDescription.forEach(desc => {
      desc.addEventListener('click', (e) => {
        toggleClass(e.currentTarget, `${ACTIVE}`);
      });
    });

    this.commentListOption && this.commentListOption.forEach(option => {
      option.addEventListener('click', (e) => {
        this.handleCommentListOption(e);
      })
    })
  }

  openWriteBox(oCommentBox, aCommentWriteBox, e) {
    if (!oCommentBox.classList.contains(`${ACTIVE}`)) {
      this.closeTextareaWrap(aCommentWriteBox);

      oCommentBox.classList.add(`${ACTIVE}`);
      oCommentBox.setAttribute('aria-expanded', true);

      // 다시짜야함
      // plaholder DOM 삭제
      const oPlaceholder = e.currentTarget.childNodes[1].childNodes[1];
      oPlaceholder.style.display = 'none';

      // textarea placeholder 삽입
      const oTarget = e.currentTarget.childNodes[1].childNodes;
      oTarget.forEach(node => {
        if (node.nodeName === 'TEXTAREA') {
          node.setAttribute('placeholder', '댓글을 입력해주세요.');
        }
      });
      // 다시짜야함 끝

      this.toggleTextarea();
    }
  }

  closeTextareaWrap(aCommentWriteBox) {
    // initialize
    aCommentWriteBox.forEach(comment => {
      comment.classList.remove(`${ACTIVE}`);
      comment.setAttribute('aria-expanded', false);
    });

    document.querySelectorAll('.comment-write__textarea').forEach(textarea => {
      textarea.setAttribute('disabled', true);
    });
  }

  toggleTextarea() {
    const oActiveTextarea = document.querySelector('.comment-write__content.active .comment-write__textarea');
    oActiveTextarea.removeAttribute('disabled');
    oActiveTextarea.focus();
  }

  commentArrange(e) {
    const oTargetNode = e.target.nodeName === 'BUTTON' ? e.target : null;
    if (oTargetNode !== null) {
      this.commentOrderBy.querySelectorAll('button').forEach(button => {
        button.classList.remove(`${ACTIVE}`)
      });
      oTargetNode.classList.add(`${ACTIVE}`);
    }
  }

  handleCommentListOption(e) {
    const oTargetNode = e.target.nodeName !== 'button' ? e.target.closest('button') : e.target;
    const oTarget = oTargetNode.closest('div').querySelector('.comment-tooltip');
    if (oTarget.classList.contains(`${ACTIVE}`)) {
      oTarget.classList.remove(`${ACTIVE}`);
    } else {
      document.querySelectorAll('.comment-tooltip').forEach(ele => {
        ele.classList.remove(`${ACTIVE}`);
      });
      oTarget.classList.add(`${ACTIVE}`);
    }
  }
}

const userSnap = new UserSnap();