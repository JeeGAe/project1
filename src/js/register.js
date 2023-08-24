function fetchRegister(user_id, user_password, user_name, isAdmin = false){
  fetch('http://localhost:3301/api/users/register', {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify({
      id : user_id,
      password : user_password,
      name : user_name,
      isAdmin : isAdmin,
    })
  })
  .then(() => window.location = '../../index.html');
}

// form data 받은 후 회원가입 api로 data 전송
const registerBtn = document.querySelector('.register-btn');
registerBtn.addEventListener('click', event => {
  event.preventDefault();
  const registerForm = document.getElementById('register-form');
  const user_id = registerForm[0].value;
  const user_password = registerForm[1].value;
  const user_name = registerForm[2].value;

  if(!user_id.match(/^[A-Za-z0-9]+$/)){
    alert('계정 정보를 확인해주세요!');
    return ;
  }

  fetchRegister(user_id, user_password, user_name);
})

// 관리자 가입 기능 위와 동일한 data를 어드민 암호 확인후 보냄
const registerAdminBtn = document.querySelector('.register-admin-btn');
registerAdminBtn.addEventListener('click', (event) => {
  event.preventDefault();
  // 관리자 가입 클릭시 관리자 암호 작성란 확성화
  const isAdminLiTag = document.querySelector('.isAdmin');
  isAdminLiTag.classList.remove('hidden');
  const isAdminBtn = isAdminLiTag.querySelector('.isAdmin-btn');
  isAdminBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const registerForm = document.getElementById('register-form');
    if(registerForm[5].value !== 'admin'){
      alert('관리자 암호가 잘 못 되었습니다.');
    }else{
      const user_id = registerForm[0].value;
      const user_password = registerForm[1].value;
      const user_name = registerForm[2].value;

      fetchRegister(user_id, user_password, user_name, true);
    }
  })
})