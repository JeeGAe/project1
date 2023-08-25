const express = require('express');
const router = express.Router();
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../../auth');
const Book = require('../models/Book');
const User = require('../models/User');
const mongoose = require('mongoose');
const { Types : { ObjectId } } = mongoose;

// 예약 api
router.post('/', isAuth, expressAsyncHandler(async (req, res) => {
  const serchReservation = await Book.findOne({ 
    date : new Date(req.body.year, req.body.month, req.body.date +1),
    banquet : req.body.banquet,
    bookAm : req.body.bookAm,
    bookPm : req.body.bookPm,
   })
  if(serchReservation){
    console.log(serchReservation, 'booked')
    res.status(401).json({ code : 401, message : 'booked reservation!'})
  }else{
    const book = new Book({
      date : new Date(req.body.year, req.body.month, req.body.date +1),
      banquet : req.body.banquet,
      bookAm : req.body.bookAm,
      bookPm : req.body.bookPm,
      userId : new ObjectId(req.user._id)
    });
  
    const newBook = await book.save();
  
    if(!newBook){
      res.status(401).json({ code : 401, message : 'Invalid resevation data'});
    }else{
      res.status(200).json({ code : 200, message : 'success booked!'});
    }
  }
}))

// 예약 목록 조회
router.get('/', isAuth, expressAsyncHandler(async (req, res) => {
  const reservation = await Book.find({ userId : req.user._id }).sort( { date : 1 });
  if(!reservation){
    res.status(404).json({ code : 404, message : "not found resevation"});
  }else{
    res.status(200).json({ code : 200, reservation });
  }
}))

// 특정 날짜 예약 목록
router.get('/reservation', expressAsyncHandler(async (req, res) => {
  const reservation = await Book.find({ 
    date : new Date(req.query.year, req.query.month, parseInt(req.query.date) + 1),
    banquet : req.query.banquet,
  })
  res.json({code : 200, reservation});
}))

// 예약 취소
router.delete('/delete', expressAsyncHandler(async (req, res) => {
  console.log(new Date(req.body.year, req.body.month-1, req.body.date+1), req.body.banquet, req.body.bookAm, req.body.bookPm)
  const serchReservation = await Book.findOne({
    date : new Date(req.body.year, req.body.month-1, req.body.date+1),
    banquet : req.body.banquet,
    bookAm : req.body.bookAm,
    bookPm : req.body.bookPm
  })
  if(!serchReservation){
    res.status(401).json({ code : 401 , message : 'Invalid reservation'});
  }else{
    await serchReservation.deleteOne();
    res.status(200).json({ code : 200 , message : 'Delete reservation'})
  }
}))

module.exports = router;