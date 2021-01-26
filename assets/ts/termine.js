"use strict";
var Appointments = (function () {
    function Appointments() {
    }
    Appointments.initialize = function () {
        var cutOffDate = Appointments.addDays(new Date(), -3);
        $("meta[itemprop=\"startDate\"]").each(function (i, e) {
            var $e = $(e);
            var $endDateString = $e.siblings("meta[itemprop=\"endDate\"]");
            $e = $endDateString.length === 1 ? $endDateString : $e;
            var endDate = new Date($e.attr("content"));
            if (endDate < cutOffDate) {
                $e.closest("tr").css("display", "none");
            }
        });
        $("main h2").each(function (i, e) {
            if ($(e).next("table").first().height() === 0) {
                $(e).hide();
            }
        });
    };
    Appointments.addDays = function (date, days) {
        var result = new Date(date.getTime());
        result.setDate(result.getDate() + days);
        return result;
    };
    return Appointments;
}());
$(function () { Appointments.initialize(); });
