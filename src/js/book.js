
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
  const timeSelectorContainer = document.querySelector('.time-selector-container');
  timeSelectorContainer.classList.add('hidden');
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
// 연회룸을 선택하기전에 날짜를 누르면 나타나는 이벤트
function afterBanquetSelect(){
  const afterBanquetSelectPTag = document.querySelector('#after-banquet-select');
  afterBanquetSelectPTag.innerText = '연회장을 먼저 선택해주세요!'
}

const tbody = document.querySelector('tbody');
tbody.addEventListener('click', afterBanquetSelect);
// 날짜 선택시의 함수
function clickDate(event){
  if(event.target.tagName === 'TD' && event.target.textContent){
    // 이전 선택 날짜 하이라이트 초기화 후 현재 하이라이트
    const dateTds = document.querySelectorAll('tbody tr td');
    dateTds.forEach(td => {
      td.classList.remove('select-date');
    })
    event.target.classList.add('select-date');
    // 시간 선택 버튼 보여줌
    const timeSelectorContainer = document.querySelector('.time-selector-container');
    timeSelectorContainer.classList.remove('hidden');
    // 이전 시간 이미예약된 하이라이트, 효과 초기화
    timeSelectorContainer.querySelectorAll('button').forEach(button => {
      button.classList.remove('impossible');
      button.disabled = false;
      button.classList.remove('select-time');
    })
    selectDate = parseInt(event.target.textContent);
    // 이전 선택한 시간 하이라이트 초기화
    // document.querySelectorAll('.am-pm-container button').forEach(btn => {
    //   if(!btn.className.includes('impossible')){
    //     btn.classList.remove('select-time');
    //   }
    // });
    // 예약 불가인 지점에 하이라이트, 클릭불가 효과 추가
    fetch(`http://127.0.0.1:3301/api/books/reservation?year=${selectYear}&month=${selectMonth}&date=${selectDate}&banquet=${selectBanquet}`, {
      method : 'GET',
    })
    .then(res => res.json())
    .then(res => {
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
// 연회룸 선택시 이벤트
const banquetSelectorContainer = document.querySelector('.banquet-selector-container');
banquetSelectorContainer.addEventListener('click', (event) => {
  if(event.target.tagName === 'BUTTON'){
    // 연회룸 클릭시 오전 오후 선택 숨김
    const timeSelectorContainer = document.querySelector('.time-selector-container');
    timeSelectorContainer.classList.add('hidden');
    // 연회룸 클릭시 날짜에 하이라이트 효과 사라짐
    const dateTds = document.querySelectorAll('tbody tr td');
    dateTds.forEach(td => {
      td.classList.remove('select-date');
    });
    // 연회룸 전에 날짜를 눌렀을때 멘트 삭제
    const afterBanquetSelectPTag = document.querySelector('#after-banquet-select');
    afterBanquetSelectPTag.innerText = '';
    tbody.removeEventListener('click', afterBanquetSelect);
    // 연회룸 선택시 날짜를 선택 가능하게함
    const banquetBtns = document.querySelectorAll('.banquet-selector-container button');
    banquetBtns.forEach(btn => {
      btn.classList.remove('select-banquet');
    });
    event.target.classList.add('select-banquet');
    selectBanquet = event.target.textContent;
    const bookDate = document.querySelector('tbody');
    bookDate.addEventListener('click', clickDate);
  }
})
// 예약하기 버튼 클릭시 서버에 예약 데이터 보냄
function bookToServer(event){
  fetch('http://127.0.0.1:3301/api/books', {
    method : 'POST',
    credentials : "include",
    headers : {
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({
      year : selectYear,
      month : selectMonth,
      date : selectDate,
      banquet : selectBanquet,
      bookAm : isAm,
      bookPm : isPm,
    })
  })
  .then((res) => { location.reload();})
}
// 오전 오후 중 선택하면 예약하기 버튼 이벤트 활성화
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
// 예약 목록 조회
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
// 예약 목록 삭제
const bookedContaier = document.querySelector('.booked-contaier');
bookedContaier.addEventListener('click', (event) => {
  if(event.target.tagName = 'BUTTON'){
    const delReservation = event.target.previousSibling;
    const total = delReservation.innerText.slice(0,10);
    const delYear = parseInt(delReservation.innerText.slice(0,4));
    const delMonth = parseInt(delReservation.innerText.slice(5,7));
    const delDate = parseInt(delReservation.innerText.slice(8,10));
    const delBanquet = delReservation.innerText.slice(11, delReservation.innerText.length-3);
    const dleTime = delReservation.innerText.slice(delReservation.innerText.length-2,delReservation.innerText.lengths);
    let isAm = false;
    let isPm = false;
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
        total : total,
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

