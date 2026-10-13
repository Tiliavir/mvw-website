class YouTube {
  private static readonly consentKey = "mvw-youtube-consent";

  public static initialize(): void {
    const containers = document.querySelectorAll<HTMLElement>(".youtube-dsgvo-container");
    if (!containers.length) return;

    const loadAll = (): void => containers.forEach((container) => YouTube.load(container));

    if (localStorage.getItem(YouTube.consentKey) === "granted") {
      loadAll();
      return;
    }

    document.querySelectorAll<HTMLElement>(".youtube-dsgvo-load").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.setItem(YouTube.consentKey, "granted");
        loadAll();
      });
    });
  }

  private static load(container: HTMLElement): void {
    const id = container.dataset["youtubeId"];
    if (!id) return;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.style.cssText = "position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;";
    container.replaceChildren(iframe);
  }
}

document.addEventListener("DOMContentLoaded", () => YouTube.initialize());
