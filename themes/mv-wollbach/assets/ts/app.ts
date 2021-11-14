class App {
  public static initialize(): void {
    App.registerScroll();
    App.fixAnchors();
    // App.registerPopUp(); // inactive till fixed
    App.initializeTabs();
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
    if (localStorage.getItem("mvw-popup") === "dont-show"
      || sessionStorage.getItem("mvw-popup") === "dont-show") {
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

  private static setActive(id: string) {
    $(".tab-pane").removeClass("active");
    $(".tab").removeClass("active");

    $(`.tab-${id}`).addClass("active");
    $(`#${id}`).addClass("active");
  }

  public static initializeTabs(): void {
    const url: string = window.location.href;

    const startIndex = url.indexOf("#") + 1;
    if (startIndex > 0) {
      const id = url.substring(startIndex);
      if (id.length > 0) {
        App.setActive(id);
      }
    }

    $(".tab").on("click",(e: JQuery.ClickEvent) => {
      App.setActive($(e.target).data("tab"));
      e.preventDefault(); // prevent auto scroll to target
      e.stopPropagation();
    });

    $(".tab-dropdown").on("click",(e) => $(e.target)
        .closest(".tab-dropdown")
        .toggleClass("open"));

    $(".tab-dropdown-menu .tab").on("click",(e) => $(e.target)
        .closest(".tab-dropdown")
        .removeClass("open"));
  }
}

$(() => { App.initialize(); });
