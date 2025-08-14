import { httpService } from '@/services/http';
import type { CommonReply } from '@/types/common';
import type {
  FeatureCreateReply,
  FeatureCreateRequest,
  FeatureListReply,
  FeatureUpdateRequest,
} from '@/types/feature';

export const featureApi = {
  async getFeatureList(): Promise<FeatureListReply> {
    return await httpService.get<FeatureListReply>('/api/feature_extractor/');
  },

  async createFeature(data: FeatureCreateRequest): Promise<FeatureCreateReply> {
    return await httpService.post<FeatureCreateReply>('/api/feature_extractor/', data);
  },

  async updateFeature(id: number, data: FeatureUpdateRequest): Promise<CommonReply> {
    return await httpService.put<CommonReply>(`/api/feature_extractor/${id}`, data);
  },

  async deleteFeature(id: number): Promise<CommonReply> {
    return await httpService.delete<CommonReply>(`/api/feature_extractor/${id}`);
  },
};
