/// <reference path="../../../tsd_modules/tsd.d.ts" />

module MVW.Gallery {
  let galleries : any;
  let pswpElement : any;

  export function openGallery(e: any) {
    let items = e.items;
    if (!items) {
      let preview = $(e).find(".preview");
      items = e.items = galleries[preview.data("year")][preview.data("gallery")];
    }

    let options: any = {
      getThumbBoundsFn() {
        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
        let rect = e.getBoundingClientRect();
        return { w: rect.width, x: rect.left, y: rect.top + pageYScroll };
      }
    };
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

    // create variable that will store real size of viewport
    let realViewportWidth: number;
    let useLargeImages = false;
    let firstResize = true;
    let isImageSourceChanged: boolean;

    // beforeResize event fires each time size of gallery viewport updates
    gallery.listen("beforeResize", () => {
      // gallery.viewportSize.x - width of PhotoSwipe viewport
      // gallery.viewportSize.y - height of PhotoSwipe viewport
      // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
      //                          1 (regular display), 2 (@2x, retina) ...

      // calculate real pixels when size changes
      realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;

      // code below is needed if you want image to switch dynamically on window.resize

      // find out if current images need to be changed
      if (useLargeImages && realViewportWidth < 750) {
        useLargeImages = false;
        isImageSourceChanged = true;
      } else if (!useLargeImages && realViewportWidth >= 750) {
        useLargeImages = true;
        isImageSourceChanged = true;
      }

      // invalidate items only when source is changed and when it's not the first update
      if (isImageSourceChanged && !firstResize) {
        // invalidateCurrItems sets a flag on slides that are in DOM,
        // which will force update of content (image) on window.resize.
        gallery.invalidateCurrItems();
      }

      if (firstResize) {
        firstResize = false;
      }

      isImageSourceChanged = false;
    });

    // gettingData event fires each time PhotoSwipe retrieves image source & size
    gallery.listen("gettingData", (index: number, item: any) => {
      // set image source & size based on real viewport width
      if (useLargeImages) {
        item.src = `/gallery/${item.b + item.f}`;
        item.w = item.o.w;
        item.h = item.o.h;
      } else {
        item.src = `/gallery/${item.b}m/${item.f}`;
        item.w = item.m.w;
        item.h = item.m.h;
      }
      if (item.t.indexOf(" ") > 0) {
        item.title = item.t;
      }

      // it doesn't really matter what will you do here, 
      // as long as item.src, item.w and item.h have valid values.
      // 
      // just avoid http requests in this listener, as it fires quite often
    });

    gallery.init();
  }

  function shufflePreview(e: any, isImmediate: boolean) {
    let g = e[0].images || (e[0].images = galleries[e.data("year")][e.data("gallery")]
                                           .filter((i: any) => (i.s.w === 200))
                                           || galleries[e.data("year")][e.data("gallery")]);
    if (isImmediate) {
      e.fadeOut(400, () => {
        let i = g[Math.floor(Math.random() * g.length)];
        e.attr("src", `/gallery/${i.b}s/${i.f}`);
      });
      e.fadeIn(400);
    }
    // 10 + [0..1] * 90 => first change after approx 10s - then approx. all 10s, assuming there are
    // ~100 images on the overview page
    setTimeout(() => { shufflePreview(e, true); }, 100000 + Math.random() * 900000);
  }

  export function initialize() {
    pswpElement = document.querySelectorAll(".pswp")[0];
    $.getJSON("/gallery/galleries.json", data => {
      galleries = data;
      $(".preview").each((i, p) => {
        shufflePreview($(p), false);
      });
    });
  }
}

$(() => { MVW.Gallery.initialize(); });
