const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

// const SELECT_ALL_STORES_QUERY = "SELECT * FROM markers";



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'mick',
    password: '5678',
    database: 'escapebar_proj'
})

connection.connect(err =>{
    if(err) { return err;}
});

console.log(connection);

app.use(cors());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 預設查詢全臺灣場館
app.get('/city/', (req, res, next) => {
    connection.query("SELECT * FROM markers", (err, results)=>{
        if(err){
            return res.send(err)
        } else {
            return res.json({
                data:results
            })
        }
    });
});

// 以縣市篩選查詢場館
app.get('/city/:id', (req, res, next) => {
    connection.query("SELECT * FROM markers WHERE city_id=?", req.params.id, (err, results)=>{
        if(err){return res.send(err)};
        return res.json({
            data:results
        })
    });
});

// 以關鍵字查詢場館名稱欄位
app.get('/name/:keyword', (req, res, next) => {
    connection.query("SELECT * FROM markers WHERE s_name LIKE ?", '%'+req.params.keyword+'%', (err, results)=>{
        if(err){
            return res.send(err)
        } else {
            return res.json({
                data:results
            })
        }
    });
});

// 查詢某個場館下的遊戲，欄位包含遊戲ID、遊戲名稱、價格、最低人數、最高人數、圖片檔名
// app.get('/store/:sid', (req, res, next) => {
//     connection.query("SELECT p.`PRO_SEQ`, p.`PRO_NAME`, p.`PRICE`, p.`PEOPLE_MIN`, p.`PEOPLE_MAX`, p_img.`IMG_NAME` FROM `products` p JOIN `product_images` p_img ON p.`PRO_SEQ`=p_img.`PRO_SEQ` WHERE p_img.`STATUS`='M' AND P_ID=?", req.params.sid, (err, results)=>{
//         if(err){return res.send(err)};
//         return res.json({
//             data:results
//         })
//     });
// });

// 查詢某個場館下的遊戲，欄位包含遊戲ID、遊戲名稱、價格、最低人數、最高人數、圖片檔名、特色x3
app.get('/store/:sid', (req, res, next) => {
    connection.query("SELECT p.`PRO_NAME`, p.`PRICE`, p.`PEOPLE_MIN`, p.`PEOPLE_MAX`, p_img.`IMG_NAME`, f1.`feature` F1, c1.`CATE_NAME` Feature1, f2.`feature` F2, c2.`CATE_NAME` Feature2, f3.`feature` F3, c3.`CATE_NAME` Feature3 FROM `products` p LEFT JOIN `product_images` p_img ON p.`PRO_SEQ`=p_img.`PRO_SEQ` LEFT JOIN `gamefeature` f1 ON p.`PRO_SEQ` = f1.`gid` LEFT JOIN `game_cate` c1 ON f1.`feature` = c1.`sid` LEFT JOIN `gamefeature` f2 ON p.`PRO_SEQ` = f2.`gid` && f2.`feature` != f1.`feature` LEFT JOIN `game_cate` c2 ON f2.`feature` = c2.`sid` LEFT JOIN `gamefeature` f3 ON p.`PRO_SEQ` = f2.`gid` && f3.`feature` != f1.`feature` && f3.`feature` != f2.`feature` LEFT JOIN `game_cate` c3 ON f3.`feature` = c3.`sid` WHERE p_img.`STATUS`='M' AND p.`P_ID`=? GROUP BY p.`PRO_NAME`", req.params.sid, (err, results)=>{
        if(err){return res.send(err)};
        return res.json({
            data:results
        })
    });
});


// 部落格文章
app.get('/article/:name', (req, res, next) => {
    connection.query("SELECT * FROM articles WHERE article_name=?", req.params.name, (err, results)=>{
        if(err){return res.send(err)};
        return res.json({
            data:results
        })
    });
});

app.listen(4000, ()=>
    console.log(`Server is listening on port 4000`)
)