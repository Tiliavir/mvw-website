# Website: Musikverein Wollbach
[![Build State](https://github.com/Tiliavir/mvw-website/workflows/CI/badge.svg)](https://github.com/Tiliavir/mvw-website/actions)

## Prerequisites
[Install the extended / SCSS version of Hugo](https://gohugo.io/getting-started/installing/).

If you are on Ubuntu, download and install from [gohugoio releases on GitHub](https://github.com/gohugoio/hugo/releases/).
Take the latest `hugo_extended_*_Linux-64bit.deb` package.

## Debug / Test Build
```powershell
hugo serve
```

## Deploy
Be sure to have the `private.php` in the `files` directory:
```php
<?php
$RECAPTCHA_SECRET_KEY = "";

```
