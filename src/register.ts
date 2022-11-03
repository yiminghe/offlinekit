import { Workbox, messageSW } from "workbox-window";

let isRefreshing = false;

export interface RegisterSWParams {
  /**
   * service worker url
   */
  url: string;
  /**
   * callback when upgrade happens
   */
  upgrade: () => void;
  /**
   * whether update when a new application version released
   */
  onNewAppVersion: (params: { newAppVersion: string }) => Promise<boolean>;
  /**
   * time interval to check service worker update
   */
  checkUpdateInterval: number;
}

export function registerSW({
  url,
  upgrade,
  onNewAppVersion,
  checkUpdateInterval,
}: RegisterSWParams) {
  const wb = new Workbox(url);

  wb.addEventListener("activated", (event) => {
    console.log("activated event", event);
    if (isRefreshing) {
      return;
    }
    // `event.isUpdate` will be true if another version of the service
    // worker was controlling the page when this version was registered.
    if (event.isUpdate) {
      upgrade();
    } else if (event.isExternal) {
      // If your service worker is configured to precache assets, those
      // assets should all be available now.
      upgrade();
    } else {
      console.log("Service worker activated for the first time!");
    }
  });

  wb.addEventListener("waiting", async (event) => {
    console.log("waiting event", event);
    // if (!event.isExternal) {
    const { sw: sw2 } = event as any;
    const newAppVersion: string = await messageSW(sw2!, {
      type: "appVersion",
    });

    const result = await onNewAppVersion({ newAppVersion });

    if (result) {
      wb.addEventListener("controlling", (controllingEvent) => {
        isRefreshing = true;
        console.log("controlling event", controllingEvent);
        window.location.reload();
      });

      wb.messageSkipWaiting();
    }
    // }
  });

  const regPromise: Promise<ServiceWorkerRegistration | undefined> =
    wb.register();

  const timer = setInterval(() => {
    wb.update();
  }, checkUpdateInterval);

  return {
    async unregister() {
      clearInterval(timer);
      const reg = await regPromise;
      if (reg) {
        return reg.unregister();
      }
    },
  };
}
