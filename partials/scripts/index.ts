namespace MVW.Start {
  export function initialize(): void {
    const $items: JQuery = $(".slider-item");
    const slideCount = $items.length;
    const slideWidth = $items.width();
    const slideHeight = $items.height();
    const sliderUlWidth = slideCount * slideWidth;

    $(".slider").css({ width: slideWidth, height: slideHeight });
    $(".slider-items").css({ width: sliderUlWidth, marginLeft: - slideWidth });
    $(".slider-item:last-child").prependTo(".slider-items");

    function moveLeft(): void {
      $(".slider-items").animate(
        {
          left: + slideWidth
        },
        200,
        () => {
          $(".slider-item:last-child").prependTo(".slider-items");
          $(".slider-items").css("left", "");
        });
    }

    function moveRight(): void {
      $(".slider-items").animate(
        {
          left: - slideWidth
        },
        200,
        () => {
          $(".slider-item:first-child").appendTo(".slider-items");
          $(".slider-items").css("left", "");
        });
    }

    $(".slider-control.left").click(() => moveLeft());
    $(".slider-control.right").click(() => moveRight());
    setInterval(() => moveRight(), 6000);
  }

  $(() => { MVW.Start.initialize(); });
}
