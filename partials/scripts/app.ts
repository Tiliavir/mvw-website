/// <reference path="tabs.ts" />
/// <reference path="../../node_modules/@types/jquery/index.d.ts" />

class App {
  public static initialize(): void {
    App.registerScroll();
    App.fixAnchors();
    App.registerPopUp();
    Tabs.initialize();
  }

  private static registerScroll(): void {
    const $nav = $(".navigation");
    if ($nav.length > 0) {
      $(window).on("scroll load resize", () => {
        if ($(window).scrollTop() > $nav.height() * 2) {
          $nav.addClass("inverse");
        } else {
          $nav.removeClass("inverse");
        }
      });
    }
  }

  private static fixAnchors(): void {
    const pathname = window.location.href.split("#")[0];
    $("a[href^='#']").each((i, e) => {
      const $elem = $(e);
      $elem.attr("href", pathname + $elem.attr("href"));
    });
  }

  private static registerPopUp(): void {
    if (localStorage.getItem("mvw-popup") === "dont-show") {
      return;
    }

    if (sessionStorage.getItem("mvw-popup") === "dont-show") {
      return;
    }

    const $popup = $(".mail-popup");
    if ($popup.length > 0) {
      $(window).on("scroll load resize", () => {
        if ($(window).scrollTop() > 200) {
          $popup.addClass("visible");
        }
      });

      $popup.find(".close").on("click", () => {
        sessionStorage.setItem("mvw-popup", "dont-show");
        $popup.remove();
      });

      $popup.find(".dont-show").on("click", () => {
        localStorage.setItem("mvw-popup", "dont-show");
        $popup.remove();
      });
    }
  }
}

$(() => { App.initialize(); });
