import express from "express";
import {Catalog} from "./Catalog.server";
import {TemplateGenerator} from "./TemplateGenerator.server";
import compression from "compression";

console.log("MAIN");

var application = express();
application.use(compression());
application.use(express.static(__dirname+"/"));
application.use(require("connect-livereload")());

Catalog.initialize(application);
TemplateGenerator.initialize(application);


var port = process.env.PORT || 3000;

console.log("Listen to traffic on : "+port);

application.listen(port, () => {
    console.log("Running on port "+port);
});