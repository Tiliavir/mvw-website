---
title: Suche
description: Durchsuche Inhalte der Webseite des Musikvereins Wollbach 1866 e.V.
keywords: Suche, Seitensuche
schemaOrg: SearchResultsPage
menu: footer
customJs:
  - ts/suche.ts
customCss:
  - scss/suche.scss
---

<form itemprop="potentialAction" itemscope itemtype="http://schema.org/SearchAction">
  <meta itemprop="target" content="http://www.mv-wollbach.de/search.html?q={query}" />
  <input class="mvw-search-field" itemprop="query-input" placeholder="Suche..." type="search" name="query" />
</form>

<ol class="results">
</ol>
