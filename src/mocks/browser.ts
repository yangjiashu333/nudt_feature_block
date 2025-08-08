import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

worker.events.on('request:start', ({ request }) => {
  console.log('[MSW] Intercepted:', request.method, request.url);
});

worker.events.on('response:mocked', ({ request, response }) => {
  console.log('[MSW] Mocked response for:', request.method, request.url, response.status);
});
