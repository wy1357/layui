const express = require('express')
const router = express.Router()
const db = require('./sql')
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({
    extended: false
}))
router.get('/api/login', (req, res) => {
    db.query('select * from text', (err, data) => {
        if (err) return console.log(err.message);
        res.send(data)
    })
})
router.get('/api/index', (req, res) => {
    db.query('select * from title', (err, data) => {
        if (err) return console.log(err.message);
        res.send(data)
    })
})
router.get('/api/pie', (req, res) => {
    db.query('select * from opie', (err, data) => {
        if (err) return console.log(err.message);
        res.send(data)
    })
})

// router.post('/api/register', (req, res) => {
//     let cl = 'insert into user_inform set ?'
//     let cx = 'select username from user_inform where username=?'
//     db.query(cx, req.body.username, (err, data) => {
//         let times = new Date()
//         let str = times.toLocaleString()
//         let date = str.slice(0, 9) + ' ' + str.slice(12, 19)
//         req.body.time = date
//         if (data.length > 0) {
//             res.send('该用户已存在')
//         } else {
//             db.query(cl, req.body, (err, data) => {
//                 if (err) {
//                     return console.log(err.message);
//                 } else {
//                     if (data.affectedRows == 1) {
//                         res.send(`注册成功,3秒后返回进行登入
//                         <script>
//                             setTimeout(()=>{
//                                 window.location.href="/api/html/enter&register.html"
//                             },3000)
//                         </script>
//                         `)
//                     }
//                 }
//             })
//         }
//     })
// })
// router.post('/api/enter',(req,res)=>{
//     db.query(`select username from user_inform where username=${req.body.username}`,(err,data)=>{
//         if(data.length!=0) {
//             db.query(`select username,userpass from user_inform where username=${req.body.username},userpass=${req.body.userpass}`,(err,data)=>{

//             })
//         } else {
//             res.send('用户名不存在')
//         }
//     })
// })
module.exports = router