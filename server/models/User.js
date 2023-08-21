const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id : {
    type : String,
    require : true,
    unique : true,
  },
  password : {
    type : String,
    require : true,
  },
  name : {
    type : String,
    require : true,
  }
})

const User = mongoose.model('User', userSchema);
module.exports = User;