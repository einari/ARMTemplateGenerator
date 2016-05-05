import fs from "fs";

export class TemplateGenerator
{
    static initialize(application) {
        application.post("/templategenerator/generate", (request, response) => {
            let  content = "";
            
            request.on("data", (data) => {
                content += data;
            });
            
            request.on("end", () => {
                let data = JSON.parse(content);
                let templateGenerator = new TemplateGenerator();
                
                let json = templateGenerator.generate(data);
                response.json(json);
                
                let fileName = `./public/generatedtemplates/${data.id}.json`;
                console.log("Writing ${fileName}");
                
                fs.writeFile(fileName, json);
            });
        });
        
        application.get("/templategenerator/download", (request, response) => {
            console.log(`Download ${request.query.id}`);
            response.end();
        });
    }
    
    generate(template) {
        return "{ 'funny' : 'stuff' }";
    }
}