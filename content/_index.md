---
title: Musikverein Wollbach 1866 e.V.
description: Die Website des Musikvereins Wollbach 1866 e.V. Alles rund um unsere Auftritte, Jugendarbeit, Besetzung, Bilder und Einblicke in die Vereinshistorie.
keywords: [Musikverein, Wollbach, Blasmusik, Instrument, Orchester, Verein, Musik, Jugendarbeit, Konzert, Tickets, Events, Jahreskonzert]
customCss:
  - scss/index.scss
customJs:
  - ts/termine.ts
---

{{< comment >}}
<header>
  <div class="open-air">
    <a href="{{< ref "2026-open-air.md" >}}">
      {{< figure src="img/open-air.jpg"
                 alt="Open-Air 2026"
                 sizes="(max-width: 480px) 480px, 768px"
                 isAboveTheFold=true
      >}}
    </a>
  </div>
</header>
{{< /comment >}}

{{< hero src="img/slider/alle-3.jpg"
          alt="Das ganze Orchester mit Instrumenten vor einem historischen Gebäude"
>}}
<h1>Willkommen beim Musikverein Wollbach</h1>

Der Musikverein Wollbach ist ein kreatives Blasorchester mit einer über 150-jährigen Tradition. Konzertante sinfonische
Blasmusik gehört ebenso zum Repertoire wie swingende Unterhaltungsmusik. Im Orchester spielen über 50 Musiker aller
Altersgruppen. Die Leitung des Orchesters hat seit 30 Jahren unser Dirigent Oliver Hauser.
{{< /hero >}}

{{< naechste-termine limit="3" >}}

<div class="tiles">
  {{< tile file="mitgliedschaft"
           anchor="aktive-mitgliedschaft"
           image="img/slider/saxophon.jpg"
           title="Mitspielen"
           text="Sie spielen ein Instrument oder möchten eines lernen? Proben sind donnerstags von 20 bis 22 Uhr in der Kandertalhalle – kommen Sie einfach vorbei."
  />}}
  {{< tile file="mitgliedschaft"
           anchor="passivmitglied-werden"
           image="img/slider/alle-1.jpg"
           title="Passivmitglied werden"
           text="Sie mögen unsere Musik und möchten den Verein unterstützen? Als Passivmitglied helfen Sie uns, Instrumente, Noten und Jugendarbeit zu finanzieren."
  />}}
  {{< tile file="gooding"
           image="img/gooding.webp"
           title="Einkaufen und unterstützen"
           text="Unterstützen Sie uns bei Ihren täglichen Online-Einkäufen – ganz nebenbei und ohne Extrakosten."
  />}}
</div>
