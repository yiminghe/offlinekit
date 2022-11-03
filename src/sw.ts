/// <reference lib="webworker" />

import { clientsClaim, setCacheNameDetails } from "workbox-core";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";

export interface InitSWParams {
  /**
   * current application version
   */
  appVersion: string;
  /**
   * current application name
   */
  appName: string;
  /**
   * other cached url
   */
  externalUrls?: string[];
  /**
   * workbox manifest object
   */
  wbManifest: any;
  /**
   * get static html name from url
   */
  getHtmlNameFromUrl: (url: URL) => string | undefined;
}

declare const self: ServiceWorkerGlobalScope;

export function initSW({
  getHtmlNameFromUrl,
  wbManifest,
  externalUrls,
  appVersion,
  appName,
}: InitSWParams) {
  setCacheNameDetails({
    prefix: appName,
  });

  clientsClaim();

  let allHtml: string[] = [];

  const precacheOptions = {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/],
  };

  function getVersionedHtml(url: string) {
    return url.replace(/\.html$/, `-${appVersion}.html`);
  }

  {
    const myPrecacheAndRoute = (entries: any) => {
      const newEntries: any = [];
      for (const e of entries) {
        let { url } = e;
        if (url.endsWith(".html")) {
          allHtml.push(url);
          url = getVersionedHtml(url);
        }
        newEntries.push({
          ...e,
          url,
        });
      }

      console.log("precacheAndRoute", newEntries);

      precacheAndRoute(newEntries, precacheOptions);
    };

    myPrecacheAndRoute(wbManifest);

    // extra url to cache
    if (externalUrls) {
      precacheAndRoute(
        externalUrls.map((url) => ({
          url,
          revision: null,
        })),
        precacheOptions
      );
    }
  }

  const handleMap: any = {};

  function getFullHtmlPathFromUrl(url: URL) {
    let ret = "";
    let htmlName = getHtmlNameFromUrl(url);
    if (!htmlName) {
      return ret;
    }
    if (!htmlName.endsWith(".html")) {
      htmlName += ".html";
    }
    for (const url of allHtml) {
      if (url.endsWith(htmlName)) {
        ret = url;
      }
    }
    return ret;
  }

  function getHandler(url: string) {
    let handler = handleMap[url];
    if (!handler) {
      handler = createHandlerBoundToURL(url);
    }
    return handler;
  }

  registerRoute(
    ({ request, url }: { request: Request; url: URL }) =>
      request.mode === "navigate" && getHtmlNameFromUrl(url),
    async (options: any) => {
      // upgrade if only one client
      if (
        self.registration.waiting &&
        (await self.clients.matchAll()).length < 2
      ) {
        self.registration.waiting.postMessage({
          type: "SKIP_WAITING",
        });
        return new Response("", { headers: { Refresh: "0" } });
      }
      const { url } = options;
      const fullPath = getFullHtmlPathFromUrl(url);
      if (fullPath) {
        return getHandler(getVersionedHtml(fullPath))(options);
      } else {
        throw new Error("Can not find cached html: " + url);
      }
    }
  );

  // This allows the web app to trigger skipWaiting via
  // registration.waiting.postMessage({type: 'SKIP_WAITING'})
  self.addEventListener("message", (event) => {
    if (event.data) {
      const { type } = event.data;
      if (type === "SKIP_WAITING") {
        self.skipWaiting();
      } else if (type === "appVersion") {
        event.ports[0].postMessage(appVersion);
      }
    }
  });
}
