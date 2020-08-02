var express = require("express");
var router = express.Router({ mergeParams: true });
var http = require('http');
var upload = require("express-fileupload");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


router.get("/submitAllBids/:id", function (req, res) {
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

    var options = getOptions('/gail/bideval/', requestData);

    callback = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == true) {
                res.redirect("/floatedprojects");
            } else {
                res.redirect("/");
            }
        });
    }
    runHttpRequest(options, callback, requestData);
});

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
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == true) {
                // res.render("projects/finishedprojects", { currentUser: req.cookies.username });
                res.render("projects/activeprojects", { projects: jsonObject.allProjects, currentUser: req.cookies.username, designation: req.cookies.designation });
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
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            const jsonObject = JSON.parse(str);
            if (jsonObject.success == true) {
                // res.render("projects/finishedprojects", { currentUser: req.cookies.username });
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

                const requestData2 = JSON.stringify({
                    "id": id
                });
                var options2 = getOptions('/gail/project/getAllBids', requestData2);
                callback2 = function (response2) {
                    var str2 = '';
                    response2.on('data', function (chunk) {
                        str2 += chunk;
                    });

                    response2.on('end', function () {
                        const jsonObject2 = JSON.parse(str2);
                        if (jsonObject2.success == true) {
                            res.render("projects/showfloatedproject", { data: jsonObject.object, currentUser: req.cookies.username, allBidDetails: jsonObject2.allBids, designation: req.cookies.designation });
                        } else {
                            res.render("projects/showfloatedproject", { data: jsonObject.object, currentUser: req.cookies.username, allBidDetails: [], designation: req.cookies.designation });
                        }

                        // res.send(jsonObject2.allBids);
                    });
                }
                runHttpRequest(options2, callback2, requestData2);
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
                                res.render("projects/showactiveproject", { project: jsonObject.object, bid: jsonObject2.object, contractor: jsonObject3.object, currentUser: req.cookies.username, designation: req.cookies.designation });

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

router.get("/finishedprojects/:id", function (req, res) {
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
                                // res.send(jsonObject);
                                res.render("projects/showfinishedproject", { project: jsonObject.object, bid: jsonObject2.object, contractor: jsonObject3.object, currentUser: req.cookies.username });
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
    var type = req.body.type.toString();
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
        "brochurePath": getTimeStampString,
        "type": type
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
});

router.post("/submit/:id", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }

    var id = req.params.id.toString();
    const evaluation_review = {
        "rating": req.body.rating.toString(),
        "quality": req.body.quality.toString(),
        "review": req.body.review.toString()
    };

    const requestData = JSON.stringify({
        "evaluation_review": evaluation_review,
        "id": id.toString()
    });

    var options = getOptions('/gail/project/updateEvaluationReview', requestData);

    callback = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            res.redirect('/activeprojects');
        });
    }

    runHttpRequest(options, callback, requestData);

});

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
        "rating": req.body.rating.toString(),
        "quality": req.body.quality.toString(),
        "review": req.body.review.toString(),
        "id": id.toString()
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
                const requestData2 = JSON.stringify({
                    "username": username,
                    "password": password,
                    "id": id.toString()
                });
                var options2 = getOptions('/gail/project/getProject', requestData2);
                callback2 = function (response2) {
                    var str2 = '';
                    //another chunk of data has been received, so append it to `str`
                    response2.on('data', function (chunk) {
                        str2 += chunk;
                    });

                    //the whole response has been received, so we just print it out here
                    response2.on('end', function () {
                        console.log(str2);
                        const jsonObject2 = JSON.parse(str2);
                        if (jsonObject2.success == false) {
                            console.log("Failed");
                            res.redirect('/activeprojects');
                        } else {
                            var contractorID = jsonObject2.object.contractor_id.toString();
                            console.log(contractorID);
                            var bidID = jsonObject2.object.bid_id;

                            var requestData3 = JSON.stringify({
                                "bid_id": bidID.toString()
                            });
                            var options3 = getOptions('/gail/bideval/getSingleBid', requestData3);
                            var callback3 = function (response3) {
                                var str3 = '';
                                response3.on('data', function (chunk) {
                                    str3 += chunk;
                                });

                                response3.on('end', function () {
                                    const jsonObject3 = JSON.parse(str3); //coressponding to the bid details
                                    console.log("Bid Details: " + JSON.stringify(jsonObject3.object));
                                    if (jsonObject3.success == false) {
                                        console.log("Failed");
                                        res.redirect('/activeprojects');
                                    } else {
                                        var requestData4 = JSON.stringify({
                                        });
                                        var options4 = getOptions('/contractors/users/' + contractorID, requestData4);

                                        var callback4 = function (response4) {
                                            var str4 = '';
                                            response4.on('data', function (chunk) {
                                                str4 += chunk;
                                            });

                                            response4.on('end', function () {
                                                const jsonObject4 = JSON.parse(str4); //coressponding to the bid details
                                                console.log("Contractor Details: " + str4);
                                                if (jsonObject4.success == false) {
                                                    console.log("Failed");
                                                    res.redirect('/activeprojects', { designation: req.cookies.designation });
                                                } else {
                                                    var price = jsonObject3.object.price.toString();
                                                    var mid = jsonObject4.object.merchantID.toString();
                                                    var mkey = jsonObject4.object.merchantKey.toString();
                                                    mid = "zaIKaq44908600148140";
                                                    mkey = "u7uTLYfplLfLriru";
                                                    res.redirect('/payment?mid=' + mid + '&value=' + price + '&merchantKey=' + mkey);
                                                }
                                            });
                                        }
                                        runHttpRequest(options4, callback4, requestData4);
                                    }
                                });
                            }
                            runHttpRequest(options3, callback3, requestData3);
                        }
                    });
                }
                runHttpRequest(options2, callback2, requestData2);
            }
        });
    }
    runHttpRequest(options, callback, requestData);
});

