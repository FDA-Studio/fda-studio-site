import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    "name": "FDA Studio",
    "short_name": "FDA Studio",
    "icons": [
      {
        "src": "/icon-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icon-512.png",
        "sizes": "512x512",
        "type": "image/png"
      },
      {
        "src": "/icon-maskable-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],
    "theme_color": "#0A0A0B",
    "background_color": "#0A0A0B",
    "display": "standalone",
    "start_url": "/",
    "lang": "fr",
    "description": "Sites internet, intelligence artificielle, applications et jeux vidéo."
  };
}
