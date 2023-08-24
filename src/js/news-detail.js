const id = location.search.slice(4,location.search.length);

fetch(`http://127.0.0.1:3301/api/news/detail/${id}`,{
  method : 'GET',
  headers : {
    'Content-Type' : 'application/json',
  },
})
.then(res => res.json())
.then(res => {
  const newsDetailContainer = document.querySelector('.news-detail-container');
  newsDetailContainer.innerHTML = `
  <h2>${res.searchNews.title}</h2>
  <p>${res.searchNews.description}</p>
  <div><a href="./news.html">목록</a></div>
  `
});