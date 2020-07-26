var express = require("express");
var router = express.Router({mergeParams: true});
var http = require('http');
var cookieParser = require('cookie-parser');


router.get("/", function(req,res){
	res.render("landing", { currentUser: req.cookies.username} );
});

//SHOW REGISTER FORM
router.get("/register",function(req,res){
	if(req.cookies.username != null && req.cookies.username.toString() != "")  {
		res.redirect("/");
		return;
	}
    res.render("register", { currentUser: req.cookies.username} );
});

//HANDLE SIGN UP
router.post("/register",function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	console.log(username);
	console.log(password);

	if(req.cookies.username != null && req.cookies.username.toString() != "")  {
		res.redirect("/");
		return;
	}

	const requestData = JSON.stringify({
		"username": username.toString(),
		"password": password.toString(),
		"email": email.toString()
	});

	var options = {
		host: 'localhost',
		port: '3000',
		path:'/gail/users/signup',
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
	    		res.redirect('/register');
	    	} else {
	    		res.cookie("username", username.toString());
	    		res.cookie("password", password.toString());
	    		res.redirect('/');
	    	}
	  	});
	}

	var request = http.request(options, callback);
	request.write(requestData);
	request.end();
});

//SHOW LOGIN FORM
router.get("/login", function(req,res){
	if(req.cookies.username != null && req.cookies.username.toString() != "") {
		res.redirect("/");
		return;
	}
    res.render("login", { currentUser: req.cookies.username});
})

//HANDLE LOGIN 
router.post("/login", function(req,res){
	if(req.cookies.username != null && req.cookies.username.toString() != "")  {
		res.redirect("/");
		return;
	}
	var username = req.body.username;
	var password = req.body.password;

	const requestData = JSON.stringify({
		"username": username.toString(),
		"password": password.toString()
	});

	var options = {
		host: 'localhost',
		port: '3000',
		path:'/gail/users/login',
		method: 'POST',
		headers: {
	        'Content-Type': 'application/json',
		    'Content-Length': requestData.length
        },
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
	    		res.redirect('/login');
	    	} else {
	    		res.cookie("username", username.toString());
	    		res.cookie("password", password.toString());
	    		res.redirect('/');
	    	}
	  	});
	}

	var request = http.request(options, callback);
	request.write(requestData);
	request.end();
})

router.get("/logout",function(req,res){
    res.cookie("username", "");
    res.cookie("password", "");
    res.redirect("/");
});

router.get("/cookies", function(req,res){
	res.send(req.cookies);
});


module.exports = router;
