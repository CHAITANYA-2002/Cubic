import { useLocation } from "wouter";
import { bannerForPath } from "@/data/banners";
import { Aurora } from "./Aurora";
export function Banner({ name, hero = true }: { name?: string; hero?: boolean }) {
  const [location] = useLocation();
  const image = name ?? bannerForPath(location);
  return <div className="banner-art" aria-hidden="true"><img src={`/images/banners/${image}.webp`} srcSet={`/images/banners/${image}-960.webp 960w, /images/banners/${image}.webp 1920w`} sizes="100vw" width="1920" height="1080" decoding={hero ? "sync" : "async"} alt="" loading={hero ? "eager" : "lazy"} {...(hero ? { fetchpriority: "high" } : {})} /><div className="banner-shade" /><Aurora soft /></div>;
}
