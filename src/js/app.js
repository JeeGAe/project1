import { isLogin } from './fetch.js'

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

// 메인 캐러셀과 인디케이터 움직임 효과
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

// 메인 캐러셀 인디케이터 클릭 효과
mainIndicatorContainer.addEventListener('click', event => {
  if(event.target.className === 'main-indicator'){
    // 모든 인디케이터 하이라이트 제거
    for(let i = 0; i < 5; i++){
      mainIndicatorContainer.children[i].classList.remove('highlight');
    }
    count = event.target.id.slice(15);
    const corouselWidth = mainCarouselContainer.getBoundingClientRect().width;
    mainCarouselContainer.scrollTo({top : 0, left : corouselWidth * count, behavior : 'smooth'});
    mainIndicatorContainer.children[count].classList.add('highlight');
  }
})

// 이벤트 캐러셀과 인디케이터 움직임 효과
setInterval(() => {  
  if(eventCount === 5){
    eventCount = 0;
    // eventCarousel.scrollTo({left : 0, top : 0, behavior : 'smooth'});
    eventIndicatorContainer.children[4].classList.remove('highlight');
  }

  const eventCarouselWidth = eventCarousel.getBoundingClientRect().width;
  eventCarousel.scrollTo({left : eventCarouselWidth * eventCount, top : 0, behavior : 'smooth'});
  
  eventIndicatorContainer.children[eventCount].classList.add('highlight');
  eventIndicatorContainer.children[eventCount - 1]?.classList.remove('highlight');
  eventCount++;
},3000)

// 이벤트 캐러셀 인디케이터 클릭 효과
eventIndicatorContainer.addEventListener('click', event => {
  if(event.target.className === 'event-indicator'){
    // 모든 인디케이터 하이라이트 삭제
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
      // 시간 차를 두어 앞의 display 설정을 바꾸고 애니메이션 효과가 적용 될 수 있도록함 (같이하면 애니메이션 효과 적용안됨)
      setTimeout(() => {
        for(let i = 0; i < 2; i++){
          scrollContentsContainer.children[scrollCount].children[i].classList.remove('scroll-move-down');
          scrollContentsContainer.children[scrollCount].children[i].classList.remove('scroll-move-left');
          scrollContentsContainer.children[scrollCount].children[i].classList.remove('scroll-move-right');
        }
        scrollCount++;
      }, 100)
    }else{
      // 끝까지 내렸을때 푸터가 보이고 스크롤 안내가 사라짐
      const footer = document.querySelector('footer');
      footer.classList.remove('hidden');
      const scrollNoticeContainer = document.querySelector('.scroll-notice-container');
      scrollNoticeContainer.classList.add('hidden');
    }
    
    
  }
})

// 최근 공지 불러옴(최대 5개)
async function fetchNews() {
  let lastNews = [];
  await fetch(`http://127.0.0.1:3301/api/news/last`, {
    method : 'GET',
    cache : "no-store",
    headers : {
      'Content-Type' : 'application/json',
    },
  })
  .then(res => res.json())
  .then(res => {
    lastNews = res.searchNews;
  })
  .catch(e => console.log(e));

  return await new Promise(resolve => resolve({lastNews}));
}

const newsUlTag = document.querySelector('.news ul');
fetchNews()
.then(res => {
  // 불러온 공지를 공지사항 영역에 보여줌(최근 5개만)
  for(let i = 0; i < 5; i++){
    if(res.lastNews[i]){
      const newsLiTag = document.createElement('li');
      newsLiTag.id = res.lastNews[i].id;
      newsLiTag.innerHTML = `
        <a href="./src/html/news-detail.html?id=${res.lastNews[i].id}">${res.lastNews[i].title}</a>
      `;
      newsUlTag.appendChild(newsLiTag);
    }
  }
})

