import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { setCacheNameDetails } from 'workbox-core';
import { registerRoute, NavigationRoute } from 'workbox-routing';

setCacheNameDetails({
  prefix: 'rainier',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime',
});

function isNotString<T>(arg: string | T): arg is T {
  return typeof arg !== 'string';
}

const webpackInjectedManifest = self.__WB_MANIFEST || [];

/**
 * The appShell doesn't have revision information, so we'll set it's revision
 * info to the same revision as the rainier client bundle. Everytime the rainier
 * client bundle changes, the appShell will also become stale.
 */
const rainierBundleRevision =
  webpackInjectedManifest
    .filter(isNotString)
    .find(({ url }) => url.includes('rainier.client.bundle'))?.revision ?? '';

/**
 * Add the appShell to the precache manifest
 */
const precacheManifest: (PrecacheEntry | string)[] = [
  ...webpackInjectedManifest,
  {
    url: '/?appShell=true',
    revision: rainierBundleRevision,
  },
];

/**
 * precache all webpack assets + app shell.
 */
precacheAndRoute(precacheManifest);

/**
 * All navigation requests will return the app shell. The data to populate
 * the dynamic content on the page will then be fetched on the browser.
 */
registerRoute(new NavigationRoute(createHandlerBoundToURL('/?appShell=true')));
