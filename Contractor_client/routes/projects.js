var express = require("express");
var router = express.Router({mergeParams: true});
var http = require('http');
var cookieParser = require('cookie-parser');


router.get('/floated', function(req,res){
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
            res.render("projects/applybid", {
                project: jsonObject.object,
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
    var time_period = req.body.time_period.toString();

    var isoArr = [];
    for(var i = 1; ; i++){
        if(req.body['iso'+i.toString()] != null){
            isoArr.push(req.body['iso'+i.toString()]);
        }
        else{
            break;
        }
    }

    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "projectID": id,
        "bidDetails": {
            "price": price,
            "time_period": time_period,
            "standards": isoArr
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
                res.redirect('/projects/floated');
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
            if(jsonObject.success == false){
                res.render("projects/allocated", {
                    project: null,
                    currentUser: req.cookies.username
                });
            }
            else{
                res.render("projects/allocated", {
                    project: jsonObject,
                    currentUser: req.cookies.username
                });
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.get('/details', function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
		res.redirect("/");
  	}

    var id = req.query.id.toString();
    const requestData = JSON.stringify({
        id: id
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
            res.render("projects/projectdetails", {
                currentUser: req.cookies.username,
                project: jsonObject.object,
                projectID: id,
                progress: jsonObject.object.progress
            });
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.post('/details', function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
    		res.redirect("/");
    		return;
  	}

    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();

    var status = req.body.status.toString();
    var id = req.body.id.toString();

    const requestData = JSON.stringify({
        username: username,
        password: password,
        status: status
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/contractors/project/updateProjectStatus',
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
                res.redirect('/projects/details?id='+id);
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.get('/progress', function(req, res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
        res.redirect("/");
    }

    var id = req.query.id;

    var username = req.cookies.username.toString();
    res.render("projects/updateprogress", {
        projectID: id,
        currentUser: req.cookies.username
    });
});

router.post('/progress', function(req,res){
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/");
        return;
    }

    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var description = req.body.description.toString();
    var id = req.body.id.toString();

    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "description": description
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/contractors/project/updateProjectProgress',
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
                res.redirect('/projects/details?id='+id);
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.get('/completed', function(req,res){
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
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
        path: '/contractors/users/getCompletedProjects',
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
            if (jsonObject.success == true) {
                res.render("projects/completed", { projects: jsonObject.allProjects, currentUser: req.cookies.username });
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.get('/completed/details', function(req,res){
    if(req.cookies.username == null || req.cookies.username.toString() == "")  {
		res.redirect("/");
  	}

    var id = req.query.id.toString();
    const requestData = JSON.stringify({
        id: id
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
            res.render("projects/completedetails", {
                currentUser: req.cookies.username,
                project: jsonObject.object,
                projectID: id,
                progress: jsonObject.object.progress
            });
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});


module.exports = router;
