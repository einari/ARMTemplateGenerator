import {Catalog} from "./catalog";
import {TemplateGenerator} from "./TemplateGenerator";

const MAX_PAGES_IN_PAGINATION = 5;

export class index
{
    constructor() {
        var self = this;
        
        this.items = ko.observableArray();
        this.catalog = new Catalog();
        
        this.templateGenerator = new TemplateGenerator();
        
        this.publishers = this.catalog.publishers;
        this.categories = this.catalog.categories;
    
        this.pages = ko.observableArray();
        this.currentPage = ko.observable([]);
        this.totalPages = ko.observable(0);
        
        if( this.catalog.isBusy() == false ) {
            this.preparePagedItems(this.catalog.items());
        }
        
        this.catalog.isBusy.subscribe(() => self.preparePagedItems(self.catalog.items()));
    }
    
    preparePagedItems(items) {
        var pages = [];
        
        var pageSize = 10;
        
        items.forEach((item, index) => {
            var page = (index / pageSize) | 0;
            if( !pages[page] ) {
                pages[page] = [];
            } 
            
            pages[page].push(item);
        });
        
        this.totalPages(pages.length);
        
        this.pages(pages);
        
        this.currentPage(pages[0]);
    }
    
    selectPage(page) {
        this.currentPage(page);
    }
    
    getVisiblePages() {
        var pages = [];
        
        return pages; 
    }
    
    morePagesNotVisible() {
        
    }
    
    add(item) {
        this.items.push(item);
    }
    
    remove(item) {
        this.items.remove(item);
    }
    
    clear() {
        this.items([]);
    }
    
    download() {
        this.templateGenerator.download(this.items());
    }
}