# Website: Musikverein Wollbach

[![Build Status](https://travis-ci.com/Tiliavir/mvw-website.svg?branch=master)](https://travis-ci.com/tiliavir/mvw-website)

## Prerequisites

```powershell
npm install
```

## Build and release

```powershell
npm run release

cd ./_prod

npm run validate
```

Verify, that there are no build and validation issues. If so:
- commit
- tag
- push
- upload to FTP

## Debug / Test Build

```powershell
npm run serve
```

# Best Practices
## Adding new images to the website
Images have a specific width. Mostly they have a maximum of 1200px in any orientation. Furthermore EXIF information should be stripped away etc. This can easily be achieved using e.g. ImageMagick / GraphicsMagick.

Following snippet can be used to process all images in the current folder:

```powershell
ls ./*.jpg | % {
  $name = $_.Name
  gm convert $name -auto-orient -quality 70 -strip -resize '1200x1200' "c_$name"
}
```

## Adding new images to the gallery

Copy all input images to the directory `./root/gallery/<YEAR>/<AlbumName>/` directory. And run following command:

```powershell
npm run gallery
```

Move the newly added images to the gallery directory and run a new release to generate the gallery HTML from the updated `galleries.json`.
