# offline toolkit using service worker

## API

### registerSW

```ts
import { registerSW } from 'offlinekit/register';
```

```ts
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
    onNewAppVersion: (params: {
        newAppVersion: string;
    }) => Promise<boolean>;
    /**
     * time interval to check service worker update
     */
    checkUpdateInterval: number;
}
export declare function registerSW({ url, upgrade, onNewAppVersion, checkUpdateInterval, }: RegisterSWParams): {
    unregister(): Promise<boolean | undefined>;
};

```

### initSW

```ts
import { initSW } from 'offlinekit/sw';
```

```ts
/// <reference lib="webworker" />
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
export declare function initSW({ getHtmlNameFromUrl, wbManifest, externalUrls, appVersion, appName, }: InitSWParams): void;

```

### initServer

For testing

```js
const { initServer } = require('offlinekit/server');
const path = require('path');
const buildDir = path.join(__dirname, 'build');

const {app,handle} = initServer({
  buildDir
});

app.get('/', handle('index.html'));
app.get(/.*\.html$/, handle('index.html'));

app.listen(8080);

console.log('http://127.0.0.1:8080/');
console.log();
```

## notice

need to rename static html with version before publish

```sh
index.html -> index-1.0.html
```