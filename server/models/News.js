const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  id : {
    type : Number,
    require : true,
  },
  title : {
    type : String,
    require : true,
  },
  description : {
    type : String,
    require : true,
  },
})

const News = mongoose.model('New', newsSchema);

module.exports = News;