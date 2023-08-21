// form data 받은 후 회원가입 api로 data 전송
const registerBtn = document.querySelector('.register-btn');
registerBtn.addEventListener('click', event => {
  event.preventDefault();
  const registerForm = document.getElementById('register=form');
  const user_id = registerForm[0].value;
  const user_password = registerForm[1].value;
  const user_name = registerForm[2].value;

  fetch('http://localhost:3301/api/users/register', {
    method : 'POST',
    headers : {
      'Content-Type' : 'application/json',
    },
    body : JSON.stringify({
      id : user_id,
      password : user_password,
      name : user_name,
    })
  }).then(() => window.location = '../../index.html');

})