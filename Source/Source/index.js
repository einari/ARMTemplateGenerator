import {Catalog} from "./catalog";

export class index
{
    constructor() {
        this.items = ko.observableArray();
        
        this.Catalog = new Catalog();
        
        this.Catalog.getAll().then((result) => {
            
        });
    }
    
    add() {
        this.items.push({name:"hello"});
    }
}