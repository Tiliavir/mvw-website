import * as lunr from "lunr";

class Search {
  public static handleSearch(): void {
    const input = document.querySelector<HTMLInputElement>("input.mvw-search-field");
    if (!input) {
      return;
    }

    const query = input.value.trim();
    const resultContainer = document.querySelector<HTMLElement>(".results");
    if (!resultContainer){
      return;
    }

    const result = query ? Search.index.search(`*${query}*`) : [];

    if (!query || result.length === 0) {
      resultContainer.classList.add("hidden");
    } else {
      resultContainer.classList.remove("hidden");
      resultContainer.innerHTML = "";
      for (const item of result) {
        const ref = item.ref;
        const data = Search.store[ref];
        if (!data) {
          continue;
        }

        const li = document.createElement("li");
        li.innerHTML = `
          <h2><a href="${ref.replace(/^public\//, "/")}">${data.title}</a></h2>
          <span>${data.description}</span>
        `;
        resultContainer.appendChild(li);
      }
    }
  }

  public static initialize(): void {
    fetch("/suche/index.json")
        .then((response) => response.json())
        .then((data) => {
          Search.index = lunr.Index.load(data.index);
          Search.store = data.store;

          const inputField = document.querySelector<HTMLInputElement>("input.mvw-search-field");
          if (!inputField) {
            return;
          }

          const query = Search.getParameterByName("query") || Search.getParameterByName("q");

          if (query) {
            inputField.value = query;
          }
          inputField.addEventListener("keyup", () => Search.handleSearch());
          Search.handleSearch();
        })
        .catch((err) => console.error("Failed to load search index:", err));
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

document.addEventListener("DOMContentLoaded", () => Search.initialize());
