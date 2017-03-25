module MVW {
  const headerNavSelector: string = ".navigation";
  function checkScroll(): void {
    // the point where the navbar changes in px
    let startY = $(headerNavSelector).height() * 2;

    if ($(window).scrollTop() > startY) {
      $(headerNavSelector).removeClass("inverse");
    } else {
      $(headerNavSelector).addClass("inverse");
    }
  }

  export function initialize(): void {
    if ($(headerNavSelector).length > 0) {
      $(window).on("scroll load resize", () => checkScroll());
    }
  }
}

$(() => MVW.initialize());
