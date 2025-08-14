import { create } from 'zustand';
import { featureApi } from '@/services/api/feature';
import type { Feature } from '@/types/feature';
import type { Modality } from '@/types/common';

type ModalType = 'addFeature' | 'editFeature' | 'deleteFeature' | 'deleteFeatures';

interface FeatureState {
  features: Feature[];
  isLoading: boolean;
  selectedFeature: Feature | null;
  addFeatureModalOpen: boolean;
  editFeatureModalOpen: boolean;
  deleteFeatureModalOpen: boolean;
  deleteFeaturesModalOpen: boolean;

  getFeatureList: () => Promise<void>;
  addFeature: (featureData: {
    name: string;
    modality: Modality;
    description?: string;
  }) => Promise<void>;
  updateFeature: (
    id: number,
    updates: { name?: string; modality?: Modality; description?: string }
  ) => Promise<void>;
  deleteFeature: (id: number) => Promise<void>;
  deleteFeatures: (ids: number[]) => Promise<void>;

  openModal: (modal: ModalType, feature?: Feature | null) => void;
  closeModal: (modal: ModalType) => void;
}

export const useFeatureStore = create<FeatureState>((set) => ({
  features: [],
  isLoading: false,
  selectedFeature: null,
  addFeatureModalOpen: false,
  editFeatureModalOpen: false,
  deleteFeatureModalOpen: false,
  deleteFeaturesModalOpen: false,

  getFeatureList: async () => {
    set({ isLoading: true });
    try {
      const response = await featureApi.getFeatureList();
      set({ features: response });
    } finally {
      set({ isLoading: false });
    }
  },

  addFeature: async (featureData) => {
    set({ isLoading: true });
    try {
      await featureApi.createFeature(featureData);
      const features = await featureApi.getFeatureList();
      set({ features });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFeature: async (id, updates) => {
    set({ isLoading: true });
    try {
      await featureApi.updateFeature(id, updates);
      const features = await featureApi.getFeatureList();
      set({ features });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFeature: async (id) => {
    set({ isLoading: true });
    try {
      await featureApi.deleteFeature(id);
      const features = await featureApi.getFeatureList();
      set({ features });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFeatures: async (ids) => {
    set({ isLoading: true });
    try {
      await Promise.all(ids.map((id) => featureApi.deleteFeature(id)));
      const features = await featureApi.getFeatureList();
      set({ features });
    } finally {
      set({ isLoading: false });
    }
  },

  openModal: (modal, feature = null) => {
    const modalState = {
      addFeature: { addFeatureModalOpen: true },
      editFeature: { editFeatureModalOpen: true, selectedFeature: feature },
      deleteFeature: { deleteFeatureModalOpen: true, selectedFeature: feature },
      deleteFeatures: { deleteFeaturesModalOpen: true },
    };
    set(modalState[modal]);
  },

  closeModal: (modal) => {
    const modalState = {
      addFeature: { addFeatureModalOpen: false },
      editFeature: { editFeatureModalOpen: false, selectedFeature: null },
      deleteFeature: { deleteFeatureModalOpen: false, selectedFeature: null },
      deleteFeatures: { deleteFeaturesModalOpen: false },
    };
    set(modalState[modal]);
  },
}));
