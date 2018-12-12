var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// 建立連線
var connection = mysql.createConnection({
    host: "192.168.24.140",
    user: 'keith77377',
    password: '',
    database: 'escapebar_proj'
});

connection.connect(err =>{
    if(err) { return err;}
});

router.route('/memberInfo')
      .get(function(req,res){
        connection.query("select * from `member`", function(error,results,fields){
          if(error){
            throw error;
          }
          res.json(results);
        })
      })

router.route('/memberInfo/:id')
      .get(function(req,res){
        connection.query("select * from `member` where uid=?", req.params.id, function(error, results){
          if(error) throw error;
          res.json(results);
        })
      })

module.exports = router;