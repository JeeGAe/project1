// 현재 news 리스트를 받아서 보여줌
let totalNews = [];
let index = 0;
// 페이지 네이션에 따라 10개 묶음으로 공지리스트 보여줌
function showNews(index, totalNews ,newsList){
  for(let i = 1 * (index * 10); i < (index + 1) * 10; i++){
    if(!totalNews[i]) return ;
    console.log()
    const newsLiTag = document.createElement('li');
    newsLiTag.id = totalNews[i].id;
    newsLiTag.innerHTML = `
    <a href="./news-detail.html?id=${totalNews[i].id}">${totalNews[i].title}</a>
    `;
    newsList.appendChild(newsLiTag);
  }
}
// 공지 리스트를 응답받음
fetch('http://127.0.0.1:3301/api/News', {
  method : 'GET',
  cache : "no-store",
  headers : {
    'Content-Type' : 'application/json',
  },
})
.then(res => res.json())
.then(res => {
  totalNews = res.totalNews;
  // 페이지 넘버 표시 (공지 10개씩 페이지를 나눔)
  let newsPage = parseInt(totalNews.length / 10) + 1;
  if(totalNews.length % 10 === 0) newsPage--;
  const newsListPage = document.querySelector('.news-list-page');
  for(let i = 1; i <= newsPage; i++){
    const newsPageLi = document.createElement('li');
    newsPageLi.innerText = `${i}`;
    if(i === 1) newsPageLi.classList.add('select-page');
    newsListPage.appendChild(newsPageLi);
  }

  // 공지사항 제목 보여줌 페이지당 최대 10개
  const newsList = document.querySelector('.news-list');
  showNews(index, totalNews, newsList);
  // 페이지 넘버를 누르면 다른 공지 보여줌 
  newsListPage.addEventListener('click', event => {
    if(event.target.tagName === 'LI'){
      newsList.innerText = '';
      newsListPage.querySelector('.select-page').classList.remove('select-page');
      event.target.classList.add('select-page');
      index = parseInt(event.target.innerText) - 1;
      showNews(index, totalNews, newsList);
    }
  })
})

// admin 로그인 상태일때 글쓰기 버튼 활성화
fetch('http://127.0.0.1:3301/api/users/isLogin', {
  method : 'GET',
  credentials : 'include',
  cache : "no-store",
  headers : {
    'Content-Type' : 'application/json',
  },
})
.then(res => res.json())
.then(res => {
  if(res.isAdmin){
    const newsListContainer = document.querySelector('.news-list-container');
    const moveNewsWrite = document.createElement('a');
    moveNewsWrite.href = "./news-write.html";
    moveNewsWrite.classList.add('move-news-write');
    moveNewsWrite.innerText = '공지쓰기'
    newsListContainer.appendChild(moveNewsWrite);
  }
})