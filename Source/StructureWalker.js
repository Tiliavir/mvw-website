"use strict";

var structure = require("./data/site-structure.json");

function writeNavigationEntry(entry, n, type) {
  var html = "";
  if (entry
      && entry.children
      && (entry.children.filter(function (e) { return e.showInNavigation !== "none"; }).length > 0
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
    if (type === "allplain" || entry.showInNavigation !== "none") {
      html = indent(n, true)
               + "li(class=(page.referencedFile === '" + entry.referencedFile + "' ? 'active' : undefined))"
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

function performActionOnLeafInternal(entry, action, breadcrumb) {
  var currentBreadcrumb = JSON.parse(JSON.stringify(breadcrumb));
  currentBreadcrumb.push(entry);
  if (entry && entry.children) {
    for (var i = 0; i < entry.children.length; i++) {
      performActionOnLeafInternal(entry.children[i], action, currentBreadcrumb);
    }
    action(entry);
  } else {
    action(entry, currentBreadcrumb);
  }
}

module.exports = {
  writeNavigation: function (type) {
    var html = "ul" + (type !== "allplain" ? ".nav.navbar-nav.navbar-right" : "");
    if (structure && structure.length > 0) {
      for (var i = 0; i < structure.length; i++) {
        if (structure[i].showInNavigation === type
            || (type === "allplain"
                && structure[i].referencedFile != "404"
                && structure[i].referencedFile != "401")) {
          html += writeNavigationEntry(structure[i], 2, type);
        }
      }
    }
    return html;
  },

  performActionOnLeaf: function (action) {
    if (structure && structure.length > 0) {
      for (var i = 0; i < structure.length; i++) {
        performActionOnLeafInternal(structure[i], action, [{referencedFile:"index", title:"Start"}]);
      }
    }
  },

  getBreadcrumbHtml: function (breadcrumb) {
    var html = "<ol class=\"breadcrumb\" itemprop=\"breadcrumb\" itemscope itemtype=\"http://schema.org/BreadcrumbList\">";
    for (var i = 0; i < breadcrumb.length; i++) {
      if (breadcrumb[i].referencedFile) {
        html += "<li itemprop=\"itemListElement\" itemscope itemtype=\"http://schema.org/ListItem\">"
             + "<a itemprop=\"item\" href=\"" + breadcrumb[i].referencedFile + ".html\">"
             + "<span itemprop=\"name\">"
             + breadcrumb[i].title
             + "</span>"
             + "<meta itemprop=\"position\" content=\"" + (i+1) + "\" />"
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
}