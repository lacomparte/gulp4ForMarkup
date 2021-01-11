// Popup js

/*
* 대상 팝업
* - class="popup"
* - data-popup=“name” // name : 팝업 고유 이름
* 
* 팝업 호출 버튼
* - class="_clickPopupOpen"
* - data-popup-open=“name” // name : 팝업 고유 이름
* 
* 팝업 닫는 버튼
* - class="_clickPopupClose"
* 
* 함수로 호출 시
* - popupOpen(‘name’); // name : 팝업 고유 이름
* 
* 닫는 함수
* - popupClose();
*/

var body = document.querySelector('body');
var scrollTop;

// Triggers
document.querySelectorAll('._clickPopupOpen').forEach(item => {
  item.addEventListener('click', () => {
    popupOpen(item.getAttribute('data-popup-open'));
  })
})

// Triggers close
document.querySelectorAll('._clickPopupClose').forEach(item => {
  item.addEventListener('click', () => {
    popupClose();
  })
})

// Open popup
function popupOpen(popupName) {
  scrollTop = window.scrollY;
  body.classList.add('is--fixed');
  body.style.top = -scrollTop + 'px';
  document.querySelector('.popup-dimm').classList.add('active');
  document.querySelector('.popup[data-popup="' + popupName + '"]').classList.add('active');
}

// Close popup
function popupClose() {
  body.classList.remove('is--fixed');
  body.style.top = '';
  window.scrollTo(0, scrollTop);
  document.querySelector('.popup-dimm').classList.remove('active');
  document.querySelector('.popup.active').classList.remove('active');
}