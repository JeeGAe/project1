// 메인 캐러셀
const mainCarouselContainer = document.querySelector('.main-carousel-container');
const mainIndicatorContainer = document.querySelector('.main-indicator-container');
// 이벤트 캐러셀
const eventCarousel = document.querySelector('.event-carousel');
const eventIndicatorContainer = document.querySelector('.event-indicator-container')

let count = 1;
let eventCount = 1;
// 초기 인디케이터 효과
mainIndicatorContainer.children[count - 1].classList.add('highlight');
eventIndicatorContainer.children[eventCount - 1].classList.add('highlight');
// 브라우저 크기가 바뀌면 스크롤 위치가 잘 못 되는 것을 막음
// setInterval(async () => {
//   // console.dir(mainCarouselContainer);
//   console.log(count)
//   // console.log(mainCarouselContainer.children[count])
//   if(count < 4){
//     mainCarouselContainer.children[count + 1].style.display = 'flex';
//     const corouselWidth = mainCarouselContainer.getBoundingClientRect().width;
//     await mainCarouselContainer.scrollTo({top : 0, left : corouselWidth, behavior : 'smooth'})
//     await setTimeout(() => {
//       mainCarouselContainer.children[count].style.display = 'none';
//       count++;
//       console.log(count); }, 1000);
//   }else{
//     mainCarouselContainer.children[0].style.display = 'flex';
//     const corouselWidth = mainCarouselContainer.getBoundingClientRect().width;
//     mainCarouselContainer.scrollTo(corouselWidth, 0);
//     mainCarouselContainer.scrollTo({top : 0, left : 0, behavior : 'smooth'});
//     await setTimeout(() => mainCarouselContainer.children[4].style.display = 'none', 1000);
//     count = 0;
//   }
// }, 3000);

setInterval(() => {
  if(count === 5){
    count = 0;
    mainIndicatorContainer.children[4].classList.remove('highlight');
  } 
  const corouselWidth = mainCarouselContainer.getBoundingClientRect().width;
  mainCarouselContainer.scrollTo({top : 0, left : corouselWidth * count, behavior : 'smooth'});
  
  mainIndicatorContainer.children[count].classList.add('highlight');
  mainIndicatorContainer.children[count - 1]?.classList.remove('highlight');
  count++;
}, 3000);

// 메인 캐러셀 인디케이터
mainIndicatorContainer.addEventListener('click', event => {
  if(event.target.className === 'main-indicator'){
    for(let i = 0; i < 5; i++){
      mainIndicatorContainer.children[i].classList.remove('highlight');
    }
    count = event.target.id.slice(15);
    const corouselWidth = mainCarouselContainer.getBoundingClientRect().width;
    mainCarouselContainer.scrollTo({top : 0, left : corouselWidth * count, behavior : 'smooth'});
    mainIndicatorContainer.children[count].classList.add('highlight');
  }
})

// 이벤트 캐러셀
setInterval(() => {
  // 캐러셀 영역
  
  if(eventCount === 5){
    eventCount = 0;
    // eventCarousel.scrollTo({left : 0, top : 0, behavior : 'smooth'});
    eventIndicatorContainer.children[4].classList.remove('highlight');
  }
  const eventCarouselWidth = eventCarousel.getBoundingClientRect().width;
  eventCarousel.scrollTo({left : eventCarouselWidth * eventCount, top : 0, behavior : 'smooth'});
  
  // 캐러셀 인디케이터 영역
  eventIndicatorContainer.children[eventCount].classList.add('highlight');
  eventIndicatorContainer.children[eventCount - 1]?.classList.remove('highlight');
  eventCount++;
},3000)

// 이벤트 캐러셀 인디케이터
eventIndicatorContainer.addEventListener('click', event => {
  if(event.target.className === 'event-indicator'){
    for(let i = 0; i < 5; i++){
      eventIndicatorContainer.children[i].classList.remove('highlight');
    }
    eventCount = event.target.id.slice(16, 17);
    const eventCarouselWidth = eventCarousel.getBoundingClientRect().width;
    eventCarousel.scrollTo({ left : eventCarouselWidth * eventCount, top : 0, behavior : 'smooth'});
    eventIndicatorContainer.children[eventCount].classList.add('highlight');
  }
})



