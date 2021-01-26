"use strict";
var Gallery = (function () {
    function Gallery() {
    }
    Gallery.openGallery = function (e) {
        var items = e.items;
        if (!items) {
            var preview = $(e).find(".preview");
            items = e.items = Gallery.galleries[preview.data("year")][preview.data("gallery")].i;
        }
        var options = {
            getThumbBoundsFn: function () {
                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                var rect = e.getBoundingClientRect();
                return { w: rect.width, x: rect.left, y: rect.top + pageYScroll };
            }
        };
        var gallery = new PhotoSwipe(Gallery.pswpElement, PhotoSwipeUI_Default, items, options);
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
                item.src = item.u + "=w1200-h1200";
                item.w = "1200";
                item.h = "1200";
            }
            else {
                item.src = item.u + "=w800-h800";
                item.w = "800";
                item.h = "800";
            }
            if (item.t != null) {
                item.title = item.t;
            }
        });
        gallery.init();
    };
    Gallery.initialize = function () {
        Gallery.pswpElement = document.querySelectorAll(".pswp")[0];
        $(".mvw-gallery img").hover(function (e) {
            var $e = $(e.target);
            $e.attr("src", $e.attr("src").replace("=w200-h200", "=w800-h800"));
        });
        Gallery.galleries = galleries;
        Gallery.shufflePreview();
    };
    Gallery.shufflePreview = function () {
        var previews = $(".preview:visible");
        var e = $(previews[Math.floor(Math.random() * previews.length)]);
        var g = e[0].images || (e[0].images = Gallery.galleries[e.data("year")][e.data("gallery")].i);
        e.fadeOut(400, function () {
            var i = g[Math.floor(Math.random() * g.length)];
            e.attr("src", i.u + "=w800-h800");
        });
        e.fadeIn(400);
        setTimeout(function () { return Gallery.shufflePreview(); }, 10000);
    };
    return Gallery;
}());
$(function () { Gallery.initialize(); });
