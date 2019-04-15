var express = require('express');
var router = express.Router();
var mysql = require("mysql");
const multer = require('multer');

//建立連線
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inin',
});
// connection.connect();
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

var uploadFolder = 'public/images';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage })



router
  .route("/active_1")
  .get(function (req, res) {  //讀最新一筆資料
    connection.query("SELECT `actSid`, `actName`, `actSport`, `actTimeUp`, `actTimeEnd`, `actCity`, `actArea`, `actAddress`, `plaName`, `actCutoff`, `actPleNum`, `actGender`, `actInfo`, `actImg`, `actActive`, `actCreate`, `actTag`, `active`.`memName` FROM `active` JOIN members ON members.memSid = active.memSid order by `actSid` DESC Limit 1", function (error, rows) {
      if (error) throw error;
      res.json(rows);
    })
  })

router
  .route("/active/:actSid")
  .get(function (req, res) {  //當下那一筆
    connection.query("select * from active where actSid=?", req.params.actSid, function (error, row) {
      if (error) throw error;
      res.json(row);
    });
  })

  .put(function (req, res) {//修改資料
    var _active = req.body;
    var id = req.params.actSid;
    connection.query("update active set ? where actSid=?", [_active, id], function (error) {
      if (error) throw error;
      res.json({ message: "修改成功" });
    })
  })

  .delete(function (req, res) {//刪除資料
    connection.query("delete from active where id=?", req.params.id, function (error) {
      if (error) throw error;
      res.json({ message: "刪除成功" });
    })
  });

router
  .route("/active")
  .get(function (req, res) {//讀所有資料  ~ by `actSid` DESC" ~使資料顯示由新到舊
    connection.query("SELECT `actSid`, `actName`, `actSport`, `actTimeUp`, `actTimeEnd`, `actCity`, `actArea`, `actAddress`, `plaName`, `actCutoff`, `actPleNum`, `actGender`, `actInfo`, `actImg`, `actActive`, `actCreate`, `actTag`, `active`.`memName` FROM `active` JOIN members ON members.memSid = active.memSid where actActive=1 order by `actSid` DESC", function (error, rows) {
      if (error) throw error;
      res.json(rows);
    })
  })

  .post(upload.single('actImg'), function (req, res) {//新增資料
    var _user = req.body;
    //將上傳的檔案名稱取出加到_user物件中
    _user.actImg = req.file.filename
    console.log(_user)
    // users.push(_user);
    connection.query("insert into active set ?", _user, function (error) {
      if (error) throw error;
      res.json({ message: "活動新增完成" });
    })
  });

router
  .route("/active2/:city/:sport")
  .get(function (req, res) {
    var city = req.params.city;
    var sport = req.params.sport;
    connection.query("SELECT `actSid`, `actName`, `actSport`, `actTimeUp`, `actTimeEnd`, `actCity`, `actArea`, `actAddress`, `plaName`, `actCutoff`, `actPleNum`, `actGender`, `actInfo`, `actImg`, `actActive`, `actCreate`, `actTag`, `active`.`memName` FROM `active` JOIN members ON members.memSid = active.memSid Where actCity=? && actSport=? && actActive=1", [city, sport], function (error, rows) {
      if (error) throw error;
      res.json(rows);
    })
  })

//------------------------------
router
  .route("/headeractive")
  .get(function (req, res) {
    connection.query("SELECT * FROM `active` Limit 2 OFFSET 2", function (error, rows) {
      if (error) throw error;
      res.json(rows);
    })
  })


router
  .route("/all/:memSid")
  .get(function (req, res) {  //當下那一筆
    connection.query("select * from active where memSid=? and actActive=1", req.params.memSid, function (error, row) {
      if (error) throw error;
      res.json(row);
    });
  })

module.exports = router;