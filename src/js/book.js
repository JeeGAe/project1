// console.log(Date.now());
// console.log((new Date(2023, 8, 21)).getDate());
const now = new Date(Date.now());
let year = now.getFullYear();
let month = now.getMonth();
let selectBanquet = '';
let selectYear = year;
let selectMonth = month;
let selectDate = 0;
let isAm = false;
let isPm = false;

// console.log(new Date(year, month).getDay());
// console.log(new Date(`${year}-${month}`).getDay());

function createCalendar(year, month){
  // 달에 1일 전에 있는 빈 공간 생성
  let firstDay = new Date(year, month).getDay();
  for(i = 0; i < firstDay; i++){
    const spaceDay = document.createElement('td');
    const firstWeek = document.querySelector('#first-week');
    firstWeek.appendChild(spaceDay);
  }
  // 1일 생성
  const firstDate = document.createElement('td');
  firstDate.innerText = '1';
  const firstWeek = document.querySelector('#first-week');
  firstWeek.appendChild(firstDate);

  // 나머지 일 수 채움
  let weekCount = 0;
  for(i = 2; i === (new Date(year, month, i)).getDate(); i++){
    const date = document.createElement('td');
    date.innerText = `${i}`;
    if((new Date(year, month, i)).getDay() === 0){
      const nextWeek = document.createElement('tr');
      document.querySelector('tbody').appendChild(nextWeek);
      weekCount++;
    }
    document.querySelector('tbody').children[weekCount].appendChild(date);
  }
}

createCalendar(year, month);

function clickDate(event){
  if(event.target.tagName === 'TD'){
    const timeSelectorContainer = document.querySelector('.time-selector-container');
    timeSelectorContainer.classList.remove('hidden');
    selectDate = parseInt(event.target.textContent);
    console.log(selectDate);
  }
}

const banquetSelectorContainer = document.querySelector('.banquet-selector-container');
banquetSelectorContainer.addEventListener('click', (event) => {
  
  if(event.target.tagName === 'BUTTON'){
    selectBanquet = event.target.textContent;
    console.log(event.target)
    const bookDate = document.querySelector('tbody');
    console.log(bookDate)
    bookDate.addEventListener('click', clickDate);
  }
})

function bookToServer(event){
  fetch('http://127.0.0.1:3301/api/books', {
    method : 'POST',
    credentials : "include",
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      date : new Date(selectYear, selectMonth, selectDate+1),
      banquet : selectBanquet,
      bookAm : isAm,
      bookPm : isPm,
    })
  })
}

const am_pmContainer = document.querySelector('.am-pm-container');
am_pmContainer.addEventListener('click', (event) => {
  if(event.target.tagName === 'BUTTON'){
    if(event.target.textContent === '오전'){
      isAm = true;
      isPm = false;
    }else{
      isAm = false;
      isPm = true;
    }
    const bookBtn = document.querySelector('#book-btn');
    bookBtn.addEventListener('click', bookToServer);
  }
})