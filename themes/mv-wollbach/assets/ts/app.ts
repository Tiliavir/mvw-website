class App {
  public static initialize(): void {
    App.registerScroll();
    App.fixAnchors();
    App.registerPopUp();
    App.initializeTabs();
  }

  private static registerScroll(): void {
    const nav = document.querySelector<HTMLElement>(".navigation");
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > nav.offsetHeight * 2) {
        nav.classList.add("inverse");
      } else {
        nav.classList.remove("inverse");
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("load", onScroll);
    window.addEventListener("resize", onScroll);
  }

  private static fixAnchors(): void {
    const pathname = window.location.href.split("#")[0];
    const anchors = document.querySelectorAll<HTMLAnchorElement>("a[href^='#']");
    anchors.forEach((anchor) => {
      anchor.href = pathname + anchor.getAttribute("href");
    });
  }

  private static registerPopUp(): void {
    if (localStorage.getItem("mvw-popup") === "dont-show"
        || sessionStorage.getItem("mvw-popup") === "dont-show") {
      return;
    }

    const popup = document.querySelector<HTMLElement>(".mail-popup");
    if (!popup) {
      return;
    }

    const onScroll = () => {
      if (window.scrollY > 200) {
        popup.classList.add("visible");
      }
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("load", onScroll);
    window.addEventListener("resize", onScroll);

    const closeBtn = popup.querySelector<HTMLElement>(".close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        sessionStorage.setItem("mvw-popup", "dont-show");
        popup.remove();
      });
    }

    const dontShowBtn = popup.querySelector<HTMLElement>(".dont-show");
    if (dontShowBtn) {
      dontShowBtn.addEventListener("click", () => {
        localStorage.setItem("mvw-popup", "dont-show");
        popup.remove();
      });
    }
  }

  private static setActive(id: string): void {
    document.querySelectorAll(".tab-pane")
            .forEach((el) => el.classList.remove("active"));
    document.querySelectorAll(".tab")
            .forEach((el) => el.classList.remove("active"));

    document.querySelector(`.tab-${id}`)?.classList.add("active");
    document.getElementById(id)?.classList.add("active");
  }

  public static initializeTabs(): void {
    const url: string = window.location.href;

    const startIndex = url.indexOf("#") + 1;
    if (startIndex > 0) {
      const id = url.substring(startIndex);
      if (id.length > 0) {
        App.setActive(id);
      }
    }

    document.querySelectorAll<HTMLElement>(".tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const tabId = target.dataset["tab"];
        console.log(tabId);
        if (tabId) {
          App.setActive(tabId);
        }
        e.preventDefault(); // prevent auto scroll to target
        e.stopPropagation();
      });
    });

    document.querySelectorAll<HTMLElement>(".tab-dropdown").forEach((dropdown) => {
      dropdown.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.toggle("open");
      });
    });

    document.querySelectorAll<HTMLElement>(".tab-dropdown-menu .tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const dropdown = (e.target as HTMLElement).closest(".tab-dropdown");
        if (dropdown) dropdown.classList.remove("open");
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => App.initialize());
