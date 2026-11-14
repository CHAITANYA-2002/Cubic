/** A pre-rendered 3D object from /images/3d (see script/render-3d.ts). Decorative. */
export function Render3D({ name, className = "", float = false, eager = false, sizes = "(min-width: 1024px) 400px, 70vw" }: {
  name: string; className?: string; float?: boolean; eager?: boolean; sizes?: string;
}) {
  return (
    <img
      src={`/images/3d/${name}-400.webp`}
      srcSet={`/images/3d/${name}-400.webp 400w, /images/3d/${name}.webp 800w`}
      sizes={sizes}
      width={400}
      height={400}
      alt=""
      aria-hidden="true"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`render-3d ${float ? "render-float" : ""} ${className}`}
    />
  );
}
