import $ from "jquery";
import {Guid} from "./Guid";

export class TemplateGenerator {

    download(templateContent) {
        let template = {
            id: Guid.create(),
            content: templateContent,
        };
          
        $.ajax({
            type: "POST",
            url: "/templategenerator/generate",
            data: JSON.stringify(template),
            contentType: "application/json",
            dataType: "text"
        }).then((data) => {
            let url = `generatedtemplates/${template.id}.json`;
            
            /*
            let anchor = document.createElement("a");
            anchor.target = "_blank";
            anchor.href = url;
            anchor.click();*/
            
            //window.location = url;
        });
    }    
} 