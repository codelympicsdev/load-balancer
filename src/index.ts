import CloudflareWorkerGlobalScope from 'types-cloudflare-worker';
// @ts-ignore
declare var self: CloudflareWorkerGlobalScope;
import { Router, Worker } from 'cf-worker-kit';
import { host } from 'cf-worker-kit/lib/conditions';
import { getAPIEndpoint, getAuthEndpoint } from './datacenters';

const worker = new Worker();
const router = new Router();

router.handle(host('api.codelympics.dev'), async req => {
  try {
    const endpoint = getAPIEndpoint(req.cf ? req.cf.colo : '');
    const url = new URL(req.url);
    const newURL = 'https://' + endpoint + url.pathname + url.search;
    return fetch(newURL, req);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
});

router.handle(host('auth.codelympics.dev'), async req => {
  try {
    const endpoint = getAuthEndpoint(req.cf.colo);
    const url = new URL(req.url);
    const newURL = 'https://' + endpoint + url.pathname + url.search;
    return fetch(newURL, req);
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
});

worker.use(router);
worker.listen();
