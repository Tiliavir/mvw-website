/// <reference path="../../../main.d.ts" />

module MVW.Appointments {
  function addDays(date : Date, days : number) : Date {
    let result = new Date(date.getTime());
    result.setDate(result.getDate() + days);
    return result;
  }

  export function initialize() : void {
    const cutOffDate = addDays(new Date(), 3);

    $("meta[itemprop=\"startDate\"]").each(function(i, e) {
      let $e = $(e);
      let $endDateString = $e.siblings("meta[itemprop=\"endDate\"]");
      $e = $endDateString.length === 1 ? $endDateString : $e;
      let endDate = new Date($e.attr("content"));
      if (endDate < cutOffDate) {
        $e.closest("tr").css("display", "none");
      }
    });
  }
}

$(() => { MVW.Appointments.initialize(); });
