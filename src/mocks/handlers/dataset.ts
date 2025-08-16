import { http, HttpResponse } from 'msw';
import { mockDatasets, mockImages } from '@/mocks/data/datasets';

export const datasetHandlers = [
  // GET /api/datasets
  http.get('*/api/datasets', async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log('[MSW Server] Mocked response for: GET /api/datasets');
    return HttpResponse.json(mockDatasets);
  }),

  // GET /api/images/:datasetId
  http.get('*/api/images/:datasetId', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const datasetId = Number(params.datasetId);
    const images = mockImages[datasetId] || [];
    
    console.log(`[MSW Server] Mocked response for: GET /api/images/${datasetId}`);
    return HttpResponse.json(images);
  }),

  // GET /api/images/file (for image URLs)
  http.get('*/api/images/file', ({ request }) => {
    const url = new URL(request.url);
    const imagePath = url.searchParams.get('image_path');
    
    // Return a placeholder image for development
    // In real implementation, this would serve the actual image file
    console.log(`[MSW Server] Mocked image request for: ${imagePath}`);
    
    // Return a simple placeholder response
    return HttpResponse.text('Mock image data', {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  }),
];