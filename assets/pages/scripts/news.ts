/// <reference path="../../../main.d.ts" />

module MVW.News {
  export function hideNewsThatAreOver() {
    $("meta[itemprop='endDate']").each(function (i, e) {
      if (new Date($(e).attr("content")) < new Date()) {
        $(e).closest("tr").css("display", "none");
      }
    });
  }
}

$(() => { MVW.News.hideNewsThatAreOver(); });
