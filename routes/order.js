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

router.route('/order')
    .get(function (req, res) {
        // res.send("get")
        connection.query("select * from orderCheck", function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .post(function (req, res) {
        var __user = req.body
        connection.query("insert into orderCheck set ?", __user, function (error) {
            if (error) throw error;
            res.json({ message: "新增成功" });
        });
    });

router.route('/order/:checkSid')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from orderCheck where checkSid=?", req.params.checkSid, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })

router.route('/last/')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from orderCheck order by checkSid DESC LIMIT  1 ", req.params.checkSid, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })

router.route('/all/:memSid')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from orderCheck where memSid=?", req.params.memSid, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
module.exports = router;