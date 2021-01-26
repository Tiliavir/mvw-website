"use strict";
var Filter = (function () {
    function Filter() {
        this.filters = [];
    }
    Filter.containsAll = function (array, find) {
        return find.every(function (v) {
            return array.indexOf(v) !== -1;
        });
    };
    Filter.prototype.initialize = function () {
        var _this = this;
        $(".keyword-selector .keyword").each(function (i, e) {
            var $e = $(e);
            $e.click(function () {
                $e.toggleClass("active");
                _this.toggleFilter($e.text());
            });
        });
    };
    Filter.prototype.toggleFilter = function (filter) {
        var index = this.filters.indexOf(filter);
        if (index === -1) {
            this.filters.push(filter);
        }
        else {
            this.filters.splice(index, 1);
        }
        this.updateFilter();
    };
    Filter.prototype.updateFilter = function () {
        var _this = this;
        if (this.filters.length > 0) {
            $(".tabs").hide();
            $(".tab-content .tab-pane").show();
            $(".tab-content .entry").each(function (i, entry) {
                var $entry = $(entry);
                var itemTags = [];
                $entry.find(".keyword").each(function (j, e) {
                    itemTags.push($(e).text());
                });
                $entry.toggle(Filter.containsAll(itemTags, _this.filters));
            });
        }
        else {
            $(".tabs").show();
            $(".tab-content .tab-pane").css("display", "");
            $(".tab-content .entry").show();
        }
    };
    return Filter;
}());
$(function () { new Filter().initialize(); });
