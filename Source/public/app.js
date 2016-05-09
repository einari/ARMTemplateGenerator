"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _Catalog = require("./Catalog.server");

var _TemplateGenerator = require("./TemplateGenerator.server");

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _Template = require("./Templates/Template");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = new _Template.Template();
template.parameter("adminUsername", "string", "User name for the Virtual Machine.");
template.parameter("adminPassword", "securestring", "Password for the Virtual Machine");
template.parameter("dnsLabelPrefix", "string", "Unique DNS Name for the Public IP used to access the Virtual Machine");

var generatedTemplate = template.generate();

console.log(JSON.stringify(generatedTemplate));

if (false) {

    console.log("MAIN");

    var application = (0, _express2.default)();
    application.use(_bodyParser2.default.urlencoded({ extended: false }));
    application.use(_bodyParser2.default.json());
    application.use((0, _compression2.default)());
    application.use(_express2.default.static(__dirname + "/"));
    application.use(require("connect-livereload")());

    _Catalog.Catalog.initialize(application);
    _TemplateGenerator.TemplateGenerator.initialize(application);

    var port = process.env.PORT || 3000;

    console.log("Listen to traffic on : " + port);

    application.listen(port, function () {
        console.log("Running on port " + port);
    });
}
//# sourceMappingURL=app.js.map
