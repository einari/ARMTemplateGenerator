import fs from "fs";
import path from "path";

const templatesFolder = "./temp_data";

let getFileNameFor = (template) => {
    let fileName = `${templatesFolder}/${template.id}.json`;
    return fileName;
};


export class TemplateGenerator {
    static initialize(application) {
        application.post("/templategenerator/generate", (request, response) => {
            let content = "";

            request.on("data", (data) => {
                content += data;
            });

            request.on("end", () => {
                let data = JSON.parse(content);
                let templateGenerator = new TemplateGenerator();

                let json = templateGenerator.generate(data);
                response.json(json);

            });
        });
        
        application.post("/templategenerator/download", (request, response) => {
            console.log(`Download ${request.body.template}`);
            var template = JSON.parse(request.body.template);

            let templateGenerator = new TemplateGenerator();
            templateGenerator.generate(template).then(json => {
                let fileName = getFileNameFor(template);
                let absolutePath = path.resolve(fileName);

                response.sendFile(absolutePath);
                response.end();
            });
        });
        
        application.post("/templategenerator/deploy", (request, response) => {
            console.log(`Deploy ${request.body.template}`);
            var template = JSON.parse(request.body.template);

            let templateGenerator = new TemplateGenerator();
            templateGenerator.generate(template).then(json => {
                let fileName = getFileNameFor(template);
                
                response.redirect("https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-vm-simple-linux%2Fazuredeploy.json");
                response.end();
            });
        });
        
        
        application.post("/templategenerator/visualize", (request, response) => {
            console.log(`Deploy ${request.body.template}`);
            var template = JSON.parse(request.body.template);

            let templateGenerator = new TemplateGenerator();
            templateGenerator.generate(template).then(json => {
                let fileName = getFileNameFor(template);
                
                response.redirect("http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-vm-simple-linux%2Fazuredeploy.json");
                response.end();
            });
        });
    }

    generate(template) {
        var promise = new Promise((fulfill, reject) => {
            var json = "{ 'funny' : 'stuff' }";

            if (!fs.existsSync(templatesFolder)) {
                fs.mkdirSync(templatesFolder);
            }

            let fileName = getFileNameFor(template);

            console.log(`Writing ${fileName}`);

            fs.writeFile(fileName, json, () => {
                console.log("DONE");
                fulfill(json)
            });
        });

        return promise;
    }
}