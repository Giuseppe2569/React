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
  // port:8889
});

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
  .route("/class_1")
  .get(function (req, res) {//讀最新一筆資料
    connection.query("SELECT `claSid`,`claName`,`claSport`,`claTimeUp`,`claTimeEnd`,`claGender`,`claCost`,`claCutoff`,`claPleNum`,`claCity`,`claArea`,`claAddress`,`plaName`,`claInfo`,`claImg`,`claActive`,`claCreate`,`claTag`, members.`memName` FROM `class` INNER JOIN `members` ON `class`.`memSid` = `members`.`memSid` order by `claSid` DESC Limit 1", function (error, rows) {
      if (error) throw error;
      res.json(rows);
    })
  })


router
  .route("/class/:claSid")
  .get(function (req, res) { //當下那一筆
    connection.query("SELECT `claSid`,`claName`,`claSport`,`claTimeUp`,`claTimeEnd`,`claGender`,`claCost`,`claCutoff`,`claPleNum`,`claCity`,`claArea`,`claAddress`,`plaName`,`claInfo`,`claImg`,`claActive`,`claCreate`,`claTag`, `coach`.`memName`,`coaSid`, `coaIdNum`, `coaEdu`, `coaMaj`, `coaSport`, `coaLicense`, `coaInfo`, `coaImg` FROM `class` RIGHT JOIN  `coach`  ON `class`.`memSid`=`coach`.`memSid`  WHERE `claSid`=? ", req.params.claSid, function (error, row) {
      if (error) throw error;
      res.json(row);
    });
  })

  .put(function (req, res) {//修改資料
    var _class = req.body;
    var id = req.params.claSid;
    connection.query("update class set ? where claSid=?", [_class, id], function (error) {
      if (error) throw error;
      res.json({ message: "修改成功" });
    })
  })

  .delete(function (req, res) {//刪除資料
    connection.query("delete from class where id=?", req.params.id, function (error) {
      if (error) throw error;
      res.json({ message: "刪除成功" });
    })
  });

router
  .route("/class")
  .get(function (req, res) {//讀所有資料  ~ by `claSid` DESC" ~使資料顯示由新到舊
    connection.query("SELECT `claSid`,`claName`,`claSport`,`claTimeUp`,`claTimeEnd`,`claGender`,`claCost`,`claCutoff`,`claPleNum`,`claCity`,`claArea`,`claAddress`,`plaName`,`claInfo`,`claImg`,`claActive`,`claCreate`,`claTag`, `members`.`memName` FROM `class` INNER JOIN `members` ON `class`.`memSid` = `members`.`memSid` where claActive=1 order by `claSid` DESC", function (error, rows) {
      if (error) throw error;
      res.json(rows);
    })
  })

  .post(upload.single('claImg'), function (req, res) {//新增資料
    var _user = req.body;
    //將上傳的檔案名稱取出加到_user物件中
    _user.claImg = req.file.filename
    console.log(_user)
    connection.query("insert into class set ?", _user, function (error) {
      if (error) throw error;
      res.json({ message: "開課成功" });
    })
  });

router
  .route("/class2/:city/:sport")
  .get(function (req, res) {
    var city = req.params.city;
    var sport = req.params.sport;
    connection.query("SELECT `claSid`,`claName`,`claSport`,`claTimeUp`,`claTimeEnd`,`claGender`,`claCost`,`claCutoff`,`claPleNum`,`claCity`,`claArea`,`claAddress`,`plaName`,`claInfo`,`claImg`,`claActive`,`claCreate`,`claTag`, `members`.`memName` FROM `class` INNER JOIN `members` ON `class`.`memSid` = `members`.`memSid` Where claCity=? && claSport=? && claActive=1", [city, sport], function (error, rows) {
      if (error) throw error;
      res.json(rows);
    })
  })

//-------------------------------

router
  .route("/headerclass")
  .get(function (req, res) {
    connection.query("SELECT * FROM `class` Limit 2 OFFSET 9", function (error, rows) {
      if (error) throw error;
      res.json(rows);
    })
  })

  router
  .route("/all/:memSid")
  .get(function (req, res) {  //當下那一筆
    connection.query("select * from class where memSid=? and claActive=1", req.params.memSid, function (error, row) {
      if (error) throw error;
      res.json(row);
    });
  })

module.exports = router;