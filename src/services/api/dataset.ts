import apiConfig from '@/config/env';
import { httpService } from '@/services/http';
import type { DatasetListReply, ImageListReply } from '@/types/dataset';
export const datasetApi = {
  async getDatasetList(): Promise<DatasetListReply> {
    return await httpService.get<DatasetListReply>('/api/datasets');
  },

  async getImageList(dataset_id: number): Promise<ImageListReply> {
    return await httpService.get<ImageListReply>(`/api/images/${dataset_id}`);
  },

  getImageUrl(image_path: string) {
    return apiConfig.getUrl(`/api/images/file?image_path=${encodeURIComponent(image_path)}`);
  },
};
