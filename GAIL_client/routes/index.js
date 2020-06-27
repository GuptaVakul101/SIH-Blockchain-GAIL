var express = require("express");
var router = express.Router({mergeParams: true});


router.get("/", function(req,res){
	res.render("landing");
});

//SHOW REGISTER FORM
router.get("/register",function(req,res){
    res.render("register");
});

//SHOW LOGIN FORM
router.get("/login", function(req,res){
    res.render("login");
})


module.exports = router;
