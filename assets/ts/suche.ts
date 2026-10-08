import lunr from "lunr";
import stemmerSupport from "lunr-languages/lunr.stemmer.support";
import german from "lunr-languages/lunr.de";

stemmerSupport(lunr);
german(lunr);

interface SearchEntry {
  title: string;
  description?: string;
}

interface SearchData {
  index: object;
  store: Record<string, SearchEntry>;
}

class Search {
  private static index: lunr.Index;
  private static store: Record<string, SearchEntry> = {};

  public static initialize(): void {
    fetch("/suche/index.json")
        .then((response) => response.json())
        .then((data: SearchData) => {
          Search.index = lunr.Index.load(data.index);
          Search.store = data.store;

          const inputField = document.querySelector<HTMLInputElement>("input.mvw-search-field");
          if (!inputField) {
            return;
          }

          const params = new URLSearchParams(window.location.search);
          const query = params.get("query") || params.get("q");
          if (query) {
            inputField.value = query;
          }
          inputField.addEventListener("input", () => Search.handleSearch());
          Search.handleSearch();
        })
        .catch((err) => console.error("Failed to load search index:", err));
  }

  private static handleSearch(): void {
    const input = document.querySelector<HTMLInputElement>("input.mvw-search-field");
    const resultContainer = document.querySelector<HTMLElement>(".results");
    if (!input || !resultContainer) {
      return;
    }

    const results = Search.search(input.value);
    resultContainer.replaceChildren();
    resultContainer.classList.toggle("hidden", results.length === 0);

    for (const result of results) {
      const entry = Search.store[result.ref];
      if (entry) {
        resultContainer.appendChild(Search.renderResult(result.ref, entry));
      }
    }
  }

  private static search(input: string): lunr.Index.Result[] {
    const trimmer = lunr.de.trimmer ?? lunr.trimmer;
    const stemmer = lunr.de.stemmer ?? lunr.stemmer;
    const tokens: lunr.Token[] = lunr.tokenizer(input)
        .map((token) => trimmer(token))
        .filter((token): token is lunr.Token => Boolean(token) && token.toString().length > 0);
    if (tokens.length === 0) {
      return [];
    }

    return Search.index.query((query) => {
      for (const token of tokens) {
        const term = token.toString();
        query.term(term, {boost: 10});
        query.term(term, {usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 2});

        const stem = String(stemmer(token.clone()) ?? "");
        if (stem.length >= 3) {
          query.term(stem, {
            usePipeline: false,
            wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
            boost: 1,
          });
        }
      }
    });
  }

  private static renderResult(href: string, entry: SearchEntry): HTMLLIElement {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = entry.title;

    const heading = document.createElement("h2");
    heading.appendChild(link);

    const description = document.createElement("span");
    description.textContent = entry.description ?? "";

    const item = document.createElement("li");
    item.append(heading, description);
    return item;
  }
}

document.addEventListener("DOMContentLoaded", () => Search.initialize());
