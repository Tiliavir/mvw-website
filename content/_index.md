---
title: Musikverein Wollbach 1866 e.V.
description: Die Website des Musikvereins Wollbach 1866 e.V. Alles rund um unsere Auftritte, Jugendarbeit, Besetzung, Bilder und Einblicke in die Vereinshistorie.
keywords: [Musikverein, Wollbach, Blasmusik, Instrument, Orchester, Verein, Musik, Jugendarbeit, Konzert, Tickets, Events, Jahreskonzert]
customCss:
  - scss/index.scss
customJs:
  - ts/index.ts
---

{{< comment >}}
<header>
  <div class="mvw-brand">
    {{< figure src="img/logo.png"
               alt="Das Logo des Musikvereins Wollbach 1866 e.V."
               sizes="(max-width: 480px) 480px, 768px"
               isAboveTheFold=true
    >}}
  </div>
  <div class="open-air">
    <a href="{{< ref "2025-open-air.md" >}}">
      {{< figure src="img/open-air.jpg"
                 alt="Open-Air 2025"
                 sizes="(max-width: 480px) 480px, 768px"
                 isAboveTheFold=true
      >}}
    </a>
  </div>
</header>
{{< /comment >}}

<h1 class="page-header">Willkommen beim Musikverein Wollbach</h1>

Der Musikverein Wollbach ist ein kreatives Blasorchester mit einer über 150-jährigen Tradition. Konzertante sinfonische
Blasmusik gehört ebenso zum Repertoire wie swingende Unterhaltungsmusik. Im Orchester spielen über 50 Musiker aller
Altersgruppen. Die Leitung des Orchesters hat seit über 25 Jahren der Dirigent Oliver Hauser.

{{< slider height="500"
           unit="px"
           duration="7000"
           images="img/slider/alle-1.jpg,img/slider/tuba-1.jpg,img/slider/dampfmusik.jpg,img/slider/klarinette.jpg,img/slider/konzert_2020.jpg,img/slider/trompete-2.jpg,img/slider/alle-2.jpg,img/slider/guitar.jpg,img/slider/konzert_2018.jpg,img/slider/saxophon-1.jpg,img/slider/trompete-1.jpg,img/slider/alle-3.jpg,img/slider/horn.jpg,img/slider/konzert_2019.jpg,img/slider/saxophon.jpg,img/slider/konzert_2023.jpg"
>}}

<div class="tiles">
  {{< tile file="mitgliedschaft"
           image="img/slider/alle-1.jpg"
           title="Mitglied werden"
           text="Wir konnten Ihr Interesse an unserem Verein wecken und Sie wollen uns unterstützen? Hier können Sie Mitglied werden."
  />}}
  {{< tile file="termine"
           image="img/termine.webp"
           title="Termine"
           text="Lust uns zu hören? Hier ist unser Terminkalender..."
  />}}
  {{< tile file="gooding"
           image="img/gooding.webp"
           title="Unterstützen Sie uns"
           text="Unterstützen Sie uns bei Ihren täglichen Einkäufen – ganz nebenbei und ohne Extrakosten. Welche Unternehmen mitmachen sehen Sie hier..."
  />}}
</div>
