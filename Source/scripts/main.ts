/// <reference path="../tsd_modules/tsd.d.ts" />

interface JQueryStatic {
  getUrlParams(q: string): { [key: string]: string; };
  getUrlParam(name: string, q: string): string;
}

module MVW {
  $.extend({
    getUrlParam(name: string, q: string) {
      return $.getUrlParams(q)[name];
    },
    getUrlParams(q: string) {
      let query = q || window.location.href;
      let vars: { [key: string]: string; } = {};
      let pairs = query.slice(query.indexOf("?") + 1).split(/[&#]/);
      for (var i = 0; i < pairs.length; i++) {
        let kvp = pairs[i].split("=");
        if (kvp.length === 2) {
          vars[kvp[0]] = kvp[1];
        }
      }
      return vars;
    }
  });

  $(document).ready(() => {
    $("#content-main a.mvw-verein[href^=http]").each(function(i) {
      $(this).prepend(`<img src="http://www.google.com/s2/favicons?domain=${this.href}" `
                         + `alt="fav" width="16" height="16" />&nbsp;`);
    });
  });
}
