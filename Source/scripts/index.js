var MVW;
(function (MVW) {
    var Start;
    (function (Start) {
        var slides = [
            {
                "title": "Musikverein",
                "url": "alle_1.jpg"
            },
            {
                "title": "Musikverein",
                "url": "alle_2.jpg"
            },
            {
                "title": "Musikverein",
                "url": "alle_3.jpg"
            },
            {
                "title": "Musikverein",
                "url": "alle_4.jpg"
            },
            {
                "title": "Musikverein",
                "url": "alle_5.jpg"
            },
            {
                "title": "Altsaxophon",
                "url": "altsaxophon.jpg"
            },
            {
                "title": "Baritonsaxophon",
                "url": "baritonsaxophon.jpg"
            },
            {
                "title": "Dampfmusik",
                "url": "dampfmusik.jpg"
            },
            {
                "title": "Euphonium",
                "url": "euphonium.jpg"
            },
            {
                "title": "Fagott",
                "url": "fagott.jpg"
            },
            {
                "title": "Gitarre",
                "url": "gitarre.jpg"
            },
            {
                "title": "Horn",
                "url": "horn.jpg"
            },
            {
                "title": "Klarinette",
                "url": "klarinette.jpg"
            },
            {
                "title": "Klavier",
                "url": "klavier.jpg"
            },
            {
                "title": "Posaune",
                "url": "posaune.jpg"
            },
            {
                "title": "Querflöte",
                "url": "querfloete.jpg"
            },
            {
                "title": "Saxophon",
                "url": "saxophon.jpg"
            },
            {
                "title": "Schlagzeug",
                "url": "schlagzeug.jpg"
            },
            {
                "title": "Tenorsaxophon",
                "url": "tenorsaxophon.jpg"
            },
            {
                "title": "Trompete",
                "url": "trompete.jpg"
            },
            {
                "title": "Tuba",
                "url": "tuba.jpg"
            }
        ];
        function shuffle(array) {
            var currentIndex = array.length;
            var temporaryValue;
            var randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }
        function initialize() {
            shuffle(slides).forEach(function (si, i) {
                $(".carousel-inner").append(("<div class='item'><img class='fill' src=\"/img/slider/" + si.url + "\" alt=\"")
                    + (si.title + "\" /><div class='carousel-caption'><h2>" + si.title + "</h2></div></div>"));
                $(".carousel-indicators").append("<li data-target='#startCarousel' data-slide-to='" + (i + 1) + "'></li>");
            });
            $("#startCarousel").carousel({ interval: 6000 });
        }
        Start.initialize = initialize;
    })(Start = MVW.Start || (MVW.Start = {}));
})(MVW || (MVW = {}));
