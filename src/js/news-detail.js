const id = location.search.slice(4,location.search.length);
// 특정 아이디의 공지를 불러옴
fetch(`http://127.0.0.1:3301/api/news/detail/${id}`,{
  method : 'GET',
  cache : "no-store",
  headers : {
    'Content-Type' : 'application/json',
  },
})
.then(res => res.json())
.then(res => {
  // 불러온 공지의 제목과 내용을 보여줌
  const newsDetailContainer = document.querySelector('.news-detail-container');
  newsDetailContainer.innerHTML = `
  <h2>${res.searchNews.title}</h2>
  <p>${res.searchNews.description}</p>
  <div><a href="./news.html">목록</a></div>
  <div class="news-modify-btn-container"></div>
  `
})
.then(() => {
  // admin 로그인 상태일때 수정 버튼 활성화
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
      const newsModifyBtnContainer = document.querySelector('.news-modify-btn-container');
      const moveNewsModify = document.createElement('a');
      moveNewsModify.href = `./news-modify.html?id=${id}`;
      moveNewsModify.innerText = '수정'
      newsModifyBtnContainer.appendChild(moveNewsModify);
    }
  })
})

