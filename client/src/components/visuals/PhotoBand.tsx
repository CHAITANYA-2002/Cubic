/** A full-width editorial photograph between sections. Decorative. */
export function PhotoBand({ photo }: { photo: string }) {
  return (
    <div className="photo-band" aria-hidden="true">
      <img
        src={`/images/photos/${photo}-800.webp`}
        srcSet={`/images/photos/${photo}-800.webp 800w, /images/photos/${photo}.webp 1600w`}
        sizes="100vw"
        width={1600}
        height={900}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
