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

port = 81;

console.log("Listen to traffic on : "+port);

application.listen(port, () => {
    console.log("Running on port "+port);
});