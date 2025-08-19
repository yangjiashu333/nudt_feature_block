import { backboneApi } from '@/services/api/backbone';
import type { Backbone } from '@/types/backbone';
import { create } from 'zustand';

interface BackboneState {
  backbones: Backbone[];
  isLoading: boolean;

  getBackboneList: () => Promise<void>;
}

export const useBackboneStore = create<BackboneState>((set) => ({
  backbones: [],
  isLoading: false,

  getBackboneList: async () => {
    set({ isLoading: true });
    try {
      const response = await backboneApi.getBackboneList();
      set({ backbones: response });
    } finally {
      set({ isLoading: false });
    }
  },
}));
