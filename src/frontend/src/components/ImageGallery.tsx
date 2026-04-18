import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!images.length) {
    return (
      <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
        <span className="text-4xl">🏛️</span>
      </div>
    );
  }

  const prevIdx = (idx: number) => (idx - 1 + images.length) % images.length;
  const nextIdx = (idx: number) => (idx + 1) % images.length;

  const dots = images.map((_, i) => ({ id: `dot-${i}`, i }));
  const thumbs = images.map((url, i) => ({ id: `thumb-${i}`, url, i }));

  return (
    <>
      {/* Main image */}
      <button
        type="button"
        className="relative aspect-video overflow-hidden rounded-xl bg-muted cursor-pointer group w-full text-left"
        data-ocid="image_gallery.canvas_target"
        onClick={() => setLightbox(current)}
        aria-label={`View ${alt} full screen`}
      >
        <img
          src={images[current]}
          alt={`${alt} - view ${current + 1}`}
          className="w-full h-full object-cover group-hover:scale-102 transition-smooth"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(prevIdx(current));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-smooth shadow-elevated"
              aria-label="Previous"
              data-ocid="image_gallery.prev_button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(nextIdx(current));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-smooth shadow-elevated"
              aria-label="Next"
              data-ocid="image_gallery.next_button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {dots.map(({ id, i }) => (
                <button
                  type="button"
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrent(i);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-smooth ${
                    i === current ? "bg-card" : "bg-card/50"
                  }`}
                  aria-label={`Go to ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {thumbs.map(({ id, url, i }) => (
            <button
              type="button"
              key={id}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-smooth ${
                i === current
                  ? "border-primary"
                  : "border-transparent hover:border-border"
              }`}
              aria-label={`Thumbnail ${i + 1}`}
            >
              <img
                src={url}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <dialog
          open
          className="fixed inset-0 z-50 m-0 max-w-none w-full h-full bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(null)}
          aria-label="Fullscreen gallery"
          data-ocid="image_gallery.dialog"
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightbox]}
              alt={`${alt} full view`}
              className="w-full h-auto rounded-xl max-h-[80vh] object-contain"
            />
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-muted transition-smooth shadow-elevated"
              aria-label="Close"
              data-ocid="image_gallery.close_button"
            >
              <X className="w-4 h-4" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setLightbox(prevIdx(lightbox))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 flex items-center justify-center text-foreground hover:bg-card transition-smooth"
                  aria-label="Previous"
                  data-ocid="image_gallery.lightbox_prev"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightbox(nextIdx(lightbox))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 flex items-center justify-center text-foreground hover:bg-card transition-smooth"
                  aria-label="Next"
                  data-ocid="image_gallery.lightbox_next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}
