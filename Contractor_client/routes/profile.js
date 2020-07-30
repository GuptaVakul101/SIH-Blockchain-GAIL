var express = require("express");
var router = express.Router({mergeParams: true});
var http = require('http');
var upload = require("express-fileupload");
var cookieParser = require('cookie-parser');


router.get("/", function(req,res){
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
        path: '/contractors/users/profile',
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
                res.render("profile", { contractor: jsonObject.object, currentUser: req.cookies.username });
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.get("/edit", function(req,res){
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
        path: '/contractors/users/profile',
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
                res.render("edit_profile", { contractor: jsonObject.object, currentUser: req.cookies.username });
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.post("/edit", function(req,res){
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }

    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var email = req.body.email.toString();
    var address = req.body.address.toString();

    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "email": email,
        "address": address
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/contractors/users/updateProfile',
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
            if (jsonObject.docType == 'CONTRACTOR') {
                res.redirect('/profile');
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

module.exports = router;
