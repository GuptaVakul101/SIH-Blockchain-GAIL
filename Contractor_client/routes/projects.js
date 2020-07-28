var express = require("express");
var router = express.Router({mergeParams: true});
var http = require('http');
var cookieParser = require('cookie-parser');


router.get('/floatedprojects', function(req,res){
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }

    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    const requestData = JSON.stringify({
        "username": username,
        "password": password,
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/gail/project/getAllProjects',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        }
    }

    callback = function (response) {
        var str = '';
        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been received, so we just print it out here
        response.on('end', function () {
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == true) {
                res.render("projects/floatedprojects", { projects: jsonObject.allProjects, currentUser: req.cookies.username });
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.get('/apply', function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
		res.redirect("/");
		return;
	}

    var projectID = req.query.id.toString();

    const requestData = JSON.stringify({
        "id": projectID
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/gail/project/getProject',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        }
    }

    callback = function (response) {
        var str = '';
        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been received, so we just print it out here
        response.on('end', function () {
            const jsonObject = JSON.parse(str);
            console.log(jsonObject);
            res.render("projects/applybid", {
                projectID: projectID,
                currentUser: req.cookies.username
            });
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.post('/apply', function(req,res){
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }

    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();

    var id = req.body.id.toString();
    var price = req.body.price.toString();
    var quality = req.body.quality.toString();
    var rating = req.body.rating.toString();

    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "projectID": id,
        "bidDetails": {
            "price": price,
            "quality": quality,
            "rating": rating
        }
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/contractors/bids/applyForProject',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        }
    }

    callback = function (response) {
        var str = '';
        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been received, so we just print it out here
        response.on('end', function () {
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == true) {
                res.redirect('/floatedprojects');
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.get('/allocated', function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
		res.redirect("/");
		return;
	}

    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();

    const requestData = JSON.stringify({
        username: username,
        password: password
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/contractors/project',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestData.length
        }
    }

    callback = function (response) {
        var str = '';
        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been received, so we just print it out here
        response.on('end', function () {
            const jsonObject = JSON.parse(str);
            console.log(jsonObject);
            res.render("projects/allocated", {
                currentUser: req.cookies.username
            });
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

module.exports = router;
