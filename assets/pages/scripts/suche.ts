module MVW.Search {
  let index: any;
  let store: any;

  function handleSearch(e: KeyboardEvent) {
    let query = $(this).val();

    let result = index.search(query);

    let resultContainer = $('#results');
    if (result.length === 0) {
        resultContainer.hide();
    } else {
        resultContainer.empty();
        for (var item in result) {
            var ref = result[item].ref;
            var searchitem = '<li><a href="' + ref + '">' + store[ref].title + '</a></li>';
            resultContainer.append(searchitem);
        }
        resultContainer.show();
    }
  }
  
  export function initialize() {    
    $.getJSON('/index.json', data => {
      index = lunr.Index.load(data.index);
      store = data.store;
    }
    $('input#mvw-search-field').on('keyup', handleSearch);
  }
}

$(() => { MVW.Search.initialize(); });
