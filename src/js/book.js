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
// 초기 년도와 월을 현재 기준으로 표기
const changeMonth = document.querySelector('h4');
changeMonth.innerText = `${year}-${month+1}`;

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
// 연도와 월 옆 화살표로 월 단위 변경
const chageMonth = document.querySelector('.chage-month');
chageMonth.addEventListener('click', (event) => {
  if(event.target.className === 'prev-month'){
    selectMonth--;
    if(selectMonth < 0){
      selectMonth = 11;
      selectYear--;
    }
    changeMonth.innerText = `${selectYear}-${selectMonth+1}`;
    document.querySelector('tbody').innerHTML = '<tr id="first-week"></tr>';
    createCalendar(selectYear, selectMonth);
  }else if(event.target.className === 'next-month'){
    selectMonth++;
    if(selectMonth > 11){
      selectMonth = 0;
      selectYear++;
    }
    changeMonth.innerText = `${selectYear}-${selectMonth+1}`;
    document.querySelector('tbody').innerHTML = '<tr id="first-week"></tr>';
    createCalendar(selectYear, selectMonth);
  }
})
// 예약 캘린터에서 일 수를 클릭했을때 이벤트
function clickDate(event){
  if(event.target.tagName === 'TD'){
    const timeSelectorContainer = document.querySelector('.time-selector-container');
    timeSelectorContainer.classList.remove('hidden');
    selectDate = parseInt(event.target.textContent);
    console.log(selectDate);
    fetch(`http://127.0.0.1:3301/api/books/reservation?year=${selectYear}&month=${selectMonth}&date=${selectDate}`, {
      method : 'GET',
    })
    .then(res => res.json())
    .then(res => {
      if(res.reservation.length === 1){
        if(res.reservation.isAm){
          const amBtn = document.querySelector('#am-btn');
          amBtn.style.backgroundColor = 'red';
          amBtn.disabled = true;
        }else{
          const pmBtn = document.querySelector('#pm-btn');
          pmBtn.style.backgroundColor = 'red';
          pmBtn.disabled = true;
        }
      }else if(res.reservation.length === 2){
        const amBtn = document.querySelector('#am-btn');
        amBtn.style.backgroundColor = 'red';
        amBtn.disabled = true;
        const pmBtn = document.querySelector('#pm-btn');
        pmBtn.style.backgroundColor = 'red';
        pmBtn.disabled = true;
      }
        
      
    })
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
  .then((res) => { location.reload();})
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

fetch('http://127.0.0.1:3301/api/books', {
  method : 'GET',
  credentials : "include",
})
.then(res => res.json())
.then(res => {
  console.log(res.reservation);
  if(res.reservation){
    for(i = 0; i < res.reservation.length; i++){
      let bookTime = ''
      if(res.reservation[i].bookAm){
        bookTime = '오전';
      }else{
        bookTime = '오후';
      }
      const reservationList = document.createElement('div');
      reservationList.innerHTML = `
        <p>${res.reservation[i].date.slice(0, 10)}  ${res.reservation[i].banquet}  ${bookTime}</p>
      `;
      const bookedContaier = document.querySelector('.booked-contaier');
      bookedContaier.appendChild(reservationList);
    }
  }
  
})