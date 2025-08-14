import { http, HttpResponse } from 'msw';
import type {
  FeatureListReply,
  FeatureCreateRequest,
  FeatureCreateReply,
  FeatureUpdateRequest,
} from '@/types/feature';
import {
  mockFeatures,
  createFeature,
  findFeatureById,
  updateFeature,
  deleteFeature,
} from '../data/features';
import { mockSession } from '../data/session';

export const featureHandlers = [
  http.get('*/api/feature_extractor', async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const response: FeatureListReply = [...mockFeatures];
    return HttpResponse.json(response);
  }),

  http.post('*/api/feature_extractor', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const data = (await request.json()) as FeatureCreateRequest;

    const existingFeature = mockFeatures.find((f) => f.name === data.name);
    if (existingFeature) {
      return HttpResponse.json({ message: '特征名称已存在' }, { status: 400 });
    }

    const newFeature = createFeature(data.name, data.modality, data.description);

    const response: FeatureCreateReply = {
      message: '特征创建成功',
      id: newFeature.id,
    };

    return HttpResponse.json(response);
  }),

  http.put('*/api/feature_extractor/:id', async ({ params, request }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const id = parseInt(params.id as string);
    const data = (await request.json()) as FeatureUpdateRequest;

    const feature = findFeatureById(id);
    if (!feature) {
      return HttpResponse.json({ message: '特征不存在' }, { status: 404 });
    }

    if (data.name && data.name !== feature.name) {
      const existingFeature = mockFeatures.find((f) => f.name === data.name && f.id !== id);
      if (existingFeature) {
        return HttpResponse.json({ message: '特征名称已存在' }, { status: 400 });
      }
    }

    updateFeature(id, data);

    return HttpResponse.json({ message: '特征更新成功' });
  }),

  http.delete('*/api/feature_extractor/:id', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const id = parseInt(params.id as string);
    const feature = findFeatureById(id);

    if (!feature) {
      return HttpResponse.json({ message: '特征不存在' }, { status: 404 });
    }

    const success = deleteFeature(id);
    if (!success) {
      return HttpResponse.json({ message: '删除失败' }, { status: 500 });
    }

    return HttpResponse.json({ message: '特征删除成功' });
  }),
];
