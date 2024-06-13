//import express module
const express = require('express')
//create router instance
const router = express.Router()
//import productApi
const productApi = require("../apis/productApis");
//fetch all records
router.get("/fetch", productApi.showAllProducts);
router.get("/fetchUser", productApi.showAllUsers);
//fetch all records
router.get("/fetchcart", productApi.showcart);
router.post("/insertUser", productApi.createUser);
router.post("/login", productApi.login);
//update a record
router.post("/insertProduct", productApi.addToCart);
//delete a record
router.put("/deleteProduct", productApi.reduceFromCart);
router.post("/buyProduct", productApi.buyNow);


//export router
module.exports = router
