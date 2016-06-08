/// <reference path="../../../typings/main.d.ts" />

module MVW.Appointments {
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  export function initialize() {
    var cutOffDate = addDays(new Date(), 3);

    $('meta[itemprop="startDate"]').each(function(i,e) {
      var $e = $(e);
      var $endDateString = $e.siblings('meta[itemprop="endDate"]');
      var $e = $endDateString.length === 1 ? $endDateString : $e;
      var endDate = new Date($e.attr("content"));
      if(endDate < cutOffDate) {
        $e.closest("tr").css("display", "none");
      }
    });
  }
}

$(() => { MVW.Appointments.initialize(); });