import PhotoSwipe from "photoswipe/dist/photoswipe.esm";
import PhotoSwipeLightbox from "photoswipe/dist/photoswipe-lightbox.esm";

interface GalleryImage {
  t?: string;
  u: string;
}

interface GalleryAlbum {
  d: string;
  u: string;
  i: GalleryImage[];
}

class HTMLElementWithImages extends HTMLElement {
  images: GalleryImage[];
}

// bilder.json is inlined in bilder shortcode!
declare let galleries: { [year: string]: { [title: string]: GalleryAlbum } };

export class Gallery {
  private static sizes = [
    {query: "=w800-h800", desc: "w800"},
    {query: "=w1200-h1200", desc: "w1200"},
    {query: "=w2000-h2000", desc: "w2000"}
  ];
  private static lightbox = new PhotoSwipeLightbox({pswpModule: PhotoSwipe});

  public static openGallery(e: HTMLElement): void {
    let items = (<HTMLElementWithImages>e).images;
    if (!items) {
      const preview = $(e).find(".preview");
      items = (<HTMLElementWithImages>e).images = galleries[preview.data("year")][preview.data("gallery")].i;
    }

    Gallery.lightbox.loadAndOpen(0, items.map(i => ({
      srcset: Gallery.sizes.map(s => i.u + s.query + " " + s.desc).join(", "),
      src: i.u + "=w1200-h1200",
      alt: i.t
    })), null);
  }

  public static initialize(): void {
    $(".mvw-gallery img").on("mouseenter", (e) => {
      const $e = $(e.target);
      $e.attr("src", $e.attr("src").replace("=w200-h200", "=w800-h800"));
    });
    $(".mvw-gallery").on("click", (e) => this.openGallery(e.currentTarget));
    Gallery.shufflePreview();
  }

  private static shufflePreview(): void {
    const previews = $(".preview:visible");
    const e: JQuery = $(previews[Math.floor(Math.random() * previews.length)]);
    let g = (<HTMLElementWithImages>e[0]).images;
    if (!g) {
      g = (<HTMLElementWithImages>e[0]).images = galleries[e.data("year")][e.data("gallery")].i;
    }

    e.fadeOut(400, () => {
      const i = g[Math.floor(Math.random() * g.length)];
      e.attr("src", i.u + "=w800-h800");
    });
    e.fadeIn(400);

    setTimeout(() => Gallery.shufflePreview(), 10000);
  }
}

$(() => {
  Gallery.initialize();
});
