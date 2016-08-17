import express from "express";
import {Catalog} from "./Catalog.server";
import {TemplateGenerator} from "./TemplateGenerator.server";
import compression from "compression";
import bodyparser from "body-parser";

import {Template} from "./Templates/Template";

let template = new Template();
template.parameter("adminUsername", "string", "User name for the Virtual Machine.");
template.parameter("adminPassword", "securestring", "Password for the Virtual Machine");
template.parameter("dnsLabelPrefix", "string", "Unique DNS Name for the Public IP used to access the Virtual Machine");

//template.virtualMachine(vm => vm.fromGallery("Ubuntu", "15.10"))

let generatedTemplate = template.generate();

console.log(JSON.stringify(generatedTemplate));

if( true) {

console.log("MAIN");

var application = express();
application.use(bodyparser.urlencoded({extended: false}));
application.use(bodyparser.json());
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
}