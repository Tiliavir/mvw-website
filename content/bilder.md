---
  title: Bilder
  description: Bildergalerie mit Bildern von diversen Konzerten, Festen und anderen Anlässen des Musikvereins Wollbach.
  keywords: Bilder, Bildergalerie, Fotos, Photos, Alben, Album, Fotoalbum
  schemaOrg: ImageGallery
  menu: main
  customCss:
    - scss/bilder.scss
    - gen/css/photoswipe.css
    - gen/css/default-skin.css
  customJs:
    - ts/bilder.ts
    - gen/js/photoswipe.min.js
    - gen/js/photoswipe-ui-default.min.js
---
-
    var galleries = require("partials/data/bilder.json");
    const galleries = !{JSON.stringify(galleries)};

  -
    var years = Object.keys(galleries).sort((a, b) => b - a);

  +renderTabs(years)

  .mvw-gallery-overview.tab-content
    - var yearTitles = Object.keys(galleries);
    each yearTitle, index in yearTitles
      - var year = galleries[yearTitle];
      .tab-pane(id=yearTitle class=(index === yearTitles.length - 1 ? "active" : ""))
        each galleryTitle in Object.keys(year).reverse()
          - var gallery = year[galleryTitle]
          .mvw-gallery-container
            .mvw-gallery(onclick="Gallery.openGallery(this); return false;")
              .ratio-content
                img.preview(src=gallery.i[0].u + "=w200-h200" alt=galleryTitle data-year=yearTitle data-gallery=galleryTitle)
                span.caption #{galleryTitle}

  .pswp(tabindex="-1" role="dialog" aria-hidden="true")
    //-
      Background of PhotoSwipe.
      It's a separate element as animating opacity is faster than rgba().
    .pswp__bg
    //- Slides wrapper with overflow:hidden.
    .pswp__scroll-wrap
      //-
        Container that holds slides.
        PhotoSwipe keeps only 3 of them in the DOM to save memory.
        Don't modify these 3 pswp__item elements, data is added later on.
      .pswp__container
        .pswp__item
        .pswp__item
        .pswp__item
      //- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed.
      .pswp__ui.pswp__ui--hidden
        .pswp__top-bar
          //- Controls are self-explanatory. Order can be changed.
          .pswp__counter
          button.pswp__button.pswp__button--close(title="Close (Esc)")
          button.pswp__button.pswp__button--share(title="Share")
          button.pswp__button.pswp__button--fs(title="Toggle fullscreen")
          button.pswp__button.pswp__button--zoom(title="Zoom in/out")
          //-
            Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR
            element will get class pswp__preloader--active when preloader is running
          .pswp__preloader
            .pswp__preloader__icn
              .pswp__preloader__cut
                .pswp__preloader__donut
        .pswp__share-modal.pswp__share-modal--hidden.pswp__single-tap
          .pswp__share-tooltip
        button.pswp__button.pswp__button--arrow--left(title="Previous (arrow left)")
        button.pswp__button.pswp__button--arrow--right(title="Next (arrow right)")
        .pswp__caption
          .pswp__caption__center