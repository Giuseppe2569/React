var express = require('express');
var router = express.Router();
var mysql  = require('mysql');

var connection = mysql.createConnection({
    host:'localhost',
    database:'inin',
    user:'root',
    password:'',
});
connection.connect();

router.route('/place')
    .get(function(req,res){
        // res.send("get")
        connection.query("select * from place",function(error, results){
            if(error) throw error;
            res.json(results);
        });
    })
    .post(function(req,res){
        var __user = req.body
        connection.query("insert into place set ?", __user, function(error){
            if(error) throw error;
            res.json({message:"新增成功"});
        });
    });
router.route('/place/:plaSport')
    .get(function(req,res){
        // res.send(req.params.id);
        connection.query("select * from place where plaSport=?", req.params.plaSport ,function(error, results){
            if(error) throw error;
            res.json(results);
        });
    })
 
    
module.exports = router;