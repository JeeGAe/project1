const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const News = require('../models/News');
const expressAsyncHandler = require('express-async-handler');
const { isAuth, isAdmin } = require('../../auth');

router.post('/write', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const searchNews = await News.find({});
  const id = searchNews.length;
  const news = new News({
    id : id,
    title : req.body.title,
    description : req.body.description,
  });

  const saveNews = await news.save();
  if(!saveNews){
    res.status(401).json({ code : 401, message : 'Invalid News'});
  }else{
    res.status(200).json({ code : 200, saveNews })
  }
}))

router.get('/last', expressAsyncHandler(async (req, res) => {
  const totalNews = await News.find({});
  const gteId = totalNews.length - 5;
  const searchNews = await News.find({ 
    id : { "$gte" : gteId }
   }).sort({ id : -1 });
  if(!searchNews){
    res.status(200).json({ code : 200 });
  }else{
    res.status(200).json({ code : 200, searchNews });
  }
}))

router.get('/', expressAsyncHandler(async (req, res) => {
  const totalNews = await News.find({});
  if(!totalNews){
    res.status(200).json({ code : 200 });
  }else{
    res.status(200).json({ code : 200, totalNews });
  }
}))


module.exports = router;