const {conn} = require("../model/postModel.js")
const path =require("path")
const {v4: uuid} = require("uuid")
const isUrlValid = require('url-validation');
const basePath = "http://localhost:5000/"
const urlparams = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase().split("")
let urlId = ""; 
 
function saveUrl(req, res, url){
    if (!isUrlValid(url)){
        return res.send({
            error: 500, 
            msg: "Url provided is invalid"
        })
    } 
    else{ 
        urlId = ""
        for (let i = 0; i < 6; i++) {
            urlId += urlparams[Math.floor(Math.random() * urlparams.length)]
        }
        let randid = uuid();
        let data = url;
        $(data)
        let sql = `INSERT INTO links(uuid,baseurl,longurl,shorturl) VALUES(?, ?, ?, ?)`
        conn.query(sql, [randid,basePath,data,urlId], (err, data)=>{
            if(err){
                return $(err)
            }
            return $("data inserted")
        })
    }
}


function getUrls(req, res){
    let sql = `SELECT * FROM links ORDER BY id DESC`
    conn.query(sql, (err, data)=>{
        if(err){
            $({
                msg: "Error Occur while fetching data",
                error: err
            })
            return res.send({
                msg: "Error Occur while fetching data"
            })
        }
        return res.send(JSON.stringify(data))
    })
}


function delUrl(req, res,urlid){
    let sql = `DELETE  FROM links WHERE uuid = ?`
    conn.query(sql,[urlid], (err, data)=>{
        if(err){
            $({
                msg: "Error Occur while DELETING data",
                error: err
            })
            return res.send({
                msg: "Error Occur while DELETING data"
            })
        }
        return res.send(JSON.stringify(data))
    })
}


function redirectUrl(req, res, urlid){
    let sql = `SELECT * FROM links WHERE shorturl = ?`
    conn.query(sql,[urlid], (err, data)=>{
        if(err){
            $({
                msg: "Error Occur while DELETING data",
                error: err
            })
            return res.send({
                msg: "Error Occur while DELETING data"
            })
        }
        if(!data.length == 0){
            return res.redirect(data[0].longurl)
        }
    })
}

function $(val){
    return console.log(val)
}


module.exports = {
    saveUrl,
    getUrls,
    delUrl,
    redirectUrl
}