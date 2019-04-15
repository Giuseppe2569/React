// -------------抓取session的--------------------

// router
//     .use(function(req,res,error){
//         res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
//         res.setHeader("Access-Control-Allow-Credentials","true");
//         if(error) throw error   
//         res.json({
//             memSid : req.session.members.memSid
//         })
//         });
// memName: req.session.members.memName,
            // memGender: req.session.members.memGender,
            // memBirthday:req.session.members.memBirthday,
            // memNickname:req.session.members.memNickname,
            // memMobile:req.session.members.memMobile,
            // memEachSport:req.session.members.memEachSport,
            // memFavCity:req.session.members.memFavCity,
            // memFavArea:req.session.members.memFavArea,
            // memCity:req.session.members.memCity,
            // memArea:req.session.members.memArea,
            // memAddress:req.session.members.memAddress,
            // memImage:req.session.members.memImage,
            // memCreate:req.session.members.memCreate


var express = require("express");
var router = express.Router();
var session = require('express-session');

router.use(function(req, res){
   // res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
   res.setHeader("Access-Control-Allow-Origin","http://localhost:3001");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    req.session.members = {
        isLogin : "true",
        memSid: 1,
       
    }
    console.log(req.session.members)
    console.log(req.session.isLogin)
    res.json({
        isLogin  : req.session.members.isLogin,
        memSid : req.session.members.memSid
          })
  });

  module.exports = router;