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

router.route('/products')
    .get(function (req, res) {
        // res.send("get")
        connection.query("select * from products", function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .post(function (req, res) {
        var __user = req.body
        connection.query("insert into products set ?", __user, function (error) {
            if (error) throw error;
            res.json({ message: "新增成功" });
        });
    });
router.route('/products/:proSid')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from products where proSid=?", req.params.proSid, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .put(function (req, res) {
        connection.query("update products set ? where proSid=?", [req.body, req.params.proSid], function (error) {
            if (error) throw error;
            res.json({ message: "修改成功" });
        });
    })
    .delete(function (req, res) {
        connection.query("delete from products where proSid=?", req.params.proSid, function (error, results) {
            if (error) throw error;
            res.json({ message: "刪除成功" });
        });
    });


router
    .route("/productsPage/:page")
    .get(function (req, res) {
        //先統計總共幾筆資料
        var query = "select count(*) as TotalCount from products where proActive=1";
        var totalCount = 0;
        connection.query(query, function (error, row) {
            if (error) throw error;
            totalCount = row[0].TotalCount;

            //讀出分頁資料
            var LimitNum = 6;   //一次讀取6筆資料
            var startNum = 1;    //從第幾筆開始讀
            if (req.params.page) {
                page = parseInt(req.params.page);
                startNum = (page - 1) * LimitNum;
            }
            var query = "select * from products where proActive=1 limit ? OFFSET ?";
            var params = [LimitNum, startNum];
            query = mysql.format(query, params);
            connection.query(query, function (error, row) {
                if (error) throw error;
                res.json({ "TotalCount": totalCount, "datas": row });
            });
        });
    });


router
    .route("/productsPage2/:page/")
    .get(function (req, res) {
        //先統計總共幾筆資料
        var query = "select count(*) as TotalCount from products where proActive=1";
        var totalCount = 0;
        connection.query(query, function (error, row) {
            if (error) throw error;
            totalCount = row[0].TotalCount;
            
            //讀出分頁資料
            var LimitNum = 16;   //一次讀取8筆資料
            var startNum = 1;    //從第幾筆開始讀
            if (req.params.page) {
                page = parseInt(req.params.page);
                startNum = (page - 1) * LimitNum;
            }
            var query = "select * from products and proActive=1 limit ? OFFSET ?";
            var params = [LimitNum, startNum];
            query = mysql.format(query, params);
            connection.query(query, function (error, row) {
                if (error) throw error;
                res.json({ "TotalCount": totalCount, "datas": row });
            });
        });
    });

    router
    .route("/productsPage2/:page/:proTag")
    .get(function (req, res) {
        //先統計總共幾筆資料
        var query = "select count(*) as TotalCount from products where proTag=? and proActive=1";
        var totalCount = 0;
        connection.query(query, req.params.proTag, function (error, row) {
            if (error) throw error;
            totalCount = row[0].TotalCount;
            console.log(row[0])
            //讀出分頁資料
            var LimitNum = 16;   //一次讀取8筆資料
            var startNum = 1;    //從第幾筆開始讀
            if (req.params.page) {
                page = parseInt(req.params.page);
                startNum = (page - 1) * LimitNum;
            }
            var query = "select * from products where proTag=? and proActive=1 limit ? OFFSET ?";
            var params = [req.params.proTag,LimitNum, startNum];
            query = mysql.format(query, params);
            connection.query(query, function (error, row) {
                if (error) throw error;
                res.json({ "TotalCount": totalCount, "datas": row });
            });
        });
    });
    
    router
    .route("/productsPage2/:page/:proTag")
    .get(function (req, res) {
        //先統計總共幾筆資料
        var query = "select count(*) as TotalCount from products where proTag=? and proActive=1";
        var totalCount = 0;
        connection.query(query, req.params.proTag, function (error, row) {
            if (error) throw error;
            totalCount = row[0].TotalCount;
            console.log(row[0])
            //讀出分頁資料
            var LimitNum = 16;   //一次讀取8筆資料
            var startNum = 1;    //從第幾筆開始讀
            if (req.params.page) {
                page = parseInt(req.params.page);
                startNum = (page - 1) * LimitNum;
            }
            var query = "select * from products where proTag=? and proActive=1 limit ? OFFSET ?";
            var params = [req.params.proTag,LimitNum, startNum];
            query = mysql.format(query, params);
            connection.query(query, function (error, row) {
                if (error) throw error;
                res.json({ "TotalCount": totalCount, "datas": row });
            });
        });
    });
    
    router.route('/check')
    .get(function (req, res) {
        // res.send("get")
        connection.query("select * from count", function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .post(function (req, res) {
        var __user = req.body
        connection.query("insert into count set ?", __user, function (error) {
            if (error) throw error;
            res.json({ message: "新增成功" });
        });
    });
router.route('/check/:checkSid')
    .get(function (req, res) {
        // res.send(req.params.id);
        connection.query("select * from count where checkSid=?", req.params.checkSid, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
    })
    .put(function (req, res) {
        connection.query("update count set ? where checkSid=?", [req.body, req.params.checkSid], function (error) {
            if (error) throw error;
            res.json({ message: "修改成功" });
        });
    })

module.exports = router;