// 브라우저 크기가 바뀌었을때 스크롤 위치를 조정
window.addEventListener('resize', () => {
  // 메인 캐러셀 위치 조정
  const carouselWidth = mainCarouselContainer.getBoundingClientRect().width;
  mainCarouselContainer.scrollTo(carouselWidth * (count - 1), 0);
  // 이벤트 캐러셀 위치 조정
  const eventCarousel = document.querySelector('.event-carousel');
  const eventCarouselWidth = eventCarousel.getBoundingClientRect().width;
  eventCarousel.scrollTo(eventCarouselWidth * (eventCount-1), 0);
})

function createScrollImgContent(url, direction){
  const scrollImgContainer = document.createElement('div');
  scrollImgContainer.classList.add('scroll-img-container');
  scrollImgContainer.classList.add(direction);
  scrollImgContainer.innerHTML = `
    <img src=${url} alt="">
  `
}

// 스크롤 시 효과
let scrollCount = 0;
window.addEventListener('scroll', (event) => {
  let scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  if(window.pageYOffset + document.documentElement.clientHeight > scrollHeight - 50){
    const scrollContentsContainer = document.querySelector('.scroll-contents-container');
    if(scrollContentsContainer.children[scrollCount]){
      scrollContentsContainer.children[scrollCount].classList.add('scroll-show');
      setTimeout(() => {
        for(let i = 0; i < 2; i++){
          scrollContentsContainer.children[scrollCount].children[i].classList.remove('scroll-move-down');
          scrollContentsContainer.children[scrollCount].children[i].classList.remove('scroll-move-left');
          scrollContentsContainer.children[scrollCount].children[i].classList.remove('scroll-move-right');
        }
        scrollCount++;
      }, 100)
    }else{
      const footer = document.querySelector('footer');
      footer.classList.remove('hidden');
      const scrollNoticeContainer = document.querySelector('.scroll-notice-container');
      scrollNoticeContainer.classList.add('hidden');
    }
    
    
  }
})
// 로그인 모달
function modalOpen(event) {
  console.log('dasdas')
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
  user_id = loginForm[0].value;
  user_password = loginForm[1].value;

  fetch('http://127.0.0.1:3301/api/users/login',{
    method: 'POST',
    credentials : "include",
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
  .catch((e) => {
    console.log(e)
  })
})
// 로그인 되어있는지 체크후 로그인 페이지를 설정
async function isLogin(){
  let user_name = '';
  if(!document.cookie.includes('Token')) return ;
  await fetch('http://127.0.0.1:3301/api/users/isLogin',{
    method: 'GET',
    credentials : "include",
  })
  .then(res => {
    if(!res.ok){
      console.log('no login');
    }else{
      const loginLogout = document.querySelectorAll('.login-logout');
      loginLogout.forEach(loginLogout => loginLogout.innerText = '로그아웃');
    }
    return res.json();
  })
  .then(res => {
    const { name } = res;
    user_name = name;
    if(name){
      const loginUserName = document.querySelectorAll('.login-user-name');
      loginUserName.forEach(loginUserName => loginUserName.innerText = `${name}님`);
    }
  }).catch(e =>{
    console.log(e)
  })

  return await new Promise(resolve => {
    resolve(user_name);
  })
}

isLogin()
.then((res) => {
  if(res){
    book_check.forEach(book_check => book_check.removeEventListener('click', modalOpen));
    book_check.forEach(book_check => book_check.addEventListener('click', (event) => {
      event.preventDefault();
      location.href = './src/html/book.html'
    }));
  }
})

// 로그아웃 버튼 이벤트
const loginLogout = document.querySelectorAll('.login-logout');loginLogout.forEach(loginLogout => loginLogout.addEventListener('click', (event) => {
  event.preventDefault();
  fetch('http://127.0.0.1:3301/api/users/logout', {
    method: 'GET',
    credentials : "include",
  })
  .then(res => {
    console.log('logout')
    location.reload();
  })
  .catch(e => console.log(e));
}))
// 최근 공지 불러옴
async function fetchNews() {
  let lastNews = [];
  await fetch(`http://127.0.0.1:3301/api/news/last`, {
    method : 'GET',
    headers : {
      'Content-Type' : 'application/json',
    },
  })
  .then(res => res.json())
  .then(res => {
    lastNews = res.searchNews;
  })

  return await new Promise(resolve => resolve({lastNews}));
}

const newsUlTag = document.querySelector('.news ul');
fetchNews()
.then(res => { console.log(res)
  for(i = 0; i < 5; i++){
    if(res){
      const newsLiTag = document.createElement('li');
      newsLiTag.id = res.lastNews[i].id;
      newsLiTag.innerHTML = `
        <a href="">${res.lastNews[i].title}</a>
      `;
      newsUlTag.appendChild(newsLiTag);
    }
  }
})

