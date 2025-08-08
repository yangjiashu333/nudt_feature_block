import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

server.events.on('request:start', ({ request }) => {
  console.log('[MSW Server] Intercepted:', request.method, request.url);
});

server.events.on('response:mocked', ({ request, response }) => {
  console.log('[MSW Server] Mocked response for:', request.method, request.url, response.status);
});
