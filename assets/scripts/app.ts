module MVW {
  function checkScroll() : void {
      // the point where the navbar changes in px
      let startY = $(".navbar").height() * 2;

      if ($(window).scrollTop() > startY) {
          $(".navbar").removeClass("navbar-inverse");
          $(".navbar").addClass("navbar-default");
      } else {
          $(".navbar").addClass("navbar-inverse");
          $(".navbar").removeClass("navbar-default");
      }
  }

  export function initialize() : void {
    if ($(".navbar").length > 0) {
      $(window).on("scroll load resize", function() {
          checkScroll();
      });
    }
  }
}

$(() => { MVW.initialize(); });
