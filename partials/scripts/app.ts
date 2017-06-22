namespace MVW {
  const headerNavSelector: string = ".navigation";

  function checkScroll(): void {
    // the point where the navbar changes in px
    const startY = $(headerNavSelector).height() * 2;

    if ($(window).scrollTop() > startY) {
      $(headerNavSelector).addClass("inverse");
    } else {
      $(headerNavSelector).removeClass("inverse");
    }
  }

  function activateTabs(): void {
    function setActive(id: string) {
      $(".tab-pane").removeClass("active");
      $(".tab").removeClass("active");

      $(`#tab-${id}`).addClass("active");
      $(`#${id}`).addClass("active");
    }

    const url: string = window.location.href;

    const startIndex = url.indexOf("#") + 1;
    if (startIndex > 0) {
      setActive(url.substring(startIndex));
    }

    $(".tab").click((e: JQuery.Event<HTMLAnchorElement>) => {
      setActive($(e.target).attr("href").substring(1));
      e.stopPropagation();
    });
  }

  export function initialize(): void {
    if ($(headerNavSelector).length > 0) {
      $(window).on("scroll load resize", () => checkScroll());
    }

    activateTabs();
  }

  $(() => { MVW.initialize(); });
}
