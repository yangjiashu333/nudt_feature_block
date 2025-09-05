import { create } from 'zustand';
import { datasetApi } from '@/services/api/dataset';
import type { Dataset, Image } from '@/types/dataset';

interface DatasetState {
  datasets: Dataset[];
  images: Image[];
  isLoading: boolean;
  selectedDataset: Dataset | null;
  selectedImageId: number | null;
  isViewerOpen: boolean;

  getDatasetList: () => Promise<void>;
  getImageList: (datasetId: number) => Promise<void>;
  setSelectedDataset: (dataset: Dataset) => Promise<void>;
  setSelectedImage: (imageId: number | null) => void;
  toggleViewer: (open?: boolean) => void;
}

export const useDatasetStore = create<DatasetState>((set, get) => ({
  datasets: [],
  images: [],
  isLoading: false,
  selectedDataset: null,
  selectedImageId: null,
  isViewerOpen: false,

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
    try {
      const response = await datasetApi.getImageList(datasetId);
      set({ images: response });
    } catch {
      /* empty */
    }
  },

  setSelectedDataset: async (dataset: Dataset) => {
    set({ selectedDataset: dataset, selectedImageId: null });
    await get().getImageList(dataset.id);
    const { images } = get();
    if (images.length > 0) {
      set({ selectedImageId: images[0].id });
    }
  },

  setSelectedImage: (imageId: number | null) => {
    set({ selectedImageId: imageId });
  },

  toggleViewer: (open?: boolean) => {
    const currentState = get().isViewerOpen;
    const newState = open !== undefined ? open : !currentState;
    set({ isViewerOpen: newState });

    if (!newState) {
      set({ selectedDataset: null, selectedImageId: null, images: [] });
    }
  },
}));
