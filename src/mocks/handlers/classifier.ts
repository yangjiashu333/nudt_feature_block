import { http, HttpResponse, delay } from 'msw';
import { mockClassifiers } from '@/mocks/data/classifiers';

export const classifierHandlers = [
  http.get('*/api/classifier/', async () => {
    await delay(500);
    return HttpResponse.json(mockClassifiers);
  }),
];
