import { http, HttpResponse, delay } from 'msw';
import { mockDatasets, mockImages } from '@/mocks/data/datasets';

export const datasetHandlers = [
  http.get('*/api/datasets', async () => {
    await delay(300);
    return HttpResponse.json(mockDatasets);
  }),

  http.get('*/api/images/:datasetId', async ({ params }) => {
    await delay(300);
    const datasetId = Number(params.datasetId);
    const images = mockImages[datasetId] || [];
    return HttpResponse.json(images);
  }),

  http.get('*/api/images/file', async ({ request }) => {
    const url = new URL(request.url);
    const imagePath = url.searchParams.get('image_path');

    if (!imagePath) {
      return new HttpResponse(null, { status: 404 });
    }

    return new HttpResponse(null, {
      status: 302,
      headers: {
        Location: imagePath,
      },
    });
  }),
];
