const express = require("express");
const router = express.Router();
const control = require("../controllers/user-controllers");

//to remove

router.get("/profile",control.getProfile)

router.post("/profile/edit",control.editProfile)

router.post("/add/:id",control.addIntoCart)

router.post("/reduce/:id",control.reduceFromCart)

router.get("/cart",control.getCart)

router.post("/buy",control.order);

router.get("/orders",control.getAllOrders);


router.get("/success",function (req,res){
    res.redirect("../");
})

router.get("/failure",function(req,res){
    res.render("/user/failed");
})


module.exports = router;