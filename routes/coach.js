var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const multer = require('multer');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'inin',
    user: 'root',
    password: '',
});
connection.connect();

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

router.route('/coach')
    .get(function (req, res) {
        // res.send("get")
        connection.query("select * from coach", function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .post(upload.single('coaImg'), function (req, res) {
        var _user = req.body;
        //將上傳的檔案名稱取出加到_user物件中
        _user.coaImg = req.file.filename
        console.log(_user)
        connection.query("insert into coach set ?", _user, function (error) {
            if (error) throw error;
            res.json({ message: "申請成功" });
        });
    });

router.route('/coach/:memSid')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from coach where memSid=?", req.params.memSid, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .put(function (req, res) {
        connection.query("update coach set ? where coaSid=?", [req.body, req.params.coaSid], function (error) {
            if (error) throw error;
            res.json({ message: "新增成功" });
        });
    })
    .delete(function (req, res) {
        connection.query("delete from products where coaSid=?", req.params.coaSid, function (error, results) {
            if (error) throw error;
            res.json({ message: "刪除成功" });
        });
    });

    router.route('/get')
    .get(function (req, res) {
        // res.send("get")
        connection.query("select * from coach order by `coaSid` DESC limit 1 ", function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })

module.exports = router;
