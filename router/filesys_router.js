/**
 * @TODO
 * This file is to be used only if you wanna save the content of the generated url in a json filr on this local directory
 * 
 */

const express = require("express");
const bodyParser = require("body-parser");
const path =require("path")
const {v4: uuid} = require("uuid")
const fs = require("fs")
const app = express()
const validUrl = require("valid-url")
const router = express.Router()
const baseurl = "/"
const urlparams = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase().split("")
let urlscont;
let urlId = "";
let id = uuid();
let dir = path.join(__dirname, "../router", "../api.json");

// handle post request from client
router.post("/api", (req, res)=>{
    let URL = req.body.url
    
    if (!validUrl.isUri(URL)){
        return res.send({
            error: 500,
            msg: "Url provided is invalid"
        })
    }
    else{ 
        // save info in db
        saveInfo(URL, res)
    }
    
})

router.get("/api/getUrl", (req, res)=>{
    fs.readFile(dir, (err, data)=>{
        if(err){
            console.log(err)
            return res.send({
                err: 500,
                nsg: "Request to get file failed "
            })
        }

        return res.send(JSON.parse(data.toString()))
    })
})

// redirect url
router.get("/:id", (req, res)=>{
    let urlid = req.params.id
    fs.readFile(dir, (err, data)=>{
        if(err){
            console.log(err)
            return res.send({
                err: 500,
                nsg: "Request to get file failed "
            })
        }

        let newData = JSON.parse(data.toString());
        
        let urlscont = [];

        for(var i=0; i<newData.length; i++){
            if(newData[i].shorturl == urlid){
                urlscont.push(newData[i])
            }
        }
        let urlarray = urlscont;
        urlarray.forEach((url)=>{
            console.log(url.longUrl)
            return res.redirect(url.longUrl)
        })
    })
})

// delete short url with id
router.get("/api/shorturl/:id", (req, res)=>{
    let urlid = req.params.id
    fs.readFile(dir, (err, data)=>{
        if(err){
            console.log(err)
            return res.send({
                err: 500,
                nsg: "Request to get file failed "
            })
        }
        let newData = JSON.parse(data.toString());
        
        urlscont = []; 
        for(var i=0; i<newData.length; i++){
            if(newData[i].id == urlid){
                // delete newData[i]
                newData[i] = {} 
            }
            urlscont.push(newData[i])
        }
        // console.log(urlscont)
        // Rewrite the new  data from urlscont array to file
        fs.writeFile(dir, JSON.stringify(urlscont), (err)=>{
            if(err){
                return console.log(err)
            }
            return console.log("FILE DELETED")
        })
    })  
}) 

function saveInfo(val, res){
    urlId = ""
    for (let i = 0; i < 6; i++) {
        urlId += urlparams[Math.floor(Math.random() * urlparams.length)]
    }
    const dbData = {
        id: id,
        shorturl: urlId,
        longUrl: val,
        baseurl: `${baseurl}${urlId}`
    }

    // read file
    fs.readFile(path.join(__dirname, "../router", "../api.json"), (err, data)=>{
        if(err){
            return console.log("Error reading file "+err)
        }
        let apijson = JSON.parse(data);
        apijson.push(dbData)
        // write data to file
        fs.writeFile(path.join(__dirname, "../router", "../api.json"),JSON.stringify(apijson), (err)=>{
            if(err){
                return console.log("An Error occur while saving data")
            }
            
            // if everything went well read the file from api.json and send to client
            getFileData(res)
        })
    })
}


async function getFileData(res){
    fs.readFile(dir, (err, data)=>{
        if(err){
            console.log(err)
            return res.send({
                err: 500,
                nsg: "Request to get file failed "
            })
        }

        return res.send(JSON.parse(data.toString()))
    })
}
module.exports = {
    router
}