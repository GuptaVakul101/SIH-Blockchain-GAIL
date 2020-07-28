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
                res.render("projects/activeprojects", { projects: jsonObject.allProjects, currentUser: req.cookies.username });
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
                res.render("projects/floatedprojects", { projects: jsonObject.allProjects, currentUser: req.cookies.username });
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

                res.send(jsonObject.object);
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
                                console.log("Contractor Details: " + JSON.stringify(jsonObject3.object));
                                res.send(jsonObject3);
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

    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "title": title,
        "description": description,
        "currentTime": todayDate,
        "deadlineTime": deadlineDate
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

    return mm + "/" + dd + "/" + yyyy;
}


module.exports = router;
