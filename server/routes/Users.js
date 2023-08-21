const express = require('express');
const router = express.Router();
const User = require('../models/User');
const expressAsyncHandler = require('express-async-handler');
const auth = require('../../auth');
const { createToken, isAuth } = auth;
const jwt = require('jsonwebtoken');
const config = require('../../config');
const cookieparser = require('cookie-parser');


// 회원가입
router.post('/register', expressAsyncHandler(async (req, res, next) => {
  const user = new User({
    id : req.body.id,
    password : req.body.password,
    name : req.body.name,
  })
  
  const newUser = await user.save();
  if(!newUser){
    res.status(401).json({ code : 401, message : 'Invalid User data'});
  }else{
    const { id , name } = newUser;
    res.json({ code : 200, id, name });
  }
}));

// 로그인
router.post('/login', expressAsyncHandler(async (req, res) => {
  const { id, password } = req.body;
  const loginUser = await User.findOne({ id : id, password: password });
  const token = createToken(loginUser);
  console.log(token);
  if(!loginUser){
    res.status(401).send({ code : 401, message : 'Invalid user id or password!'});
  }else{
    res.cookie('Token', token, {
      // secure : false,
      // httpOnly : true,
    });
    res.status(200).json({ code : 200, message : 'Login success!'})
  }
}))

// 로그인 했는지 확인
router.get('/isLogin', isAuth, expressAsyncHandler(async (req, res) => {
  // console.log(req.cookies.Token);
  const { name } = req.user;
  res.status(200).json({ code : 200, message : 'Ok', name });
  // const token = req.cookies.Token;
  // console.log(token);
  // if(!token){
  //   res.status(401).json({ code : 401, message : 'Invalid token'});
  // }else{
  //   jwt.verify(token, config.JWT_SECRET, (err, user) => {
  //     if(err && err.name === 'TokenExpiredError'){
  //       res.status(419).json({ code : 149, message : "Token is expired"});
  //     }else if(err){
  //       res.status(401).json({ code : 401, message: 'Invalid Token'});
  //     }else{
  //       const { name } = user;
  //       res.status(200).json({ code : 200, message : 'Ok', name });
  //     }
  //   })
  // }
}))

// 로그아웃
router.get('/logout', (req, res) => {
  res.clearCookie('Token');
  res.status(200).json({ code : 200, message: 'logout'});
})

module.exports = router;