router.post("/rejectproject/:id", function (req, res) {

    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    console.log("reject");
    var id = req.params.id.toString();
    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    const requestData = JSON.stringify({
        "username": username,
        "password": password,
        "rating": req.body.rating.toString(),
        "quality": req.body.quality.toString(),
        "review": req.body.review.toString(),
        "id": id.toString()
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
                res.redirect('/activeprojects', { designation: req.cookies.designation });
            } else {
                const requestData2 = JSON.stringify({
                    "username": username,
                    "password": password,
                    "id": id.toString()
                });
                var options2 = getOptions('/gail/project/getProject', requestData2);
                callback2 = function (response2) {
                    var str2 = '';
                    //another chunk of data has been received, so append it to `str`
                    response2.on('data', function (chunk) {
                        str2 += chunk;
                    });

                    //the whole response has been received, so we just print it out here
                    response2.on('end', function () {
                        console.log(str2);
                        const jsonObject2 = JSON.parse(str2);
                        if (jsonObject2.success == false) {
                            console.log("Failed");
                            res.redirect('/activeprojects', { designation: req.cookies.designation });
                        } else {
                            var contractorID = jsonObject2.object.contractor_id.toString();
                            console.log(contractorID);
                            var bidID = jsonObject2.object.bid_id;

                            var requestData3 = JSON.stringify({
                                "bid_id": bidID.toString()
                            });
                            var options3 = getOptions('/gail/bideval/getSingleBid', requestData3);
                            var callback3 = function (response3) {
                                var str3 = '';
                                response3.on('data', function (chunk) {
                                    str3 += chunk;
                                });

                                response3.on('end', function () {
                                    const jsonObject3 = JSON.parse(str3); //coressponding to the bid details
                                    console.log("Bid Details: " + JSON.stringify(jsonObject3.object));
                                    if (jsonObject3.success == false) {
                                        console.log("Failed");
                                        res.redirect('/activeprojects', { designation: req.cookies.designation });
                                    } else {
                                        var requestData4 = JSON.stringify({
                                        });
                                        var options4 = getOptions('/contractors/users/' + contractorID, requestData4);

                                        var callback4 = function (response4) {
                                            var str4 = '';
                                            response4.on('data', function (chunk) {
                                                str4 += chunk;
                                            });

                                            response4.on('end', function () {
                                                const jsonObject4 = JSON.parse(str4); //coressponding to the bid details
                                                console.log("Contractor Details: " + str4);
                                                if (jsonObject4.success == false) {
                                                    console.log("Failed");
                                                    res.redirect('/activeprojects', { designation: req.cookies.designation });
                                                } else {
                                                    var price = jsonObject3.object.price.toString();
                                                    var mid = jsonObject4.object.merchantID.toString();
                                                    var mkey = jsonObject4.object.merchantKey.toString();
                                                    res.redirect('/payment?mid=' + mid + '&value=' + price + '&merchantKey=' + mkey);
                                                }
                                            });
                                        }
                                        runHttpRequest(options4, callback4, requestData4);
                                    }
                                });
                            }
                            runHttpRequest(options3, callback3, requestData3);
                        }
                    });
                }
                runHttpRequest(options2, callback2, requestData2);
            }
        });
    }
    runHttpRequest(options, callback, requestData);
});

router.post("/getAllBids/:id", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    var id = req.params.id.toString();

});

router.get("/bidreview", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    var bidID = req.query.bid_id.toString();
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
            res.render("projects/bidreview", {
                currentUser: req.cookies.username,
                bid_id: bidID,
                bidDetails: jsonObject2.object
            });
        });

    }
    runHttpRequest(options, callback, requestData);
    
});

router.post("/bidreviewAccept", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var bid_id = req.body.bid_id.toString();
    var rating = req.body.rating.toString();
    var review = req.body.review.toString();
    console.log(bid_id);

    const gailfield = JSON.stringify({
        rating: rating,
        review: review,
        accept: "true"
    });

    const requestData = JSON.stringify({
        username: username,
        password: password,
        bid_id: bid_id,
        gailfield: gailfield
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/gail/bideval/updateBid',
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

router.post("/bidreviewReject", function (req, res) {
    if (req.cookies.username == null || req.cookies.username.toString() == "") {
        res.redirect("/login");
        return;
    }
    var username = req.cookies.username.toString();
    var password = req.cookies.password.toString();
    var bid_id = req.body.bid_id.toString();
    var rating = req.body.rating.toString();
    var review = req.body.review.toString();
    console.log(bid_id);

    const gailfield = JSON.stringify({
        rating: rating,
        review: review,
        accept: "false"
    });

    const requestData = JSON.stringify({
        username: username,
        password: password,
        bid_id: bid_id,
        gailfield: gailfield
    });

    var options = {
        host: 'localhost',
        port: '3000',
        path: '/gail/bideval/updateBid',
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
