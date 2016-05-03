/// <reference path="../../../typings/main.d.ts" />

module MVW.Start {
  let slides = [
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

  interface ISlide {
    title: string;
    url: string;
  }

  function shuffle(array : ISlide[]) : ISlide[] {
    let currentIndex = array.length;
    let temporaryValue : ISlide;
    let randomIndex : number;

    // while there remain elements to shuffle...
    while (0 !== currentIndex) {

      // pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // and swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  export function initialize(): void {
    shuffle(slides).forEach((si, i) => {
      $(".carousel-inner").append(`<div class='item'><img class='fill' src="/img/slider/${si.url}" alt="`
                                  + `${si.title }" /><div class='carousel-caption'><h2>${si.title}</h2></div></div>`);
      $(".carousel-indicators").append(`<li data-target='#startCarousel' data-slide-to='${i + 1}'></li>`);
    });
    $("#startCarousel").carousel({ interval: 6000 });
  }
}

$(() => { MVW.Start.initialize(); });
