import $ from "jquery";

export class Catalog
{
    getAll() {
        var promise = new Promise((fulfill, reject) => {
            $.getJSON("/catalog",(data) => {
                
            });
            
        });
        return promise;
    }
    
}