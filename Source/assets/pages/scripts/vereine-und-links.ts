/// <reference path="../../../tsd_modules/tsd.d.ts" />

module MVW.Vereine {
  $(() => {
    $("#content-main a.mvw-verein[href^=http]").each(function(i) {
      $(this).prepend(`<img src="http://www.google.com/s2/favicons?domain=${this.href}" `
                         + `alt="fav" width="16" height="16" />&nbsp;`);
    });
  });
}
