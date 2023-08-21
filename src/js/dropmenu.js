const header = document.querySelector('header');
header.addEventListener('mouseleave', (event) => {
  header.lastElementChild.classList.remove('move-down');
})

const mainNav = header.querySelector('.main-nav');
mainNav.addEventListener('mouseover', (event) => {
  if(event.target.className.includes('main-nav-menu')){
    const dropmenu = header.querySelector('.dropmenu');
    dropmenu.classList.add('move-down');
  }
})
