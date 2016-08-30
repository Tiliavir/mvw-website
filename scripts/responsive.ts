/// <reference path="../main.d.ts" />

/*module MVW {
  $("table.responsive").each(function () {
    const headers : string[] = [];
    $(this).find("th").each(function() {
      headers.push($(this).text().trim());
    });

    let css = "<style>@media only screen and (max-width: 760px), (min-device-width: 768px)"
                                      + "and (max-device-width: 1024px) { ";
    for (let i in headers) {
      if (headers.hasOwnProperty(i)) {
        let header = headers[i].replace(/([\\"])/g, "\\$1").replace(/\n/g, " ");
        let num = parseInt(i, 10) + 1;
        css += `table.responsive td:nth-of-type(${num}):before { content: "${header}"; }\n`;
      }
    }
    css += " }</style>";
    $(css).appendTo("head");
  });
}*/
