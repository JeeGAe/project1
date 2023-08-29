const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const News = require('../models/News');
const expressAsyncHandler = require('express-async-handler');
const { isAuth, isAdmin } = require('../../auth');
// 공지 작성 api
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
// 마지막 공지에서 5개를 보내줌
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
// 공지 전체를 보내줌
router.get('/', expressAsyncHandler(async (req, res) => {
  const totalNews = await News.find({}).sort({ id : -1 });
  if(!totalNews){
    res.status(200).json({ code : 200 });
  }else{
    res.status(200).json({ code : 200, totalNews });
  }
}))
// 특정 아이디의 공지 조회
router.get('/detail/:id', expressAsyncHandler(async (req, res) => {
  const searchNews = await News.findOne({ id : req.params.id });
  if(!searchNews){
    res.status(404).json({ code : 404, message : 'Not found message'});
  }else{
    res.status(200).json({ searchNews });
  }
}))
// 공지 수정 api
router.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const searchNews = await News.findOne({ id : req.params.id });
  
  if(!searchNews){
    res.status(404).json({ code : 404, message : 'Not found news'});
  }else{
    searchNews.title = req.body.title || searchNews.title;
    searchNews.description = req.body.description || searchNews.description;

    const updateNews = await searchNews.save();
    if(!updateNews){
      res.status(401).json({ code : 401, message : 'Invalid News'});
    }else{
      res.status(200).json({ code : 200, message : 'Modify success!'});
    }
  }
}))

module.exports = router;