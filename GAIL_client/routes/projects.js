var express = require("express");
var router = express.Router({ mergeParams: true });
var http = require('http');
var upload = require("express-fileupload");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

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

    var options = getOptions('/gail/project/getAllProjects', requestData);

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
                var obj = jsonObject.allProjects;
                var flag = false;
                for (var key in obj) {
                    console.log(key);
                    if (obj.hasOwnProperty(key)) {
                        const requestDataNested = JSON.stringify({
                            "username": username,
                            "password": password,
                            "id": key
                        });
                        var val = obj[key];
                        var obj2 = JSON.parse(val);
                        var deadlineTime = obj2["deadline"];
                        var currentStatus = obj2["status"];
                        var currentTime = getTodayDate();
                        console.log(deadlineTime);
                        console.log(currentTime);
                        console.log(currentStatus);
                        var optionsNested = getOptions('/gail/bideval/', requestDataNested);
                        callback2 = function (response) {
                            response.on('data', function (chunk) {

                            });
                            response.on('end', function () {

                            });
                        }
                        var ans1 = currentStatus.localeCompare("floated");
                        var ans2 = currentTime.localeCompare(deadlineTime);
                        console.log(ans1);
                        console.log(ans2);
                        if (ans1 == 0 && ans2 > 0) {
                            flag = true;
                            runHttpRequest(optionsNested, callback2, requestDataNested);
                        }
                    }
                }
                console.log(jsonObject.allProjects);
                if (flag == true) {
                    res.redirect("/activeprojects");
                } else {
                    res.render("projects/activeprojects", { projects: jsonObject.allProjects, currentUser: req.cookies.username });
                }
                // res.render("projects/activeprojects", { projects: jsonObject.allProjects, currentUser: req.cookies.username });
            }
        });
    }

    runHttpRequest(options, callback, requestData);
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

    var options = getOptions('/gail/project/getAllProjects', requestData);

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
                var obj = jsonObject.allProjects;
                var flag = false;
                for (var key in obj) {
                    console.log(key);
                    if (obj.hasOwnProperty(key)) {
                        const requestDataNested = JSON.stringify({
                            "username": username,
                            "password": password,
                            "id": key
                        });
                        var val = obj[key];
                        var obj2 = JSON.parse(val);
                        var deadlineTime = obj2["deadline"];
                        var currentStatus = obj2["status"];
                        var currentTime = getTodayDate();
                        console.log(deadlineTime);
                        console.log(currentTime);
                        console.log(currentStatus);
                        var optionsNested = getOptions('/gail/bideval/', requestDataNested);
                        callback2 = function (response) {
                            response.on('data', function (chunk) {

                            });
                            response.on('end', function () {

                            });
                        }
                        var ans1 = currentStatus.localeCompare("floated");
                        var ans2 = currentTime.localeCompare(deadlineTime);
                        console.log(ans1);
                        console.log(ans2);
                        if (ans1 == 0 && ans2 > 0) {
                            flag = true;
                            runHttpRequest(optionsNested, callback2, requestDataNested);
                        }
                    }
                }
                console.log(jsonObject.allProjects);
                if (flag == true) {
                    res.redirect("/floatedprojects");
                } else {
                    res.render("projects/floatedprojects", { projects: jsonObject.allProjects, currentUser: req.cookies.username });
                }
            }
        });
    }
    runHttpRequest(options, callback, requestData);
});

router.get("/finishedprojects", function (req, res) {
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

    var options = getOptions('/gail/project/getAllProjects', requestData);

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
                // res.render("projects/finishedprojects", { currentUser: req.cookies.username });
                res.render("projects/finishedprojects", { projects: jsonObject.allProjects, currentUser: req.cookies.username });
            }
        });
    }
    runHttpRequest(options, callback, requestData);
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

    var options = getOptions('/gail/project/getProject', requestData);

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
                res.render("projects/showfloatedproject", { data: jsonObject.object, currentUser: req.cookies.username });
                // res.send(jsonObject.object);
            }
        });
    }

    runHttpRequest(options, callback, requestData);
});

