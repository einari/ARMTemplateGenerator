import {catalog} from "./catalog";

export class index
{
    constructor() {
        this.items = ko.observableArray();
    }
    
    add() {
        this.items.push({name:"hello"});
    }
}