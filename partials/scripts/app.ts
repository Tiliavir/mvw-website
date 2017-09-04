/// <reference path="tabs.ts" />

class App {
  public static initialize(): void {
    App.registerScroll();
    App.fixAnchors();
    Tabs.initialize();
  }

  private static checkScroll($nav: JQuery): void {
    // the point where the navbar changes in px
    const startY = $nav.height() * 2;

    if ($(window).scrollTop() > startY) {
      $nav.addClass("inverse");
    } else {
      $nav.removeClass("inverse");
    }
  }

  private static registerScroll(): void {
    const $nav = $(".navigation");
    if ($nav.length > 0) {
      $(window).on("scroll load resize", () => App.checkScroll($nav));
    }
  }

  private static fixAnchors(): void {
    const pathname = window.location.href.split("#")[0];
    $("a[href^='#']").each((i, e) => {
        const $elem = $(e);
        $elem.attr("href", pathname + $elem.attr("href"));
    });
  }
}

$(() => { App.initialize(); });
