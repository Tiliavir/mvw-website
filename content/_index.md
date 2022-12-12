---
title: Musikverein Wollbach 1866 e.V.
description: Die Website des Musikvereins Wollbach 1866 e.V. Alles rund um unsere Auftritte, Jugendarbeit, Besetzung, Bilder und Einblicke in die Vereinshistorie.
keywords: [Wollbach, Musikverein, Musikverein Wollbach 1866 e.V., Verein, Musik, Orchester, Blasmusik, Instrument, Jugendarbeit, Konzert]
customCss:
  - scss/index.scss
customJs:
  - ts/index.ts
---

<header>
  <div class="mvw-brand">
    {{< figure src="slider/logo.png"
               alt="Das neue Logo des Musikvereins Wollbach"
    >}}
  </div>
  <div class="rock-symphony">
    <a href="{{< ref "2023-jahreskonzert.md" >}}">
      {{< figure src="/img/events/23-rock/rock.jpg"
                 alt="Jahreskonzert: Rock Symphony"
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
  {{< tile file="mitgliedschaft"
           image="slider/alle_4.jpg"
           title="Mitglied werden"
           text="Wir konnten Ihr Interesse an unserem Verein wecken und Sie wollen uns unterstützen? Hier können Sie Mitglied werden."
  />}}
  {{< tile file="2023-jahreskonzert"
           image="files/flyer/23_jahreskonzert_logo.jpg"
           title="Rock Symphony"
           text="Deep Purple und die Scorpions in der Kandertalhalle in Wollbach..."
  />}}
  {{< tile file="termine"
           image="img/jahreskonzerte/konzert_2020.jpg"
           title="Termine"
           text="Lust uns zu hören? Hier ist unser Terminkalender..."
  />}}
  {{< tile file="gooding"
           image="img/events/gooding.png"
           title="Unterstützen Sie uns"
           text="Unterstützen Sie uns bei Ihren täglichen Einkäufen – ganz nebenbei und ohne Extrakosten. Welche Unternehmen mitmachen sehen Sie hier..."
  />}}
</div>
