var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var indexRoutes = require("./routes/index");
var projectRoutes = require("./routes/projects");
var cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use("/", indexRoutes);
app.use("/", projectRoutes);


app.listen(3600,function(){
    console.log("Server started at port 3600");
});

