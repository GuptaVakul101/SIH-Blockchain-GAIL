var express = require("express");
var router = express.Router({mergeParams: true});


router.get("/activeprojects", function(req,res){
	res.render("projects/activeprojects",{ currentUser: req.cookies.username} );
});

router.get("/floatedprojects",function(req,res){
    res.render("projects/floatedprojects", { currentUser: req.cookies.username} );
});

router.get("/finishedprojects", function(req,res){
    res.render("projects/finishedprojects", { currentUser: req.cookies.username} );
})

router.get("/newproject", function(req,res){
    res.render("projects/newproject", { currentUser: req.cookies.username} );
})


module.exports = router;
