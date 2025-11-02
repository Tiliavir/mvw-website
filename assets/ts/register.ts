class Register {
  private static register: { [id: string]: string[] } = {
    "Altsaxophon": ["altsaxophon_1.jpg", "altsaxophon_2.jpg", "altsaxophon_3.jpg", "altsaxophon_4.jpg", "altsaxophon_5.jpg", "saxophon_1.jpg", "saxophon_2.jpg", "saxophon_3.jpg", "saxophon_4.jpg", "saxophon_5.jpg"],
    "Baritonsaxophon": ["baritonsaxophon_1.jpg", "saxophon_1.jpg", "saxophon_2.jpg", "saxophon_3.jpg", "saxophon_4.jpg", "saxophon_5.jpg"],
    "Euphonium": ["euphonium_1.jpg", "euphonium_2.jpg"],
    "Fagott": ["fagott_1.jpg", "fagott_2.jpg"],
    "Gitarre": ["gitarre_1.jpg", "gitarre_2.jpg"],
    "Horn": ["horn_1.jpg", "horn_2.jpg", "horn_3.jpg"],
    "Klarinette": ["klarinette_1.jpg"],
    "Klavier": ["klavier_1.jpg", "klavier_2.jpg"],
    "Oboe": [],
    "Posaune": ["posaune_1.jpg", "posaune_2.jpg"],
    "Querflöte": ["querfloete_1.jpg", "querfloete_2.jpg"],
    "Schlagzeug": ["schlagzeug_1.jpg", "schlagzeug_2.jpg"],
    "Tenorsaxophon": ["tenorsaxophon_1.jpg", "tenorsaxophon_2.jpg", "saxophon_1.jpg", "saxophon_2.jpg", "saxophon_3.jpg", "saxophon_4.jpg", "saxophon_5.jpg"],
    "Trompete": ["trompete_1.jpg", "trompete_2.jpg"],
    "Tuba": ["tuba_1.jpg", "tuba_2.jpg", "tuba_3.jpg", "tuba_4.jpg"]
  };

  public static tryReplaceImage(images: HTMLElement[]): void {
    const htmlElements = this.shuffle(images);
    for (const image of htmlElements) {
      if (Register.isElementInViewport(image)) {
        const title = image.getAttribute("title");
        const src = image.getAttribute("src") || "";

        const remainingRegImageUrls = Register.register[title]?.filter(
            url => src.indexOf(url.replace(".jpg", "")) < 0
        );

        if (remainingRegImageUrls && remainingRegImageUrls.length > 0) {
          image.style.transition = "opacity 0.2s";
          image.style.opacity = "0";

          setTimeout(() => {
            const parent = image.parentElement;
            if (parent && parent.tagName.toLowerCase() === "picture") {
              const sources = parent.querySelectorAll("source");
              sources.forEach(srcEl => srcEl.remove());
            }

            image.removeAttribute("width");
            image.removeAttribute("height");

            const nextIndex = Math.floor(Math.random() * remainingRegImageUrls.length);
            image.setAttribute("src", "/das-orchester/register/img/" + remainingRegImageUrls[nextIndex]);

            image.style.transition = "opacity 0.6s";
            image.style.opacity = "1";
          }, 200);

          break;
        }
      }
    }
  }

  private static shuffle(array: HTMLElement[]): HTMLElement[] {
    for (let m = array.length, t, i; m > 0; m--) {
      i = Math.floor(Math.random() * m);

      t = array[m - 1];
      array[m - 1] = array[i];
      array[i] = t;
    }

    return array;
  }

  private static isElementInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    return rect.bottom >= 0
        && rect.right >= 0
        && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        && rect.left <= (window.innerWidth || document.documentElement.clientWidth);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>(".mvw-register-table img"));
  setInterval(() => Register.tryReplaceImage(images), 8000);
});
