import express from "express";
import {Catalog} from "./catalog.server";

console.log("MAIN");

var application = express();
application.use(express.static(__dirname+"/"));
application.use(require("connect-livereload")());

Catalog.initialize(application);

var port = process.env.PORT || 3000;

application.listen(port, () => {
    console.log("Running on port "+port);
});