class News {
  private filters: string[] = [];

  constructor() {
    $(".keyword-selector .keyword").each((i, e) => {
      let $e = $(e);
      $e.click(() => {
        $e.toggleClass("active");
        this.toggleFilter($e.text());
      });
    });
  }

  toggleFilter(filter: string): void {
    let index = this.filters.indexOf(filter);
    if (index === -1) {
      this.filters.push(filter);
    } else {
      this.filters.splice(index, 1);
    }
    this.updateFilter();
  }

  updateFilter(): void {
    if (this.filters.length > 0) {
      $(".nav-tabs").hide();
      $(".tab-content .tab-pane").show().css("opacity", "1");
      $(".tab-content .entry").each((i, entry) => {
        let $entry = $(entry);
        let itemTags: string[] = [];
        $entry.find(".keyword").each((j, e) => {
          itemTags.push($(e).text());
        });

        $entry.toggle(News.containsAll(itemTags, this.filters));
      });
    } else {
      $(".nav-tabs").show();
      $(".tab-content .tab-pane:not(.active)").css({ "opacity": 0, "display": "none" });
      $(".tab-content .entry").show();
    }
  }

  static containsAll(array: string[], find: string[]): boolean {
    return find.every((v) => {
      return array.indexOf(v) !== -1;
    });
  }
}

$(() => new News());
