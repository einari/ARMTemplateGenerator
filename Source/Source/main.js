import express from "express";

console.log("MAIN");

var application = express();
application.use(express.static(__dirname+"/"));
application.use(require("connect-livereload")());

application.listen(3000, function() {
    console.log("Running on port 3000");
});



/*
var express = require("express");

var app = express();
app.use(express.static(__dirname + "/"));
*/

/*
app.get("/PowerBIConfig", powerBIConfig);

app.get("/BIMSyncToken", function (request, response) {

    var request = https.request({
        host: "api.bimsync.com",
        port: 443,
        path: "/1.0/viewer/access?project_id=33b9937bdebf416aaa4a3ed1fb036457",
        method: "POST",
        headers: {
            Authorization: "bearer PV3UuHOinaJjjOq"
        }
    }, function (res) {
        console.log("Get token result");
        console.log("  StatusCode : "+response.statusCode);
        console.log("  Headers : "+response.headers);
        
        res.on("data", function(data) {
            process.stdout.write(data);
            response.send(data);
        });
    });
    
    request.end();
});
*/

/* 
app.listen(3000, function () {
    console.log("Running on port 3000");
});*/