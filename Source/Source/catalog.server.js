import https from "https";

export class Catalog {

    static initialize(application) {
        application.get("/catalog", (request, response) => {
            var catalog = new Catalog();

            catalog.getAll().then((data) => {
                response.json(data);
            });
        });
    }

    getAll() {
        var promise = new Promise((fulfill, reject) => {

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

            var jsonAsString = "";

            var callback = (response) => {
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
                });

            };

            https.request(options, callback).end();

        });

        return promise;

    }
}


