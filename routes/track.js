var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $ = require('jQuery');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'inin',
    user: 'root',
    password: '',
});
connection.connect();

router.route('/track')
    .get(function (req, res) {
        // res.send("get")
        connection.query("select * from favstuff", function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .post(function (req, res) {
        var __user = req.body
        connection.query("insert into favstuff set ?", __user, function (error) {
            if (error) throw error;
            res.json({ message: "新增成功" });
        });
    });

router.route('/track/:favSid')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from favstuff where favSid=?", req.params.favSid, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .put(function (req, res) {
        connection.query("update favstuff set ? where favSid=?", [req.body, req.params.favSid], function (error) {
            if (error) throw error;
            res.json({ message: "修改成功" });
        });
    })
    .delete(function (req, res) {
        connection.query("delete from favstuff where favSid=?", req.params.favSid, function (error, results) {
            if (error) throw error;
            res.json({ message: "刪除成功" });
        });
    });

router.route('/check')
    .post((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.send(req.params.id);
        console.log(req.body.memSid);
        console.log(req.body.proNum)
        var __user = req.body
        connection.query("select * from favstuff where memSid=? and proNum=?",
            [req.body.memSid, req.body.proNum], function (error, results) {
                if (error) throw error;
                console.log(results);
                if (results.length != 0) {
                    res.send({
                        message: { message: "你已經追蹤過此商品" }
                    })
                } else {
                    connection.query("insert into favstuff set ?", __user, function (error) {
                        if (error) throw error;
                        res.send({
                            message: { message: "已加入追蹤" }
                        })
                    });
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
        console.log(req.body.claSid)
        var __user = req.body
        connection.query("select * from favstuff where memSid=? and claSid=?",
            [req.body.memSid, req.body.claSid], function (error, results) {
                if (error) throw error;
                console.log(results);
                if (results.length != 0) {
                    res.send({
                        message: { message: "你已經追蹤過此課程" }
                    })
                } else {
                    connection.query("insert into favstuff set ?", __user, function (error) {
                        if (error) throw error;
                        res.send({
                            message: { message: "已加入追蹤" }
                        })
                    });
                }
            }
        );
    });

router.route('/check3')
    .post((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.send(req.params.id);
        console.log(req.body.memSid);
        console.log(req.body.actSid)
        var __user = req.body
        connection.query("select * from favstuff where memSid=? and actSid=?",
            [req.body.memSid, req.body.actSid], function (error, results) {
                if (error) throw error;
                console.log(results);
                if (results.length != 0) {
                    res.send({
                        message: { message: "你已經追蹤過此活動" }
                    })
                } else {
                    connection.query("insert into favstuff set ?", __user, function (error) {
                        if (error) throw error;
                        res.send({
                            message: { message: "已加入追蹤" }
                        })
                    });
                }
            }
        );
    });

router.route('/shop/:memSid')
    .get((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        connection.query("SELECT * FROM favstuff INNER JOIN products ON favstuff.proNum = products.proNum  WHERE memSid = ?",
            req.params.memSid, function (error, results) {
                if (error) throw error;
                res.json(results);
            }
        );
    });

router.route('/cla/:memSid')
    .get((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        connection.query("SELECT * FROM favstuff INNER JOIN class ON favstuff.claSid = class.claSid  WHERE favstuff.memSid = ?",
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
        connection.query("SELECT * FROM favstuff INNER JOIN active ON favstuff.actSid = active.actSid  WHERE favstuff.memSid = ?",
            req.params.memSid, function (error, results) {
                if (error) throw error;
                res.json(results);
            }
        );
    });

module.exports = router;
