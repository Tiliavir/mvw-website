"use strict";

var validate = require('jsonschema').validate,
    schema = require("./site-structure-schema.json");

var structure;
var breadcrumbs;

function writeNavigationEntry(entry, n, type) {
  var html = "";
  if (entry
      && entry.children
      && (entry.children.filter(function (e) { return e.navigation !== "none"; }).length > 0
         || type === "allplain")) {
    html = indent(n, true)
             + "li"
             + (type !== "allplain" ? ".dropdown" : "")
             + indent(n + 2, true)
             + (type !== "allplain" ? "a.dropdown-toggle(href=\"#\" data-toggle=\"dropdown\") " : (entry.referencedFile ? "a(href=\"" + entry.referencedFile + ".html\") " : "div "))
             + entry.title
             + indent(n + 4, true)
             + (type !== "allplain" ? "b.caret" : "")
             + indent(n + 2, true)
             + "ul"
             + (type !== "allplain" ? ".dropdown-menu" : "");
    for (var i = 0; i < entry.children.length; i++) {
      html += writeNavigationEntry(entry.children[i], n + 4, type);
    }
  } else {
    if (type === "allplain" || entry.navigation !== "none") {
      html = indent(n, true)
               + "li(class=(referencedFile === '" + entry.referencedFile + "' ? 'active' : undefined))"
               + indent(n + 2, true)
               + "a(href=\"" + entry.referencedFile + ".html\") "
               + entry.title;
    }
  }
  return html;
}

function indent(n, nl) {
  return (nl ? "\r\n" : "") + Array(n + 1).join(" ");
}

function renderBreadcrumb(breadcrumb) {
  var html = "<ol class=\"breadcrumb\" itemprop=\"breadcrumb\" itemscope itemtype=\"http://schema.org/BreadcrumbList\">";
  for (var i = 0; i < breadcrumb.length; i++) {
    if (breadcrumb[i].referencedFile) {
      html += "<li itemprop=\"itemListElement\" itemscope itemtype=\"http://schema.org/ListItem\">"
            + "<a itemprop=\"item\" href=\"" + breadcrumb[i].referencedFile + ".html\">"
            + "<span itemprop=\"name\">"
            + breadcrumb[i].title
            + "</span>"
            + "<meta itemprop=\"position\" content=\"" + (i + 1) + "\" />"
            + "</a></li>";
    } else {
      html += "<li itemprop=\"itemListElement\" itemscope itemtype=\"http://schema.org/ListItem\">"
        + "<span itemprop=\"name\">"
        + breadcrumb[i].title
        + "</span>"
        + "<meta itemprop=\"position\" content=\"" + (i + 1) + "\" />"
        + "</li>";
    }
  }
  html += "</ol>";
  return html;
}

function initBreadcrumbs(branch, path) {
  var fork = path.slice(0);

  fork.push({
    "title": branch.title,
    "referencedFile": branch.referencedFile
  });

  breadcrumbs[branch.referencedFile] = fork;

  if (branch.children) {
    for (var i = 0; i < branch.children.length; i++) {
      initBreadcrumbs(branch.children[i], fork);
    }
  }
}

module.exports = {
  init: function(s) {
    var validation = validate(s, schema);

    if(!validation.valid) {
      console.log(validation);
      throw "Invalid structure provided!";
    }

    structure = s;
    breadcrumbs = {};
    for (var i = 0; i < structure.length; i++) {
      initBreadcrumbs(structure[i], [{"title": "Start", "referencedFile": "index"}]);
    }
  },

  writeNavigation: function (type) {
    var html = "ul" + (type !== "allplain" ? ".nav.navbar-nav.navbar-right" : "");
    if (structure && structure.length > 0) {
      for (var i = 0; i < structure.length; i++) {
        if ((structure[i].navigation || "top") === type
            || (type === "allplain"
                && structure[i].referencedFile != "404"
                && structure[i].referencedFile != "401")) {
          html += writeNavigationEntry(structure[i], 2, type);
        }
      }
    }
    return html;
  },

  getBreadcrumbHtml: function(referencedFile) {
    return renderBreadcrumb(breadcrumbs[referencedFile]);
  }
}