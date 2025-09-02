import { http, HttpResponse, delay } from 'msw';
import { mockBackbones } from '@/mocks/data/backbones';

export const backboneHandlers = [
  http.get('*/api/backbone/', async () => {
    await delay(500);
    return HttpResponse.json(mockBackbones);
  }),
];
