const mysql = require("mysql");


const dbOp = {
    host: "localhost",
    user: "root",
    password: "",
    database: "url_shortener"
}

const conn = mysql.createConnection(dbOp);

conn.connect((err)=>{
    if(err){
        return console.log(err)
    }
})


module.exports = {
    conn
}