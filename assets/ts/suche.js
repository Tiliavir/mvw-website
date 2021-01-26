"use strict";
var Search = (function () {
    function Search() {
    }
    Search.handleSearch = function (e) {
        var query = $("input.mvw-search-field").val();
        var result = Search.index.search("*" + query + "*");
        var resultContainer = $(".results");
        if (!query || result.length === 0) {
            resultContainer.hide();
        }
        else {
            resultContainer.empty();
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var item = result_1[_i];
                var ref = item.ref;
                var i = "<li>\n                     <h2><a href=\"" + ref + ".html\">" + Search.store[ref].title + "</a></h2>\n                     <span>" + Search.store[ref].description + "</span>\n                   </li>";
                resultContainer.append(i);
            }
            resultContainer.show();
        }
    };
    Search.initialize = function () {
        $.getJSON("./index.json", function (data) {
            Search.index = lunr.Index.load(data.index);
            Search.store = data.store;
            var query = Search.getParameterByName("query") || Search.getParameterByName("q");
            var inputField = $("input.mvw-search-field");
            if (query) {
                inputField.val(query);
            }
            inputField.on("keyup", Search.handleSearch);
            Search.handleSearch(null);
        });
    };
    Search.getParameterByName = function (name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return "";
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    return Search;
}());
$(function () { return Search.initialize(); });
