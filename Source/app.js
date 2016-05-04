var express = require("express");

var app = express();

app.use("/", function(request, response) {
    response.write("Hello world");
    response.end();
});


var port = process.env.PORT || 3000;




var server = app.listen(port, function() {
    console.log("Server running on "+port);
    
});

/*
var express = require("express");
var Catalog = require("./public/catalog.server");
var compression = require("compression");

var app = express();
app.use(compression());
app.use(express.static(__dirname+"/public"));

Catalog.Catalog.initialize(app);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;
*/
/*
import express from "express";
import {Catalog} from "./catalog.server";
import compression from "compression";

console.log("MAIN");

var application = express();
application.use(compression());
application.use(express.static(__dirname+"/"));
//application.use(require("connect-livereload")());

Catalog.initialize(application);

var port = process.env.PORT || 3000;

console.log("Listen to traffic on : "+port);

application.listen(port, () => {
    console.log("Running on port "+port);
});*/