const sql=require('mysql') //引入数据库
//创建数据库连接池
const db=sql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    database:'man_system'
})
db.getConnection((err,data)=>{
    if(err) return console.log(err.message);
    console.log('连接成功');
})
//导出数据库连接池
module.exports=db