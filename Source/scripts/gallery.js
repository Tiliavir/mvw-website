var MVW;
(function (MVW) {
    var Gallery;
    (function (Gallery) {
        var galleries;
        var pswpElement;
        function openGallery(e) {
            var items = e.items;
            if (!items) {
                var preview = $(e).find(".preview");
                items = e.items = galleries[preview.data("year")][preview.data("gallery")];
            }
            var options = {
                getThumbBoundsFn: function () {
                    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                    var rect = e.getBoundingClientRect();
                    return { w: rect.width, x: rect.left, y: rect.top + pageYScroll };
                }
            };
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            var realViewportWidth;
            var useLargeImages = false;
            var firstResize = true;
            var isImageSourceChanged;
            gallery.listen("beforeResize", function () {
                realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;
                if (useLargeImages && realViewportWidth < 750) {
                    useLargeImages = false;
                    isImageSourceChanged = true;
                }
                else if (!useLargeImages && realViewportWidth >= 750) {
                    useLargeImages = true;
                    isImageSourceChanged = true;
                }
                if (isImageSourceChanged && !firstResize) {
                    gallery.invalidateCurrItems();
                }
                if (firstResize) {
                    firstResize = false;
                }
                isImageSourceChanged = false;
            });
            gallery.listen("gettingData", function (index, item) {
                if (useLargeImages) {
                    item.src = "/gallery/" + (item.b + item.f);
                    item.w = item.o.w;
                    item.h = item.o.h;
                }
                else {
                    item.src = "/gallery/" + item.b + "m/" + item.f;
                    item.w = item.m.w;
                    item.h = item.m.h;
                }
            });
            gallery.init();
        }
        Gallery.openGallery = openGallery;
        function shufflePreview(e, isImmediate) {
            var g = e[0].images || (e[0].images = galleries[e.data("year")][e.data("gallery")]
                .filter(function (i) { return (i.s.w === 200); })
                || galleries[e.data("year")][e.data("gallery")]);
            if (isImmediate) {
                e.fadeOut(400, function () {
                    var i = g[Math.floor(Math.random() * g.length)];
                    e.attr("src", "/gallery/" + i.b + "s/" + i.f);
                });
                e.fadeIn(400);
            }
            setTimeout(function () { shufflePreview(e, true); }, 100000 + Math.random() * 900000);
        }
        function initialize() {
            pswpElement = document.querySelectorAll(".pswp")[0];
            $.getJSON("/gallery/galleries.json", function (data) {
                galleries = data;
                $(".preview").each(function (i, p) {
                    shufflePreview($(p), false);
                });
            });
        }
        Gallery.initialize = initialize;
    })(Gallery = MVW.Gallery || (MVW.Gallery = {}));
})(MVW || (MVW = {}));
