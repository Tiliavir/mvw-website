"use strict";
$(function () {
    $("a.mvw-verein[href^=http]").each(function (i, e) {
        $(e).prepend("<img src=\"https://www.google.com/s2/favicons?domain=" + e.href + "\" "
            + "alt=\"fav\" width=\"16\" height=\"16\" />&nbsp;");
    });
});
