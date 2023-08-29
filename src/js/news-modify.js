const id = location.search.slice(4,location.search.length);
// 해당 공지 불러옴
fetch(`http://127.0.0.1:3301/api/news/detail/${id}`,{
  method : 'GET',
  cache : "no-store",
  headers : {
    'Content-Type' : 'application/json',
  },
})
.catch(e => console.log(e))
.then(res => res.json())
.then(res => {
  // 해당 공지의 제목과 내용을 초기값으로 넣어줌
  const newsModifyTitle = document.querySelector('#news-modify-title');
  const newsModifyDescription = document.querySelector('#news-modify-description');
  newsModifyTitle.value = `${res.searchNews.title}`;
  newsModifyDescription.value = `${res.searchNews.description}`;
})
// 수정 버튼 이벤트
const newsModifyBtn = document.querySelector('#news-modify-btn');
newsModifyBtn.addEventListener('click', event => {
  event.preventDefault();
  const newsModifyTitle = document.querySelector('#news-modify-title');
  const newsModifyDescription = document.querySelector('#news-modify-description');
  // 내용이 있는 경우 수정
  if(!newsModifyTitle.value && !newsModifyDescription.value){
    alert('제목과 내용을 확인해주세요!');
  }else{
    fetch(`http://127.0.0.1:3301/api/news/${id}`,{
      method : 'PUT',
      cache : "no-store",
      credentials : 'include',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        title : newsModifyTitle.value,
        description : newsModifyDescription.value,
      }),
    })
    .catch(e => console.log(e))
    .then(() => location.href = `./news-detail.html?id=${id}`)
  }
})

