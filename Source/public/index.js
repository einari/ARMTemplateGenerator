"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.index = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _catalog = require("./catalog");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MAX_PAGES_IN_PAGINATION = 5;

var index = exports.index = function () {
    function index() {
        _classCallCheck(this, index);

        var self = this;

        this.items = ko.observableArray();
        this.catalog = new _catalog.Catalog();

        this.publishers = this.catalog.publishers;
        this.categories = this.catalog.categories;

        this.pages = ko.observableArray();
        this.currentPage = ko.observable([]);
        this.totalPages = ko.observable(0);

        if (this.catalog.isBusy() == false) {
            this.preparePagedItems(this.catalog.items());
        }

        this.catalog.isBusy.subscribe(function () {
            return self.preparePagedItems(self.catalog.items());
        });
    }

    _createClass(index, [{
        key: "preparePagedItems",
        value: function preparePagedItems(items) {
            var pages = [];

            var pageSize = 10;

            items.forEach(function (item, index) {
                var page = index / pageSize | 0;
                if (!pages[page]) {
                    pages[page] = [];
                }

                pages[page].push(item);
            });

            this.totalPages(pages.length);

            this.pages(pages);

            this.currentPage(pages[0]);
        }
    }, {
        key: "selectPage",
        value: function selectPage(page) {
            this.currentPage(page);
        }
    }, {
        key: "getVisiblePages",
        value: function getVisiblePages() {
            var pages = [];

            return pages;
        }
    }, {
        key: "morePagesNotVisible",
        value: function morePagesNotVisible() {}
    }, {
        key: "add",
        value: function add(item) {
            this.items.push(item);
        }
    }, {
        key: "remove",
        value: function remove(item) {
            this.items.remove(item);
        }
    }]);

    return index;
}();
//# sourceMappingURL=index.js.map
