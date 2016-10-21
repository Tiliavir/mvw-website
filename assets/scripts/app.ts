module MVW {
  const headerNavSelector: string = ".mvw-header.navbar";
  function checkScroll() : void {
    // the point where the navbar changes in px
    let startY = $(headerNavSelector).height() * 2;

    if ($(window).scrollTop() > startY) {
      $(headerNavSelector).removeClass("navbar-inverse");
      $(headerNavSelector).addClass("navbar-default");
    } else {
      $(headerNavSelector).addClass("navbar-inverse");
      $(headerNavSelector).removeClass("navbar-default");
    }
  }

  export function initialize() : void {
    if ($(headerNavSelector).length > 0) {
      $(window).on("scroll load resize", function() {
        checkScroll();
      });
    }
  }
}

$(() => { MVW.initialize(); });
