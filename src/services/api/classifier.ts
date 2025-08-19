import { httpService } from '@/services/http';
import type { ClassifierListReply } from '@/types/classifier';

export const classifierApi = {
  async getClassifierList(): Promise<ClassifierListReply> {
    return await httpService.get<ClassifierListReply>('/api/classifier/');
  },
};
