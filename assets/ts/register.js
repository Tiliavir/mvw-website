"use strict";
var Register = (function () {
    function Register() {
    }
    Register.tryReplaceImage = function ($images) {
        var register = {
            Altsaxophon: ["altsaxophon_1.jpg", "altsaxophon_2.jpg", "altsaxophon_1.jpg"],
            Euphonium: ["euphonium_1.jpg", "euphonium_2.jpg"],
            Fagott: ["fagott_1.jpg", "fagott_2.jpg"],
            Gitarre: ["gitarre_1.jpg", "gitarre_2.jpg"],
            Horn: ["horn_1.jpg", "horn_2.jpg", "horn_3.jpg", "horn_4.jpg", "horn_5.jpg", "horn_6.jpg",
                "horn_7.jpg", "horn_8.jpg", "horn_9.jpg", "horn_10.jpg", "horn_11.jpg"],
            Klarinette: ["klarinette_1.jpg", "klarinette_2.jpg"],
            Klavier: ["klavier_1.jpg", "klavier_2.jpg"],
            Posaune: ["posaune_1.jpg", "posaune_2.jpg"],
            Querflöte: ["querfloete_1.jpg", "querfloete_2.jpg"],
            Schlagzeug: ["schlagzeug_1.jpg", "schlagzeug_2.jpg"],
            Tenorsaxophon: ["tenorsaxophon_1.jpg", "tenorsaxophon_2.jpg", "altsaxophon_1.jpg"],
            Trompete: ["trompete_1.jpg", "trompete_2.jpg"],
            Tuba: ["tuba_1.jpg", "tuba_2.jpg"]
        };
        var $image = $($images[Math.floor(Math.random() * $images.length)]);
        if (Register.isElementInViewport($image[0])) {
            var registerImageUrls_1 = register[$image.attr("title")].filter(function (url) {
                return !Register.endsWith($image.attr("src"), url);
            });
            $image.fadeOut("fast", function () {
                $image.attr("src", "/img/register/" + registerImageUrls_1[Math.floor(Math.random() * registerImageUrls_1.length)]);
                $image.fadeIn("slow");
            });
            return true;
        }
        return false;
    };
    Register.endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };
    Register.isElementInViewport = function (el) {
        var rect = el.getBoundingClientRect();
        return rect.bottom >= 0
            && rect.right >= 0
            && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
            && rect.left <= (window.innerWidth || document.documentElement.clientWidth);
    };
    return Register;
}());
$(function () {
    var $images = $(".mvw-register-table img");
    setInterval(function () {
        while (!Register.tryReplaceImage($images)) {
        }
    }, 8000);
});
