/// <reference path="../../node_modules/@types/jquery/index.d.ts" />

class Tabs {
  public static initialize(): void {
    const url: string = window.location.href;

    const startIndex = url.indexOf("#") + 1;
    if (startIndex > 0) {
      Tabs.setActive(url.substring(startIndex));
    }

    $(".tab").click((e: JQuery.Event<HTMLAnchorElement>) => {
      Tabs.setActive($(e.target).data("tab"));
      e.preventDefault(); // prevent auto scroll to target
      e.stopPropagation();
    });

    $(".tab-dropdown").click((e) => $(e.target)
                      .closest(".tab-dropdown")
                      .toggleClass("open"));

    $(".tab-dropdown-menu .tab").click((e) => $(e.target)
                                .closest(".tab-dropdown")
                                .removeClass("open"));
  }

  private static setActive(id: string) {
    $(".tab-pane").removeClass("active");
    $(".tab").removeClass("active");

    $(`.tab-${id}`).addClass("active");
    $(`#${id}`).addClass("active");
  }
}
