---
title: Musikverein Wollbach 1866 e.V.
description: Die Website des Musikvereins Wollbach 1866 e.V. Alles rund um unsere Auftritte, Jugendarbeit, Besetzung, Bilder und Einblicke in die Vereinshistorie.
keywords: [Musikverein, Wollbach, Blasmusik, Instrument, Orchester, Verein, Musik, Jugendarbeit, Konzert, Tickets, Events, Jahreskonzert]
customCss:
  - scss/index.scss
customJs:
  - ts/index.ts
---

<header>
  <div class="mvw-brand">
    {{< figure src="img/logo.png"
               alt="Das Logo des Musikvereins Wollbach 1866 e.V."
    >}}
  </div>
  <div class="open-air">
    <a href="{{< ref "2025-open-air.md" >}}">
      {{< figure src="img/events/25-open-air/open-air.jpg"
                 alt="Open-Air 2025"
      >}}
    </a>
  </div>
</header>

<h1 class="page-header">Willkommen beim Musikverein Wollbach</h1>

Der Musikverein Wollbach ist ein kreatives Blasorchester mit einer über 150-jährigen Tradition. Konzertante sinfonische
Blasmusik gehört ebenso zum Repertoire wie swingende Unterhaltungsmusik. Im Orchester spielen über 50 Musiker aller
Altersgruppen. Die Leitung des Orchesters hat seit über 25 Jahren der Dirigent Oliver Hauser.

{{< slider >}}

<div class="tiles">
  {{< tile file="2025-open-air.md"
           image="img/events/25-open-air/open-air.jpg"
           title="Open Air 2025"
           text="Der Schulhof in Wollbach wird am 5. Juli zur Freilichtbühne. Gereicht werden edle Weine, exklusives Bier und erlesene Speisen, sowie Erfrischungen an Sekt- und Cocktailbar."
  />}}
  {{< tile file="mitgliedschaft"
           image="slider/alle-1.jpg"
           title="Mitglied werden"
           text="Wir konnten Ihr Interesse an unserem Verein wecken und Sie wollen uns unterstützen? Hier können Sie Mitglied werden."
  />}}
  {{< tile file="termine"
           image="img/jahreskonzerte/konzert_2023-2.jpg"
           title="Termine"
           text="Lust uns zu hören? Hier ist unser Terminkalender..."
  />}}
  {{< tile file="gooding"
           image="img/events/gooding.png"
           title="Unterstützen Sie uns"
           text="Unterstützen Sie uns bei Ihren täglichen Einkäufen – ganz nebenbei und ohne Extrakosten. Welche Unternehmen mitmachen sehen Sie hier..."
  />}}
</div>
