
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
function afterBanquetSelect(){
  const afterBanquetSelectPTag = document.querySelector('#after-banquet-select');
  afterBanquetSelectPTag.innerText = '연회장을 먼저 선택해주세요!'
}

const tbody = document.querySelector('tbody');
tbody.addEventListener('click', afterBanquetSelect);

function clickDate(event){
  if(event.target.tagName === 'TD' && event.target.textContent){
    const dateTds = document.querySelectorAll('tbody tr td');
    dateTds.forEach(td => {
      td.classList.remove('select-date');
    })
    event.target.classList.add('select-date');
    const timeSelectorContainer = document.querySelector('.time-selector-container');
    timeSelectorContainer.classList.remove('hidden');
    timeSelectorContainer.querySelectorAll('button').forEach(button => {
      button.classList.remove('impossible');
      button.disabled = false;
    })
    selectDate = parseInt(event.target.textContent);
    document.querySelectorAll('.am-pm-container button').forEach(btn => {
      if(!btn.className.includes('impossible')){
        btn.classList.remove('select-time');
      }
    });
    fetch(`http://127.0.0.1:3301/api/books/reservation?year=${selectYear}&month=${selectMonth}&date=${selectDate}`, {
      method : 'GET',
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      if(res.reservation.length === 1){
        if(res.reservation[0].bookAm){
          const amBtn = document.querySelector('#am-btn');
          amBtn.classList.add('impossible');
          amBtn.disabled = true;
        }else{
          const pmBtn = document.querySelector('#pm-btn');
          pmBtn.classList.add('impossible');
          pmBtn.disabled = true;
        }
      }else if(res.reservation.length === 2){
        const amBtn = document.querySelector('#am-btn');
        amBtn.classList.add('impossible');
        amBtn.disabled = true;
        const pmBtn = document.querySelector('#pm-btn');
        pmBtn.classList.add('impossible');
        pmBtn.disabled = true;
      }
        
      
    })
  }
}

const banquetSelectorContainer = document.querySelector('.banquet-selector-container');
banquetSelectorContainer.addEventListener('click', (event) => {
  
  if(event.target.tagName === 'BUTTON'){
    const afterBanquetSelectPTag = document.querySelector('#after-banquet-select');
    afterBanquetSelectPTag.innerText = '';
    tbody.removeEventListener('click', afterBanquetSelect);
    const banquetBtns = document.querySelectorAll('.banquet-selector-container button');
    banquetBtns.forEach(btn => {
      btn.classList.remove('select-banquet');
    });
    event.target.classList.add('select-banquet');
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
    am_pmContainer.querySelectorAll('button').forEach(btn => {
      if(!btn.className.includes('impossible')){
        btn.classList.remove('select-time');
      }
    });
    event.target.classList.add('select-time');
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
// 예약 목록 패치
fetch('http://127.0.0.1:3301/api/books', {
  method : 'GET',
  credentials : "include",
})
.then(res => res.json())
.then(res => {
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
        <p>${res.reservation[i].date.slice(0, 10)}  ${res.reservation[i].banquet}  ${bookTime}</p><button>예약취소</button>
      `;
      const bookedContaier = document.querySelector('.booked-contaier');
      bookedContaier.appendChild(reservationList);
    }
  }
  
})

const bookedContaier = document.querySelector('.booked-contaier');
bookedContaier.addEventListener('click', (event) => {
  if(event.target.tagName = 'BUTTON'){
    const delReservation = event.target.previousSibling;
    const delYear = parseInt(delReservation.innerText.slice(0,4));
    const delMonth = parseInt(delReservation.innerText.slice(5,7));
    const delDate = parseInt(delReservation.innerText.slice(8,10));
    const delBanquet = delReservation.innerText.slice(11, delReservation.innerText.length-3);
    const dleTime = delReservation.innerText.slice(delReservation.innerText.length-2,delReservation.innerText.lengths);
    let isAm = false;
    let isPm = false
    if(dleTime === '오전'){
      isAm = true;
    }else{
      isPm = true;
    }
    fetch('http://127.0.0.1:3301/api/books/delete', {
      method : 'DELETE',
      headers : {
        'Content-Type' : 'Application/json',
      },
      body : JSON.stringify({
        year : delYear,
        month : delMonth,
        date : delDate,
        banquet : delBanquet,
        bookAm : isAm,
        bookPm : isPm,
      })
    })
    .then(res => location.reload())
  }
})

