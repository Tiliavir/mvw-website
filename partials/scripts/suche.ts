module MVW.Search {
  let index: any;
  let store: any;

  function handleSearch(e: JQueryEventObject): void {
    let query = $("input.mvw-search-field").val();

    let result = index.search(query);

    let resultContainer = $(".results");
    if (result.length === 0) {
      resultContainer.hide();
    } else {
      resultContainer.empty();
      for (let item in result) {
        if (result.hasOwnProperty(item)) {
          let ref = result[item].ref;
          let i = `<li><a href="${ref}.html">${store[ref].title}</a><span>${store[ref].description}</span></li>`;
          resultContainer.append(i);
        }
      }
      resultContainer.show();
    }
  }

  function getParameterByName(name: string): string {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if (!results) {
      return null;
    }

    if (!results[2]) {
      return "";
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  export function initialize(): void {
    $.getJSON("/index.json", data => {
      index = lunr.Index.load(data.index);
      store = data.store;

      let query = getParameterByName("query") || getParameterByName("q");
      let inputField = $("input.mvw-search-field");
      if (query) {
        inputField.val(query);
      }
      inputField.on("keyup", handleSearch);
      handleSearch(null);
    });
  }
}

$(() => MVW.Search.initialize());
