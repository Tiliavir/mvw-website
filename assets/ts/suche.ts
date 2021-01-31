import * as lunr from "lunr";

class Search {
  public static handleSearch(): void {
    const query = $("input.mvw-search-field").val();
    const result = Search.index.search(`*${query}*`);
    const resultContainer = $(".results");

    if (!query || result.length === 0) {
      resultContainer.hide();
    } else {
      resultContainer.empty();
      for (const item of result) {
        const ref = item.ref;
        const i = `<li>
                     <h2><a href="${ref.replace(/^public\//, "/")}">${Search.store[ref].title}</a></h2>
                     <span>${Search.store[ref].description}</span>
                   </li>`;
        resultContainer.append(i);
      }
      resultContainer.show();
    }
  }

  public static initialize(): void {
    $.getJSON("/suche/index.json", (data) => {
      Search.index = lunr.Index.load(data.index);
      Search.store = data.store;

      const query = Search.getParameterByName("query") || Search.getParameterByName("q");
      const inputField = $("input.mvw-search-field");
      if (query) {
        inputField.val(query);
      }
      inputField.on("keyup", Search.handleSearch);
      Search.handleSearch();
    });
  }

  private static index: lunr.Index;
  private static store: {[token: string]: {description: string, title: string}};

  private static getParameterByName(name: string): string {
    const url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) {
      return null;
    }

    if (!results[2]) {
      return "";
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}

$(() => Search.initialize());
