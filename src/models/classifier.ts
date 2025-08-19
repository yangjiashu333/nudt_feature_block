import { classifierApi } from '@/services/api/classifier';
import type { Classifier } from '@/types/classifier';
import { create } from 'zustand';

interface ClassifierState {
  classifiers: Classifier[];
  isLoading: boolean;

  getClassifierList: () => Promise<void>;
}

export const useClassifierStore = create<ClassifierState>((set) => ({
  classifiers: [],
  isLoading: false,

  getClassifierList: async () => {
    set({ isLoading: true });
    try {
      const response = await classifierApi.getClassifierList();
      set({ classifiers: response });
    } finally {
      set({ isLoading: false });
    }
  },
}));
