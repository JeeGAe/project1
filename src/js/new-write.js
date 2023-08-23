const newsWriteBtn = document.querySelector('.news-write-btn');
newsWriteBtn.addEventListener('click', event => {
  event.preventDefault();
  const newsWriteForm = document.querySelector('.news-form-container form');
  const title = newsWriteForm[0].value;
  const description = newsWriteForm[1].value;
  if(!title && !description){
    alert('제목과 내용을 확인해주세요!')
  }else{
    fetch('http://127.0.0.1:3301/api/news/write', {
      method : 'POST',
      credentials : 'include',
      headers : {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({
        title : title,
        description : description,
      })
    })
    .then(() => { location.href = '../html/news.html'})
  }
})