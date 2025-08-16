import { create } from 'zustand';
import { datasetApi } from '@/services/api/dataset';
import type { Dataset, Image } from '@/types/dataset';

type ModalType = 'datasetImages';

interface DatasetState {
  datasets: Dataset[];
  images: Image[];
  isLoading: boolean;
  selectedDataset: Dataset | null;
  datasetImagesModalOpen: boolean;

  getDatasetList: () => Promise<void>;
  getImageList: (datasetId: number) => Promise<void>;
  openModal: (modal: ModalType, dataset?: Dataset | null) => void;
  closeModal: (modal: ModalType) => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  datasets: [],
  images: [],
  isLoading: false,
  selectedDataset: null,
  datasetImagesModalOpen: false,

  getDatasetList: async () => {
    set({ isLoading: true });
    try {
      const response = await datasetApi.getDatasetList();
      set({ datasets: response });
    } finally {
      set({ isLoading: false });
    }
  },

  getImageList: async (datasetId: number) => {
    set({ isLoading: true });
    try {
      const response = await datasetApi.getImageList(datasetId);
      set({ images: response });
    } finally {
      set({ isLoading: false });
    }
  },

  openModal: (modal, dataset) => {
    const modalState = {
      datasetImages: { datasetImagesModalOpen: true, selectedDataset: dataset || null },
    };
    set(modalState[modal]);
  },

  closeModal: (modal) => {
    const modalState = {
      datasetImages: { datasetImagesModalOpen: false, selectedDataset: null, images: [] },
    };
    set(modalState[modal]);
  },
}));