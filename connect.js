const mysql = require('mysql')

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'belajar_nodejs',
    // port:3306
})

conn.connect((err)=>{
    if(err) throw err
})

module.exports = conn