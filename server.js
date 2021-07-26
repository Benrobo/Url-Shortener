const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
const app = express()

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "/views")));

const {router} = require("./router/router.js")

 
app.use(router)

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
	return console.log("Server stated at http://localhost:5000")
})