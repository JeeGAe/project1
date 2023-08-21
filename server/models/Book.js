const mongoose = require('mongoose');
const { Types : { ObjectId } } = mongoose;

const BookSchema = new mongoose.Schema({
  date : {
    type : Date,
    require : true,
  },
  banquet : {
    type : String,
    require : true,
  },
  bookAm : {
    type : Boolean,
  },
  BookPm : {
    type : Boolean,
  },
  userId : {
    type : ObjectId,
  },
})

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;