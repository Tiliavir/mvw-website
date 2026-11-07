class Filter {
  private static containsAll(array: string[], find: string[]): boolean {
    return find.every((v) => array.includes(v));
  }

  private static text(el: Element): string {
    return el.textContent?.trim() ?? "";
  }

  private readonly filters: string[] = [];

  public initialize(): void {
    document.querySelectorAll<HTMLButtonElement>(".keyword").forEach((el) => {
      el.addEventListener("click", () => this.toggleFilter(Filter.text(el)));
    });

    document.querySelector<HTMLButtonElement>(".filter-reset")?.addEventListener("click", () => {
      this.filters.splice(0, this.filters.length);
      this.updateFilter();
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
    const active = this.filters.length > 0;

    document.querySelectorAll<HTMLButtonElement>(".keyword").forEach((el) => {
      const selected = this.filters.includes(Filter.text(el));
      el.classList.toggle("active", selected);
      el.setAttribute("aria-pressed", String(selected));
    });

    const status = document.querySelector<HTMLElement>(".filter-status");
    if (status) {
      status.hidden = !active;
      const label = status.querySelector<HTMLElement>(".filter-active");
      if (label) {
        label.textContent = this.filters.join(", ");
      }
    }

    if (tabs) {
      tabs.style.display = active ? "none" : "";
    }
    tabPanes.forEach((pane) => {
      pane.style.display = active ? "block" : "";
    });
    entries.forEach((entry) => {
      const keywords = Array.from(entry.querySelectorAll(".keyword")).map(Filter.text);
      entry.hidden = active && !Filter.containsAll(keywords, this.filters);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new Filter().initialize());
