const jwt = require('jsonwebtoken');
const config = require('./config');
const mongoose = require('mongoose');
const { Types : { ObjectId } } = mongoose;

function createToken(user){
  return jwt.sign({
    _id : user._id,
    id : user.id,
    name : user.name,
  }, 
  config.JWT_SECRET,
  {
    expiresIn : '1d',
    issuer : 'vesta',
  });
}

function isAuth(req, res, next){
  const token = req.cookies.Token;
  if(!token){
    res.status(401).json({ code : 401, message : 'Invalid token'});
  }else{
    jwt.verify(token, config.JWT_SECRET, (err, user) => {
      if(err && err.name === 'TokenExpiredError'){
        res.status(419).json({ code : 149, message : "Token is expired"});
      }else if(err){
        res.status(401).json({ code : 401, message: 'Invalid Token'});
      }else{
        req.user = user;
        next();
      }
    })
  }
}

module.exports = {
  createToken,
  isAuth,
}