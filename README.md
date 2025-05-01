# Website: Musikverein Wollbach
[![Build State](https://github.com/Tiliavir/mvw-website/workflows/CI/badge.svg)](https://github.com/Tiliavir/mvw-website/actions)

## Prerequisites
[Install the extended / SCSS version of Hugo](https://gohugo.io/getting-started/installing/).

If you are on Ubuntu, download and install from [gohugoio releases on GitHub](https://github.com/gohugoio/hugo/releases/).
Take the latest `hugo_extended_*_Linux-64bit.deb` package.

## Debug / Test Build
```bash
hugo serve
```

## Deploy
Deployment happens automatically on tag on master.

## Best Practices
### Add images
To reduce image size, and to get rid of exif info
```bash
$ mogrify -strip -auto-orient -resize 2000x2000 -quality 80 **/*.jpg
```
