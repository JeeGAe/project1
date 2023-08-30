import { isLogin } from './fetch.js'
// 마우스가 네이게이션 헤더영역에서 나가면 드랍다운 메뉴 안보이게함
const header = document.querySelector('header');
header.addEventListener('mouseleave', (event) => {
  header.querySelector('.dropmenu').classList.remove('move-down');
})
// 마우스가 헤더영역에 들어오면 드랍다운 메뉴 보이게함
const mainNav = header.querySelector('.main-nav');
mainNav.addEventListener('mouseover', (event) => {
  if(event.target.className.includes('main-nav-menu')){
    const dropmenu = header.querySelector('.dropmenu');
    dropmenu.classList.add('move-down');
  }
})
// 반응형으로 작은 화면에서 사이드 드랍메뉴를 나타나게함
const miniDropmenu = header.querySelector('.mini-dropbox');
miniDropmenu.addEventListener('click', () => {
  const sideDropmenu = document.querySelector('.side-dropmenu');
  sideDropmenu.classList.toggle('hidden');
})
// 로고 클릭시 메인 페이지로 이동
const mainNavLogo = header.querySelector('.main-nav-logo');
mainNavLogo.addEventListener('click', () => {
  location.href= '/index.html';
})

// 로그인 모달
function modalOpen(event) {
  event.preventDefault();
  document.body.style.overflow = 'hidden'
  const loginModalContainer = document.querySelector('.login-modal-container');
  loginModalContainer.classList.remove('hidden');
  const loginModalCloseBtn = document.querySelector('.login-modal-close-btn');
  const blurContainer = document.querySelector('.blur-container');
  blurContainer.classList.remove('hidden');
  loginModalCloseBtn.addEventListener('click', () => {
    loginModalContainer.classList.add('hidden');
    blurContainer.classList.add('hidden');
    document.body.style.overflow = ''
  })
  
}
// 예약 조회 클릭시 비로그인 상태면 로그인 창 열기
const book_check = document.querySelectorAll('.book-check');
book_check.forEach(book_check => book_check.addEventListener('click', modalOpen));

const navBook = document.querySelector('.nav-book');
navBook.addEventListener('click', (event) => {
  event.preventDefault();
})

// 로그인 버튼 클릭시 로그인 api에 data 전송
const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', event => {
  event.preventDefault();
  const loginForm = document.getElementById('login-form');
  const user_id = loginForm[0].value;
  const user_password = loginForm[1].value;

  fetch('http://127.0.0.1:3301/api/users/login',{
    method: 'POST',
    credentials : "include",
    cache : "no-store",
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify({
      id : user_id,
      password : user_password,
    })
  })
  .then((res) => {
    if(!res.ok){
      const failedLogin = document.getElementById('failed-login');
      failedLogin.innerText = '사용자 정보를 확인해주세요!';
    }else{
      console.log("로그인 응답", document.cookie);
      location.reload();
    }
  })
  .catch((e) => console.log(e))
})
// 비밀번호 인풋 창에서 엔터입력시 로그인버튼 클릭(편의성)
const passwordInput = document.querySelector('#password-input');
passwordInput.addEventListener('keyup', (event) => {
  if(event.key === 'Enter') loginBtn.click();
})


// 로그인 상태면 로그인 상태의 페이지로 변환
isLogin()
.then((res) => {
  if(res){
    // 로그인 했을때 유저의 닉네임을 보여줌
    const loginUserName = document.querySelectorAll('.login-user-name');
    loginUserName.forEach(loginUserName => loginUserName.innerText = `${res}님`);
    // 로그인 상태일때 로그아웃 활성화
    const loginLogout = document.querySelectorAll('.login-logout');
    loginLogout.forEach(loginLogout => loginLogout.innerText = '로그아웃');
    // 로그인 상태면 모달창 대신 예약 조회 페이지로 넘어감
    book_check.forEach(book_check => book_check.removeEventListener('click', modalOpen));
    book_check.forEach(book_check => book_check.addEventListener('click', (event) => {
      event.preventDefault();
      location.href = '/src/html/book.html'
    }));
  }
})

// 로그아웃 버튼 이벤트
const loginLogout = document.querySelectorAll('.login-logout');loginLogout.forEach(loginLogout => loginLogout.addEventListener('click', (event) => {
  event.preventDefault();
  fetch('http://127.0.0.1:3301/api/users/logout', {
    method: 'GET',
    credentials : "include",
    cache : "no-store",
  })
  .then(res => {
    console.log('logout')
    location.href = '/index.html'
  })
  .catch(e => console.log(e));
}))