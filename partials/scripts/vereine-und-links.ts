$(() => {
  $("a.mvw-verein[href^=http]").each((i, e) => {
    $(e).prepend(`<img src="https://www.google.com/s2/favicons?domain=${(e as HTMLAnchorElement).href}" `
                        + `alt="fav" width="16" height="16" />&nbsp;`);
  });
});
