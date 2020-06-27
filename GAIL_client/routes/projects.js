var express = require("express");
var router = express.Router({mergeParams: true});


router.get("/activeprojects", function(req,res){
	res.render("projects/activeprojects");
});

router.get("/floatedprojects",function(req,res){
    res.render("projects/floatedprojects");
});

router.get("/finishedprojects", function(req,res){
    res.render("projects/finishedprojects");
})

router.get("/newproject", function(req,res){
    res.render("projects/newproject");
})


module.exports = router;
