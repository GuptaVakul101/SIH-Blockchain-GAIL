var express = require("express");
var router = express.Router({mergeParams: true});
var http = require('http');


router.get("/", function(req,res){
	res.render("landing");
});

//SHOW REGISTER FORM
router.get("/register",function(req,res){
    res.render("register");
});

//HANDLE SIGN UP
router.post("/register",function(req,res){
	var username = req.body.username;
	var password = req.body.password;

	console.log(username);
	console.log(password);

	const requestData = JSON.stringify({
		"username": username.toString(),
		"password": password.toString()
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
	    		res.redirect('/login');
	    	}
	  	});
	}

	var request = http.request(options, callback);
	request.write(requestData);
	request.end();
});

//SHOW LOGIN FORM
router.get("/login", function(req,res){
    res.render("login");
})

//HANDLE LOGIN 
router.post("/login", function(req,res){
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
	    		res.redirect('/');
	    	}
	  	});
	}

	var request = http.request(options, callback);
	request.write(requestData);
	request.end();
})


module.exports = router;
