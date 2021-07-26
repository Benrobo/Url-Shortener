const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs")
const app = express()
const router = express.Router()

const {saveUrl, getUrls, delUrl, redirectUrl}  = require("../controller/logic.js")

// handle post request from client
router.post("/api", (req, res)=>{
    let URL = req.body.url
    return saveUrl(req, res, URL)
})

router.get("/api/getUrl", (req, res)=>{
    return getUrls(req, res)
})

// redirect url
router.get("/:id", (req, res)=>{
    let urlid = req.params.id
    return redirectUrl(req, res, urlid)
})

// delete short url with id
router.get("/api/shorturl/:id", (req, res)=>{
    let urlid = req.params.id
    return delUrl(req, res, urlid)
}) 


module.exports = {
    router
}