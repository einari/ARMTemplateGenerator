var express = require("express");
var application = express();
application.use(express.static(__dirname+"/"));

/*
var port = process.env.PORT || 3000;

console.log("Listen to traffic on : "+port);

application.listen(port, () => {
    console.log("Running on port "+port);
});*/

module.exports = application;