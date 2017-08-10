module MVW.Vereine {
  $(() => {
    $("a.mvw-verein[href^=http]").each((i, e) => {
      $(e).prepend(`<img src="http://www.google.com/s2/favicons?domain=${(<HTMLAnchorElement> e).href}" `
                         + `alt="fav" width="16" height="16" />&nbsp;`);
    });
  });
}
