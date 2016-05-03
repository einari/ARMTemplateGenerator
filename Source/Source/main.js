import express from "express";

console.log("MAIN");

var application = express();
application.use(express.static(__dirname+"/"));
application.use(require("connect-livereload")());


application.get("/Something", (request, response) => {
    response.send("Hello world - there - 3");
});


application.listen(3000, () => {
    console.log("Running on port 3000");
});