class Index {
  public static initialize(): void {
    const slideWidth = $(".slider-items").width();

    let interval: any;

    function resetInterval(): void {
      clearInterval(interval);
      interval = setInterval(() => moveRight(), 6000);
    }

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
      resetInterval();
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
      resetInterval();
    }

    $(".slider-control.left").click(() => moveLeft());
    $(".slider-control.right").click(() => moveRight());
    document.onkeydown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          moveLeft();
          break;
        case "ArrowRight":
          moveRight();
          break;
      }
    };
    resetInterval();
  }
}

$(() => { Index.initialize(); });
