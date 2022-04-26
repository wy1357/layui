const express = require('express')
const app = express()
const router = require('./router')
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'mytoken');
    next();
});


app.use(router)
app.use('/api', express.static('./public'))
app.listen(3000, () => {
    console.log('服务器启动成功');
})