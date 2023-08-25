// 로그인 했는지 확인후 유저 이름을 반환
async function isLogin(){
  let user_name = '';
  // let isToken = false;
  // 토큰이 없는 경우 패치를 안함
  // if(!document.cookie.includes('Token')) return ;
  // await window.addEventListener('pageshow',  (event) => {
  //   isToken = event.srcElement.cookie.includes('Token');
  //   console.log(isToken)
  // });
  

  await fetch('http://127.0.0.1:3301/api/users/isLogin',{
    method: 'GET',
    credentials : "include",
    cache: "no-store",
  })
  .then(res => {
    return res.json()
  })
  .then(res => {
    const { name } = res;
    user_name = name;
  })
  .catch(e =>{
    console.log(e)
  })

  return await new Promise(resolve => {
    resolve(user_name);
  })
}

export { isLogin, };