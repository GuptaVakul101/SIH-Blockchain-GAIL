var express = require("express");
var router = express.Router({mergeParams: true});
var http = require('http');
var cookieParser = require('cookie-parser');


router.get("/activeprojects", function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
		res.redirect("/login");
		return;
    }
	res.render("projects/activeprojects",{ currentUser: req.cookies.username} );
});

router.get("/floatedprojects",function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
		res.redirect("/login");
		return;
	}
    res.render("projects/floatedprojects", { currentUser: req.cookies.username} );
});

router.get("/finishedprojects", function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
		res.redirect("/login");
		return;
	}
    res.render("projects/finishedprojects", { currentUser: req.cookies.username} );
})

router.get("/newproject", function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
		res.redirect("/login");
		return;
	}
    res.render("projects/newproject", { currentUser: req.cookies.username} );
})

router.post("/newproject", function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
		res.redirect("/login");
		return;
    }
    
    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var title = req.body.title.toString();
    var description = req.body.description.toString();

    const requestData = JSON.stringify({
		"username": username,
        "password": password,
        "title": title,
        "description": description
    });
    
    var options = {
		host: 'localhost',
		port: '3000',
		path:'/gail/project/createProject',
		method: 'POST',
		headers: {
	        'Content-Type': 'application/json',
		    'Content-Length': requestData.length
        },
		// json: requestData
	}

	callback = function(response) {
		var str = '';
		//another chunk of data has been received, so append it to `str`
	  	response.on('data', function (chunk) {
	    	str += chunk;
	  	});

	  	//the whole response has been received, so we just print it out here
	  	response.on('end', function () {
	    	console.log(str);
	    	const jsonObject = JSON.parse(str);
	    	if(jsonObject.success == false) {
	    		console.log("Failed");
	    		res.redirect('/newproject');
	    	} else {
	    		res.redirect('/floatedprojects');
	    	}
	  	});
	}

	var request = http.request(options, callback);
	request.write(requestData);
	request.end();

})


module.exports = router;
