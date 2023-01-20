class Register {
  public static tryReplaceImage($images: JQuery): boolean {
    const register: { [id: string]: string[] } = {
      "Altsaxophon": ["altsaxophon_1.jpg", "altsaxophon_2.jpg", "altsaxophon_3.jpg", "altsaxophon_4.jpg", "altsaxophon_5.jpg", "saxophon_1.jpg", "saxophon_2.jpg", "saxophon_3.jpg", "saxophon_4.jpg", "saxophon_5.jpg"],
      "Baritonsaxophon": ["saxophon_1.jpg", "saxophon_2.jpg", "saxophon_3.jpg", "saxophon_4.jpg", "saxophon_5.jpg"],
      "Euphonium": ["euphonium_1.jpg", "euphonium_2.jpg"],
      "Fagott": ["fagott_1.jpg", "fagott_2.jpg"],
      "Gitarre": ["gitarre_1.jpg", "gitarre_2.jpg"],
      "Horn": ["horn_1.jpg", "horn_2.jpg", "horn_3.jpg"],
      "Klarinette": ["klarinette_1.jpg"],
      "Klavier": ["klavier_1.jpg", "klavier_2.jpg"],
      "Posaune": ["posaune_1.jpg", "posaune_2.jpg"],
      "Querflöte": ["querfloete_1.jpg", "querfloete_2.jpg"],
      "Schlagzeug": ["schlagzeug_1.jpg", "schlagzeug_2.jpg"],
      "Tenorsaxophon": ["tenorsaxophon_1.jpg", "tenorsaxophon_2.jpg", "saxophon_1.jpg", "saxophon_2.jpg", "saxophon_3.jpg", "saxophon_4.jpg", "saxophon_5.jpg"],
      "Trompete": ["trompete_1.jpg", "trompete_2.jpg"],
      "Tuba": ["tuba_1.jpg", "tuba_2.jpg"]
    };

    const $image: JQuery = $($images[Math.floor(Math.random() * $images.length)]);
    if (Register.isElementInViewport($image[0])) {
      const registerImageUrls = register[$image.attr("title")].filter((url: string): boolean => {
        return !Register.endsWith($image.attr("src"), url);
      });
      $image.fadeOut("fast", (): void => {
        $image.attr("src", "/img/register/" + registerImageUrls[Math.floor(Math.random() * registerImageUrls.length)]);
        $image.fadeIn("slow");
      });
      return true;
    }
    return false;
  }

  private static endsWith(str: string, suffix: string): boolean {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  private static isElementInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    return rect.bottom >= 0
        && rect.right >= 0
        && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.left <= (window.innerWidth || document.documentElement.clientWidth);
  }
}

$(() => {
  const $images = $(".mvw-register-table img");
  setInterval(
      (): void => {
        while (!Register.tryReplaceImage($images)) {
          // find an image to replace...
        }
      },
      8000);
});
