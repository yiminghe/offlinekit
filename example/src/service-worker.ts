/// <reference lib="webworker" />

import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import pkg from "../package.json";
import { ExpirationPlugin } from "workbox-expiration";
import { initSW } from "offlinekit/sw";

declare const self: ServiceWorkerGlobalScope;

initSW({
  getHtmlNameFromUrl(url: URL) {
    if (url.origin === self.location.origin && url.pathname === "/") {
      return "index";
    }
  },
  appVersion: process.env.REACT_APP_VERSION,
  appName: pkg.name,
  wbManifest: (self as any).__WB_MANIFEST,
  externalUrls: ["https://unpkg.com/reflect-metadata@0.1.13/Reflect.js"],
});

// after precache, cache other images
registerRoute(
  ({ request }) => {
    return request.destination === "image";
  },
  new NetworkFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);
