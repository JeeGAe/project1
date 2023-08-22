const header = document.querySelector('header');
header.addEventListener('mouseleave', (event) => {
  header.querySelector('.dropmenu').classList.remove('move-down');
})

const mainNav = header.querySelector('.main-nav');
mainNav.addEventListener('mouseover', (event) => {
  if(event.target.className.includes('main-nav-menu')){
    const dropmenu = header.querySelector('.dropmenu');
    dropmenu.classList.add('move-down');
  }
})

const miniDropmenu = header.querySelector('.mini-dropbox');
miniDropmenu.addEventListener('click', () => {
  const sideDropmenu = document.querySelector('.side-dropmenu');
  sideDropmenu.classList.toggle('hidden');
})

const mainNavLogo = header.querySelector('.main-nav-logo');
mainNavLogo.addEventListener('click', () => {
  location.href= '/index.html';
})