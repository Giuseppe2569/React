var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'inin',
    user: 'root',
    password: '',
});
connection.connect();

router.route('/join')
    .get(function (req, res) {
        // res.send("get")
        connection.query("select * from ininjoin", function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .post(function (req, res) {
        var __user = req.body
        connection.query("insert into ininjoin set ?", __user, function (error) {
            if (error) throw error;
            res.json({ message: "新增成功" });
        });
    });
router.route('/join/:inSid')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from ininjoin where inSid=?", req.params.inSid, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .delete(function (req, res) {
        connection.query("delete from ininjoin where inSid=?", req.params.inSid, function (error, results) {
            if (error) throw error;
            res.json({ message: "刪除成功" });
        });
    });

router.route('/check')
    .post((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        console.log(req.body.memSid);
        console.log(req.body.claSid)
        connection.query("select * from ininjoin where memSid=? and claSid=?",
            [req.body.memSid, req.body.claSid], function (error, results) {
                if (error) throw error;
                console.log(results);
                if (results.length != 0) {
                    res.send({
                        message: { message: "你已經參加過此課程" }
                    })
                } else {
                    res.send({
                        message: { message: "參加" }
                    })
                }
            }

        );
    });

router.route('/check2')
    .post((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.send(req.params.id);
        console.log(req.body.memSid);
        console.log(req.body.actSid)
        var __user = req.body
        connection.query("select * from ininjoin where memSid=? and actSid=?",
            [req.body.memSid, req.body.actSid], function (error, results) {
                if (error) throw error;
                console.log(results);
                if (results.length != 0) {
                    res.send({
                        message: { message: "你已經參加過此活動" }
                    })
                } else {
                    connection.query("insert into ininjoin set ?", __user, function (error) {
                        if (error) throw error;
                        res.send({
                            message: { message: "活動參加完成" }
                        })
                    });
                }
            }
        );
    });


router.route('/last/')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from ininjoin Right JOIN class ON ininjoin.claSid = class.claSid order by inSid DESC LIMIT  1 ", function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })

router.route('/cla/:memSid')
    .get((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        connection.query("SELECT * FROM ininjoin Right JOIN class ON ininjoin.claSid = class.claSid  WHERE ininjoin.memSid = ?",
            req.params.memSid, function (error, results) {
                if (error) throw error;
                res.json(results);
            }
        );
    });

router.route('/act/:memSid')
    .get((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        connection.query("SELECT * FROM ininjoin Right JOIN active ON ininjoin.actSid = active.actSid  WHERE ininjoin.memSid = ?",
            req.params.memSid, function (error, results) {
                if (error) throw error;
                res.json(results);
            }
        );
    });



module.exports = router;