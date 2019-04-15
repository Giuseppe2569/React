var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'inin',
    user: 'root',
    password: '',
});
connection.connect();

router.route('/members')
    .get(function (req, res) {
        // res.send("get")
        connection.query("select * from members", function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .post(function (req, res) {
        var __user = req.body
        connection.query("insert into members set ?", __user, function (error) {
            if (error) throw error;
            res.json({ message: "新增成功" });
        });
    });
router.route('/members/:memEmail')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from members where memEmail=?", req.params.memEmail, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .put(function (req, res) {
        connection.query("update members set ? where memEmail=?", [req.body, req.params.memEmail], function (error) {
            if (error) throw error;
            res.json({ message: "個人資料修改成功" });
        });
    })
    .delete(function (req, res) {
        connection.query("delete from members where memSid=?", req.params.memSid, function (error, results) {
            if (error) throw error;
            res.json({ message: "刪除成功" });
        });
    });

// ---------登入的api---------------
router.route('/login')
    .post((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.send(req.params.id);
        console.log(req.body.memEmail);
        connection.query("SELECT* from members WHERE memEmail=? ",
            [req.body.memEmail], function (error, results) {
                if (error) throw error;
                console.log(results[0]);
                if (results.length == 0) {
                    res.send({
                        message: { message: "此帳號未註冊" }
                    })
                } else if (results[0].memPassword != req.body.memPassword) {
                    res.send({
                        message: { message: "密碼錯誤" }
                    })
                } else if (results[0].memActive == 0) {
                    res.send({
                        message: { message: "此帳號還未驗證" }
                    })
                } else {
                    req.session.isLogin = true;  //存入session
                    // req.session.memSid = results[0].memSid
                    var members = results[0];
                    req.session.members = {
                        memSid: members.memSid,
                        memName: members.memName,
                        memGender: members.memGender,
                        memBirthday: members.memBirthday,
                        memNickname: members.memNickname,
                        memMobile: members.memMobile,
                        memEachSport: members.memEachSport,
                        memFavCity: members.memFavCity,
                        memFavArea: members.memFavArea,
                        memCity: members.memCity,
                        memArea: members.memArea,
                        memAddress: members.memAddress,
                        memImage: members.memImage,
                        memCreate: members.memCreate,
                    }
                    res.json({
                        members,
                        message: { message: "登入成功" },
                        isLogin: true
                    })
                    // console.log(req.session.members.memSid)
                    // res.redirect("/session")
                }
            });
    });


//---------------------註冊的---------------------

router.route('/signUp')
    .post((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.send(req.params.id);
        console.log(req.body.memEmail);
        connection.query("SELECT* from members WHERE memEmail=? ",
            [req.body.memEmail], function (error, results) {
                if (error) throw error;
                console.log(results[0]);
                if (results.length !== 0) {
                    res.send({
                        message: { message: "此帳號已註冊過" }    
                    })
                } else {

                    // ----------------email發送---------------------------
                    var nodemailer = require("nodemailer");
                    //宣告發信物件
                    var transporter = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: "ininsport.tw@gmail.com",
                            pass: "ininsport123"
                        }
                    });

                    var cl = 'http://localhost:3001/memberform/' + req.body.memEmail;
                    var body = `<h2>您好：</h2><h2>本電子郵件為ININ SPORT服務平台所發送，若您未曾進行「ININSPORT註冊帳號」，請您忽略本電子郵件。</h2><h2>感謝你在ININSPORT上面註冊此帳號</h2><h2>請認證信箱，按一下這個連結：</h2><a href="${cl}}">點此跳轉連結</a><h2>請注意：</h2><h2>如果您無法存取這個連結，請將整個 URL 複製並貼到瀏覽器。</h2><h2>ININ團隊敬上</h2>`
                        ;

                    var options = {
                        //寄件者
                        from: "ininsport.tw@gmail.com",
                        //收件者
                        to: req.body.memEmail,

                        //副本
                        // cc: 'ininsport.tw@gmail.com',
                        //密件副本
                        // bcc: 'ininsport.tw@gmail.com',
                        //主旨
                        subject: "歡迎使用 ININ SPORT", // Subject line
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
                        } else {
                            console.log("訊息發送: " + info.response);
                        }
                    });
                    // --------------------------------------

                    connection.query("insert into members set ?", req.body, function (error) {
                        if (error) throw error;
                        res.json({ message: { message: "註冊成功" } });
                    });
                }
            })
    })

//-------------忘記密碼--------------
router.route('/forget')
    .post((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.send(req.params.id);
        console.log(req.body.memEmail);
        connection.query("SELECT* from members WHERE memEmail=? ",
            [req.body.memEmail], function (error, results) {
                if (error) throw error;
                console.log(results[0]);
                if (results.length == 0) {
                    res.send({
                        message: { message: "此帳號未註冊" }
                    })
                }
                else {

                    // ----------------email發送---------------------------
                    var nodemailer = require("nodemailer");
                    //宣告發信物件
                    var transporter = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: "ininsport.tw@gmail.com",
                            pass: "ininsport123"
                        }
                    });

                    var cl = 'http://localhost:3001/passwordReset/' + req.body.memEmail;
                    var body = `<h3>您好：</h3><h3>本電子郵件為ININ SPORT服務平台所發送，若您未曾進行「ININSPORT忘記密碼」，請您忽略本電子郵件。</h3><h3>此信為您申請忘記密碼進行密碼變更之服務</h3><h3>確定要變更密碼，請按一下這個連結：</h3><a href=${cl}>點此跳轉連結</a><h3>請注意：</h3><h3>如果您無法存取這個連結，請將整個 URL 複製並貼到瀏覽器。</h3><h3>ININ團隊敬上</h3>`

                    var options = {
                        //寄件者
                        from: "ininsport.tw@gmail.com",
                        //收件者
                        to: req.body.memEmail,

                        //副本
                        // cc: 'ininsport.tw@gmail.com',
                        //密件副本
                        // bcc: 'ininsport.tw@gmail.com',
                        //主旨
                        subject: "ININ SPROT", // Subject line
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
                        } else {
                            console.log("訊息發送: " + info.response);
                        }
                    });
                    res.json({ message: { message: "信件寄出成功" } });
                }
            })
    })



// -------------登出---------------

router
    .route('/logout')
    .get((req, res) => {
        // console.log(error)
        // req.session.destroy();
        // req.session.isLogin = false;
        res.json("登出成功");
        // return res.redirect("http:localhost:3001/login");

    });


module.exports = router;