router.get("/activeprojects/:id", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }

    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var id = req.params.id.toString();

    var requestData = JSON.stringify({
        "username": username,
        "password": password,
        "id": id
    });

    var options = getOptions('/gail/project/getProject', requestData);

    callback = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            const jsonObject = JSON.parse(str); //coressponding to the project details
            console.log("Project Details: " + JSON.stringify(jsonObject.object));
            if (jsonObject.success == false) {
                res.redirect('/floatedprojects');
            } else {
                var contractorID = jsonObject.object.contractor_id.toString();
                console.log(contractorID);
                var bidID = jsonObject.object.bid_id;

                var requestData = JSON.stringify({
                    "bid_id": bidID.toString()
                });
                var options = getOptions('/gail/bideval/getSingleBid', requestData);

                var callback = function (response2) {
                    var str2 = '';
                    response2.on('data', function (chunk) {
                        str2 += chunk;
                    });

                    response2.on('end', function () {
                        const jsonObject2 = JSON.parse(str2); //coressponding to the bid details
                        console.log("Bid Details: " + JSON.stringify(jsonObject2.object));

                        var requestData = JSON.stringify({
                        });
                        var options = getOptions('/contractors/users/' + contractorID, requestData);

                        var callback = function (response3) {
                            var str3 = '';
                            response3.on('data', function (chunk) {
                                str3 += chunk;
                            });

                            response3.on('end', function () {
                                const jsonObject3 = JSON.parse(str3); //coressponding to the bid details
                                console.log("Contractor Details: " + str3);
                                res.render("projects/showactiveproject", { data: jsonObject.object, data2: jsonObject2.object, data3: jsonObject3.object, currentUser: req.cookies.username });

                                // res.send(jsonObject3);
                            });
                        }

                        runHttpRequest(options, callback, requestData);

                    });

                }

                runHttpRequest(options, callback, requestData);
            }
        });
    }

    runHttpRequest(options, callback, requestData);
});

router.post("/newproject", function (req, res) {

    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var title = req.body.title.toString();
    var description = req.body.description.toString();
    var deadlineDate = req.body.date.toString();
    var todayDate = getTodayDate().toString();
    var file = null;
    if (req.files) {
        file = req.files.filename;
    }

    var getTimeStampString = null;
    if (file != null) {
        getTimeStampString = new Date().getTime().toString();
        var saveFilePath = "../nodeserver/brochureUpload/" + getTimeStampString;
        file.mv(saveFilePath, function (err) {
            if (err) {
                res.redirect("/newproject");
                return;
            } else {
                console.log("File downloaded successfully");
            }
        });
    }

    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "title": title,
        "description": description,
        "currentTime": todayDate,
        "deadlineTime": deadlineDate,
        "brochurePath": getTimeStampString
    });

    var options = getOptions('/gail/project/createProject', requestData);

    callback = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
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
    runHttpRequest(options, callback, requestData);
})

router.post("/acceptproject/:id", function (req, res) {

    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    console.log("accept");
    var id = req.params.id.toString();
    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "rating":req.body.rating.toString(),
        "quality":req.body.quality.toString(),
        "review":req.body.review.toString(),
        "id":id.toString()
    });

    var options = getOptions('/gail/project/acceptProject', requestData);

    callback = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            console.log(str);
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == false) {
                console.log("Failed");
                res.redirect('/activeprojects');
            } else {
                res.redirect('/activeprojects');
            }
        });
    }
    runHttpRequest(options, callback, requestData);
})

router.post("/rejectproject/:id", function (req, res) {

    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    console.log("reject");
    var id = req.params.id.toString();
    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "rating":req.body.rating.toString(),
        "quality":req.body.quality.toString(),
        "review":req.body.review.toString(),
        "id":id.toString()
    });

    var options = getOptions('/gail/project/rejectProject', requestData);

    callback = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            console.log(str);
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == false) {
                console.log("Failed");
                res.redirect('/activeprojects');
            } else {
                res.redirect('/activeprojects');
            }
        });
    }
    runHttpRequest(options, callback, requestData);
})

function getOptions(pathTemp, requestDataTemp) {
    return {
        host: 'localhost',
        port: '3000',
        path: pathTemp,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestDataTemp.length
        }
    };
}

function runHttpRequest(options, callback, requestData) {
    var request = http.request(options, callback);
    request.write(requestData);
    request.end();
}

function getTodayDate() {
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

    // return mm + "/" + dd + "/" + yyyy;
    return yyyy + "/" + mm + "/" + dd;
}

module.exports = router;
