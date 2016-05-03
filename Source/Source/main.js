import express from "express";
import {Catalog} from "./catalog.server";

console.log("MAIN");

var application = express();
application.use(express.static(__dirname+"/"));
application.use(require("connect-livereload")());

Catalog.initialize(application);

application.listen(3000, () => {
    console.log("Running on port 3000");
});