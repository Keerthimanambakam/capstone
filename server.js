//import modules
const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors = require('cors')
//import routes
const productroutes = require('./routes/Productroutes');
//import url
let url = require('./url')
//create rest object
let app = express()
//set JSON as MIME type
app.use(bodyparser.json())
//client is not sending form data -> encoding JSON
app.use(bodyparser.urlencoded({ extended: false }))
//enable CORS -> Cross Origine Resource Sharing -> communication among variousports
app.use(cors())
//use routes
app.use("/", productroutes)

//connect to mongodb
mongoose.connect(url,{ dbname: "capstone"}).then(() => {
    console.log('Connection Success')
}, (errRes) => {
    console.log("COnnection Failed:-",errRes)
})

//create port
let port = 8080
//assign port no
app.listen(port, () => {
console.log('Server listening port no:- ', port)
})
