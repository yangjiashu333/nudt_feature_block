import { httpService } from '@/services/http';
import type { BackboneListReply } from '@/types/backbone';

export const backboneApi = {
  async getBackboneList(): Promise<BackboneListReply> {
    return await httpService.get<BackboneListReply>('/api/backbone/');
  },
};
