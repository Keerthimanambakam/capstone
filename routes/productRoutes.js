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
router.post("/inserttocart", productApi.addToCart);
//delete a record
router.put("/deletefromcart", productApi.reduceFromCart);
router.post("/buyProduct", productApi.buyNow);
//update products 
router.post("/insertproduct",productApi.addProduct);
router.delete("/deleteproduct",productApi.deleteProduct);
router.delete("/deleteuser",productApi.deleteUser);


//export router
module.exports = router