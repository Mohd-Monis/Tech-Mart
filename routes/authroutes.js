const express = require("express");
const router = express.Router();
const control = require("../controllers/auth-controllers");

//to remove
const User = require("../models/user");
const checkSignUpInput = require("../util/checkSignUpInput")
const {addErrorFlag,flushError} = require("../util/addErrorFlag");

router.get("/", control.getHome)

router.get("/login",control.getLogIn)

router.get("/signup",control.getSignUp)

router.post("/signup", control.postSignUp)

router.post("/login",control.postLogin)

router.get('/view-products',control.viewProduct);

router.get('/view/:id',control.viewSingleProduct)

router.get("/products/search",control.search);

router.get("/logout",control.logout)

module.exports = router;