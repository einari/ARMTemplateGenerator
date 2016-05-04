"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Catalog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Catalog = exports.Catalog = function () {
    function Catalog() {
        _classCallCheck(this, Catalog);
    }

    _createClass(Catalog, [{
        key: "getAll",
        value: function getAll() {
            var promise = new Promise(function (fulfill, reject) {
                var jsonAsString = "";

                if (_fs2.default.existsSync("./catalog.json")) {
                    console.log("File exists - read");

                    _fs2.default.readFile("./catalog.json", function (error, data) {
                        console.log("File read");
                        var json = JSON.parse(data);
                        fulfill(json);
                    });
                } else {

                    // /Microsoft.Gallery/GalleryItems?Subscriptions%255B0%255D=184d24f6-4143-47d2-a613-b3571f50ffd6&curationArea=create&limitRows=true&api-version=2015-04-01&combineReferences=true&curationId

                    var options = {
                        hostname: "gallery.azure.com",
                        port: 443,
                        path: "/api/invoke",
                        method: "GET",

                        headers: {
                            "x-ms-path-query": "/Microsoft.Gallery/GalleryItems?api-version=2015-04-01"
                        }
                    };

                    var callback = function callback(response) {
                        console.log("API Call");
                        console.log("  StatusCode : " + response.statusCode);
                        console.log("  Headers : " + response.headers);

                        response.on("data", function (data) {
                            jsonAsString = jsonAsString + data.toString();
                        });

                        response.on("error", function (error) {
                            console.error(error);
                        });

                        response.on("end", function () {
                            console.log("Done");
                            var json = JSON.parse(jsonAsString);
                            fulfill(json);
                            console.log("Parsed");

                            //fs.writeFile("./catalog.json", jsonAsString);
                        });
                    };

                    _https2.default.request(options, callback).end();
                }
            });

            return promise;
        }
    }], [{
        key: "initialize",
        value: function initialize(application) {
            application.get("/catalog", function (request, response) {
                var catalog = new Catalog();

                catalog.getAll().then(function (data) {
                    response.json(data);
                });
            });
        }
    }]);

    return Catalog;
}();
//# sourceMappingURL=Catalog.server.js.map
