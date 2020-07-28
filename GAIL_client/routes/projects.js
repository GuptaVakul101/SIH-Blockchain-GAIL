var express = require("express");
var router = express.Router({ mergeParams: true });
var http = require('http');
var cookieParser = require('cookie-parser');


router.get("/activeprojects", function (req, res) {
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
                res.render("projects/activeprojects", { projects: jsonObject.allProjects, currentUser: req.cookies.username });
            }
        });
    }
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.get("/floatedprojects", function (req, res) {
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

router.get("/finishedprojects", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    res.render("projects/finishedprojects", { currentUser: req.cookies.username });
})

router.get("/newproject", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    res.render("projects/newproject", { currentUser: req.cookies.username });
})

router.get("/floatedprojects/:id", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }

    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var id = req.params.id.toString();

    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "id": id
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
            console.log(str);
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == false) {
                console.log("Failed");
                res.redirect('/floatedprojects');
            } else {
                res.send(jsonObject.object);
            }
        });
    }

    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.get("/activeprojects/:id", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }

    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var id = req.params.id.toString();

    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "id": id
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
            console.log(str);
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == false) {
                res.redirect('/floatedprojects');
            } else {
                var contractorID = jsonObject.object.contractor_id;
                var bidID = jsonObject.object.bid_id;

                res.send(jsonObject.object);
            }
        });
    }

    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
});

router.post("/newproject", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }

    var todayDate = new Date();
    var dd = todayDate.getDate();
    var mm = todayDate.getMonth() + 1;
    var yyyy = todayDate.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }


    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var title = req.body.title.toString();
    var description = req.body.description.toString();
    var deadlineDate = req.body.date;
    var todayDate = mm + "/" + dd + "/" + yyyy;

    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "title": title,
        "description": description,
        "currentTime": todayDate.toString(),
        "deadlineTime": deadlineDate.toString()
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/gail/project/createProject',
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
            console.log(str);
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == false) {
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
