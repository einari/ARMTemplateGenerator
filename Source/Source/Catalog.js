import $ from "jquery";
import ko from "knockout";


const _items = new WeakMap();

const _itemsByCategories = new WeakMap();
const _itemsByPublishers = new WeakMap();

const _categories = new WeakMap();
const _publishers = new WeakMap();

const _productNameIndex = new WeakMap();

function hasCategories(item, categories) {
    var found = false;
    item.categoryIds.some((categoryId) => {
        found |= categories.some((category) => categoryId == category);
    });
    return found;
}

ko.bindingHandlers.popover = {
    init: () => {
        
    },
    
    update: (element, valueAccessor) => {
        $(element).popover({
            html: true,
            title: "Description",
            placement: "auto",
            content: ko.unwrap(valueAccessor())
        });
        
    }
};



export class Catalog {
    constructor() {
        var self = this;
        
        _itemsByCategories.set(this, {});
        _categories.set(this, ko.observableArray());
        _publishers.set(this, ko.observableArray());
        _items.set(this, ko.observableArray());

        this.isBusy = ko.observable(true);
        $.getJSON("/catalog", (data) => {
            self.organizeByCategories(data);
            self.isBusy(false);
        });
    }

    get categories() {
        return _categories.get(this);
    }

    get publishers() {
        return _publishers.get(this);
    }
    
    get items() {
        return _items.get(this);
    }

    organizeByCategories(data) {
        var itemsByCategories = {};
        var itemsByPublishers = {};
        
        var categories = [
            "virtualMachine-Arm",
        ];
        
        var categoriesToSkip = [
            "Hidden_Byol",
            "Hidden_FreeTrial",
            "fromDataMarket"
        ];
                
        var items = _items.get(this);
        
        data.forEach((item) => {
            if (!hasCategories(item, categories) ) {
                return;
            }
            
            if( hasCategories(item, categoriesToSkip)) {
                return;
            }

            items.push(item);

            var publisher = [];
            if (itemsByPublishers.hasOwnProperty(item.publisher)) {
                publisher = itemsByPublishers[item.publisher];
            } else {
                itemsByPublishers[item.publisher] = publisher;
            }
            publisher.push(item);

            item.categoryIds.forEach((categoryId) => {
                var category = [];
                if (itemsByCategories.hasOwnProperty(categoryId)) {
                    category = itemsByCategories[categoryId];
                } else {
                    itemsByCategories[categoryId] = category;
                }

                category.push(item);
            });
        });
        
        console.log("Items : "+items().length+" of "+data.length+" in total");

        _itemsByCategories.set(this, itemsByCategories);

        this.prepareCategories(itemsByCategories);
        this.preparePublishers(itemsByPublishers);
    }

    prepareCategories(itemsByCategories) {
        var categories = this.categories;
        for (let property in itemsByCategories) {
            categories.push(property);
        }
        _categories.set(this, categories);
    }

    preparePublishers(itemsByPublishers) {
        var publishers = this.publishers;
        for (let property in itemsByPublishers) {
            publishers.push(property);
        }
        _publishers.set(this, publishers);
    }
}