"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Catalog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

var _knockout = require("knockout");

var _knockout2 = _interopRequireDefault(_knockout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _items = new WeakMap();

var _itemsByCategories = new WeakMap();
var _itemsByPublishers = new WeakMap();

var _categories = new WeakMap();
var _publishers = new WeakMap();

var _productNameIndex = new WeakMap();

function hasCategories(item, categories) {
    var found = false;
    item.categoryIds.some(function (categoryId) {
        found |= categories.some(function (category) {
            return categoryId == category;
        });
    });
    return found;
}

_knockout2.default.bindingHandlers.popover = {
    init: function init() {},

    update: function update(element, valueAccessor) {
        (0, _jquery2.default)(element).popover({
            html: true,
            title: "Description",
            placement: "auto",
            content: _knockout2.default.unwrap(valueAccessor())
        });
    }
};

var Catalog = exports.Catalog = function () {
    function Catalog() {
        _classCallCheck(this, Catalog);

        var self = this;

        _itemsByCategories.set(this, {});
        _categories.set(this, _knockout2.default.observableArray());
        _publishers.set(this, _knockout2.default.observableArray());
        _items.set(this, _knockout2.default.observableArray());

        this.isBusy = _knockout2.default.observable(true);
        _jquery2.default.getJSON("/catalog", function (data) {
            self.organizeByCategories(data);
            self.isBusy(false);
        });
    }

    _createClass(Catalog, [{
        key: "organizeByCategories",
        value: function organizeByCategories(data) {
            var itemsByCategories = {};
            var itemsByPublishers = {};

            var categories = ["virtualMachine-Arm"];

            var categoriesToSkip = ["Hidden_Byol", "Hidden_FreeTrial", "fromDataMarket"];

            var items = _items.get(this);

            data.forEach(function (item) {
                if (!hasCategories(item, categories)) {
                    return;
                }

                if (hasCategories(item, categoriesToSkip)) {
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

                item.categoryIds.forEach(function (categoryId) {
                    var category = [];
                    if (itemsByCategories.hasOwnProperty(categoryId)) {
                        category = itemsByCategories[categoryId];
                    } else {
                        itemsByCategories[categoryId] = category;
                    }

                    category.push(item);
                });
            });

            console.log("Items : " + items().length + " of " + data.length + " in total");

            _itemsByCategories.set(this, itemsByCategories);

            this.prepareCategories(itemsByCategories);
            this.preparePublishers(itemsByPublishers);
        }
    }, {
        key: "prepareCategories",
        value: function prepareCategories(itemsByCategories) {
            var categories = this.categories;
            for (var property in itemsByCategories) {
                categories.push(property);
            }
            _categories.set(this, categories);
        }
    }, {
        key: "preparePublishers",
        value: function preparePublishers(itemsByPublishers) {
            var publishers = this.publishers;
            for (var property in itemsByPublishers) {
                publishers.push(property);
            }
            _publishers.set(this, publishers);
        }
    }, {
        key: "categories",
        get: function get() {
            return _categories.get(this);
        }
    }, {
        key: "publishers",
        get: function get() {
            return _publishers.get(this);
        }
    }, {
        key: "items",
        get: function get() {
            return _items.get(this);
        }
    }]);

    return Catalog;
}();
//# sourceMappingURL=Catalog.js.map
