const express = require('express');
const router = express.Router();
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../../auth');
const Book = require('../models/Book');
const mongoose = require('mongoose');
const { Types : { ObjectId } } = mongoose;

router.post('/', isAuth, expressAsyncHandler(async (req, res) => {
  const book = new Book({
    date : req.body.date,
    banquet : req.body.banquet,
    bookAm : req.body.bookAm,
    bookPm : req.body.bookPm,
    userId : new ObjectId(req.user._id)
  });
  console.log(req.user)

  const newBook = book.save();

  if(!newBook){
    res.status(401).json({ code : 401, message : 'Invalid resevation data'});
  }else{
    res.status(200).json({ code : 200, message : 'success booked!'});
  }
}))


module.exports = router;