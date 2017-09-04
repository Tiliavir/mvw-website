class Filter {
  private static containsAll(array: string[], find: string[]): boolean {
    return find.every((v) => {
      return array.indexOf(v) !== -1;
    });
  }

  private filters: string[] = [];

  public initialize() {
    $(".keyword-selector .keyword").each((i, e) => {
      const $e = $(e);
      $e.click(() => {
        $e.toggleClass("active");
        this.toggleFilter($e.text());
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
    if (this.filters.length > 0) {
      $(".tabs").hide();
      $(".tab-content .tab-pane").show();
      $(".tab-content .entry").each((i, entry) => {
        const $entry = $(entry);
        const itemTags: string[] = [];
        $entry.find(".keyword").each((j, e) => {
          itemTags.push($(e).text());
        });

        $entry.toggle(Filter.containsAll(itemTags, this.filters));
      });
    } else {
      $(".tabs").show();
      $(".tab-content .tab-pane").css("display", "");
      $(".tab-content .entry").show();
    }
  }
}

$(() => { new Filter().initialize(); });
