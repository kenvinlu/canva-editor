import { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getManifest } from "@canva-web/config/Env";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const headersList = await headers();
  const hostname = headersList.get("host");
  const manifest = getManifest([
    {
      src: `https://${hostname}/android-chrome-192x192.png`,
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: `https://${hostname}/android-chrome-512x512.png`,
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ]);
  return manifest;
}
