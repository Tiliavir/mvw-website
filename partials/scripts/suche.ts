namespace MVW.Search {
  let index: any;
  let store: any;

  function handleSearch(e: JQueryEventObject): void {
    const query = $("input.mvw-search-field").val();

    const result = index.search(`*${query}*`);

    const resultContainer = $(".results");
    if (result.length === 0) {
      resultContainer.hide();
    } else {
      resultContainer.empty();
      for (const item of result) {
        const ref = item.ref;
        const i = `<li>
                     <h2><a href="${ref}.html">${store[ref].title}</a></h2>
                     <span>${store[ref].description}</span>
                   </li>`;
        resultContainer.append(i);
      }
      resultContainer.show();
    }
  }

  function getParameterByName(name: string): string {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
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

  export function initialize(): void {
    $.getJSON("/index.json", (data) => {
      index = lunr.Index.load(data.index);
      store = data.store;

      const query = getParameterByName("query") || getParameterByName("q");
      const inputField = $("input.mvw-search-field");
      if (query) {
        inputField.val(query);
      }
      inputField.on("keyup", handleSearch);
      handleSearch(null);
    });
  }

  $(() => MVW.Search.initialize());
}
