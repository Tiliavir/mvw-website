class Filter {
  private static containsAll(array: string[], find: string[]): boolean {
    return find.every((v) => array.includes(v));
  }

  private filters: string[] = [];

  public initialize() {
    const keywords = document.querySelectorAll(".keyword-selector .keyword");
    keywords.forEach((el) => {
      el.addEventListener("click", () => {
        el.classList.toggle("active");
        this.toggleFilter(el.textContent?.trim() || "");
      });
    });
  }

  private toggleFilter(filter: string): void {
    const index = this.filters.indexOf(filter);
    if (index === -1) {
      this.filters.push(filter);
    } else {
      this.filters.splice(index, 1);
    }
    this.updateFilter();
  }

  private updateFilter(): void {
    const tabs = document.querySelector<HTMLElement>(".tabs");
    const tabPanes = document.querySelectorAll<HTMLElement>(".tab-content .tab-pane");
    const entries = document.querySelectorAll<HTMLElement>(".tab-content .entry");

    if (this.filters.length > 0) {
      if (tabs) {
        tabs.style.display = "none";
      }
      tabPanes.forEach((pane) => (pane.style.display = "block"));

      entries.forEach((entry) => {
        const keywords = Array.from(entry.querySelectorAll(".keyword")).map(
            (k) => k.textContent?.trim() || ""
        );
        const visible = Filter.containsAll(keywords, this.filters);
        entry.style.display = visible ? "block" : "none";
      });
    } else {
      if (tabs) {
        tabs.style.display = "";
      }
      tabPanes.forEach((pane) => (pane.style.display = ""));
      entries.forEach((entry) => (entry.style.display = "block"));
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new Filter().initialize());
