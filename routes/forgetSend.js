var express = require('express');
var router = express.Router();
var mysql = require('mysql');


router
  .route("/:memEmail")
  .get(function (req, res) {

    console.log(req.params.memEmail)
    var nodemailer = require("nodemailer");
    //宣告發信物件
    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ininsport.tw@gmail.com",
        pass: "ininsport123"
      }
    });

    var cl = 'http://localhost:3001/passwordReset/' + req.params.memEmail;
    console.log(' req.params.memEmail:' + req.params.memEmail);
    console.log('cl:' + cl);
    var body = `<h3>您好：</h3><h3>本電子郵件為ININ SPORT服務平台所發送，若您未曾進行「ININSPORT忘記密碼」，請您忽略本電子郵件。</h3><h3>此信為您申請忘記密碼進行密碼變更之服務</h3><h3>確定要變更密碼，請按一下這個連結：</h3><a href=${cl}>點此跳轉連結</a><h3>請注意：</h3><h3>如果您無法存取這個連結，請將整個 URL 複製並貼到瀏覽器。</h3><h3>ININ團隊敬上</h3>`

    var options = {
      //寄件者
      from: "ininsport.tw@gmail.com",
      //收件者
      to: req.params.memEmail,

      //副本
      // cc: 'ininsport.tw@gmail.com',
      //密件副本
      // bcc: 'ininsport.tw@gmail.com',
      //主旨
      subject: "ININ SPORT", // Subject line
      //純文字
      text: "Hello world2", // plaintext body
      //嵌入 html 的內文
      html:
        body
      //附件檔案
      // attachments: [ {
      //     filename: 'text01.txt',
      //     content: '聯候家上去工的調她者壓工，我笑它外有現，血有到同，民由快的重觀在保導然安作但。護見中城備長結現給都看面家銷先然非會生東一無中；內他的下來最書的從人聲觀說的用去生我，生節他活古視心放十壓心急我我們朋吃，毒素一要溫市歷很爾的房用聽調就層樹院少了紀苦客查標地主務所轉，職計急印形。團著先參那害沒造下至算活現興質美是為使！色社影；得良灣......克卻人過朋天點招？不族落過空出著樣家男，去細大如心發有出離問歡馬找事'
      // }, {
      //     filename: 'unnamed.jpg',
      //     path: '/Users/Weiju/Pictures/unnamed.jpg'
      // }]
    };
    console.log(options)
    transporter.sendMail(options, function (error, info) {
      if (error) {
        console.log(error);
        res.send(error)
      } else {
        console.log("訊息發送: " + info.response);
        res.json("重新發送成功");
      }
    });

  });
  
module.exports = router;
