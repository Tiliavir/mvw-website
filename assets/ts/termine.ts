class Appointments {
  public static initialize(): void {
    const cutOffDate = Appointments.addDays(new Date(), -3);

    $("meta[itemprop=\"startDate\"]").each((i, e) => {
      let $e = $(e);
      const $endDateString = $e.siblings("meta[itemprop=\"endDate\"]");
      $e = $endDateString.length === 1 ? $endDateString : $e;
      const endDate = new Date($e.attr("content"));
      if (endDate < cutOffDate) {
        $e.closest("tr").css("display", "none");
      }
    });

    $("main h2").each((i, e) => {
      if ($(e).next("table").first().height() === 0) {
        $(e).hide();
      }
    });
  }

  private static addDays(date: Date, days: number): Date {
    const result = new Date(date.getTime());
    result.setDate(result.getDate() + days);
    return result;
  }
}

$(() => { Appointments.initialize(); });
