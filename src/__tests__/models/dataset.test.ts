import { describe, it, expect, beforeEach } from 'vitest';
import { useDatasetStore } from '@/models/dataset';
import { mockDatasets, mockImages } from '@/mocks/data/datasets';

describe('DatasetStore', () => {
  beforeEach(() => {
    useDatasetStore.setState({
      datasets: [],
      images: [],
      isLoading: false,
      selectedDataset: null,
      selectedImageId: null,
      isViewerOpen: false,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useDatasetStore.getState();

      expect(state.datasets).toEqual([]);
      expect(state.images).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.selectedDataset).toBe(null);
      expect(state.selectedImageId).toBe(null);
      expect(state.isViewerOpen).toBe(false);
      expect(typeof state.getDatasetList).toBe('function');
      expect(typeof state.getImageList).toBe('function');
      expect(typeof state.setSelectedDataset).toBe('function');
      expect(typeof state.setSelectedImage).toBe('function');
      expect(typeof state.toggleViewer).toBe('function');
    });
  });

  describe('getDatasetList', () => {
    it('should fetch datasets successfully', async () => {
      const { getDatasetList } = useDatasetStore.getState();
      await getDatasetList();

      const state = useDatasetStore.getState();
      expect(state.datasets).toEqual(mockDatasets);
      expect(state.isLoading).toBe(false);
    });

    it('should set loading state during fetch', async () => {
      const { getDatasetList } = useDatasetStore.getState();

      const promise = getDatasetList();

      expect(useDatasetStore.getState().isLoading).toBe(true);

      await promise;

      expect(useDatasetStore.getState().isLoading).toBe(false);
    });
  });

  describe('getImageList', () => {
    it('should fetch images successfully for a dataset', async () => {
      const datasetId = 1;
      const expectedImages = mockImages[datasetId];

      const { getImageList } = useDatasetStore.getState();
      await getImageList(datasetId);

      const state = useDatasetStore.getState();
      expect(state.images).toEqual(expectedImages);
      expect(state.isLoading).toBe(false);
    });

    it('should handle empty image list for non-existent dataset', async () => {
      const nonExistentDatasetId = 999;

      const { getImageList } = useDatasetStore.getState();
      await getImageList(nonExistentDatasetId);

      const state = useDatasetStore.getState();
      expect(state.images).toEqual([]);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setSelectedDataset', () => {
    it('should set selected dataset and load its images', async () => {
      const dataset = mockDatasets[0];
      const expectedImages = mockImages[dataset.id];

      const { setSelectedDataset } = useDatasetStore.getState();
      await setSelectedDataset(dataset);

      const state = useDatasetStore.getState();
      expect(state.selectedDataset).toEqual(dataset);
      expect(state.images).toEqual(expectedImages);
      expect(state.isLoading).toBe(false);
    });

    it('should auto-select first image when images are loaded', async () => {
      const dataset = mockDatasets[0];
      const expectedImages = mockImages[dataset.id];
      const firstImageId = expectedImages[0].id;

      const { setSelectedDataset } = useDatasetStore.getState();
      await setSelectedDataset(dataset);

      const state = useDatasetStore.getState();
      expect(state.selectedImageId).toBe(firstImageId);
    });

    it('should handle dataset with no images', async () => {
      const dataset = { id: 999, name: 'Empty Dataset', modality: 'SAR' as const, path: '/empty' };

      const { setSelectedDataset } = useDatasetStore.getState();
      await setSelectedDataset(dataset);

      const state = useDatasetStore.getState();
      expect(state.selectedDataset).toEqual(dataset);
      expect(state.images).toEqual([]);
      expect(state.selectedImageId).toBe(null);
    });
  });

  describe('setSelectedImage', () => {
    it('should set selected image ID', () => {
      const imageId = 101;

      const { setSelectedImage } = useDatasetStore.getState();
      setSelectedImage(imageId);

      const state = useDatasetStore.getState();
      expect(state.selectedImageId).toBe(imageId);
    });

    it('should allow setting image ID to null', () => {
      useDatasetStore.setState({ selectedImageId: 101 });

      const { setSelectedImage } = useDatasetStore.getState();
      setSelectedImage(null);

      const state = useDatasetStore.getState();
      expect(state.selectedImageId).toBe(null);
    });
  });

  describe('toggleViewer', () => {
    it('should toggle viewer state', () => {
      const { toggleViewer } = useDatasetStore.getState();

      expect(useDatasetStore.getState().isViewerOpen).toBe(false);

      toggleViewer();
      expect(useDatasetStore.getState().isViewerOpen).toBe(true);

      toggleViewer();
      expect(useDatasetStore.getState().isViewerOpen).toBe(false);
    });

    it('should allow explicit open/close', () => {
      const { toggleViewer } = useDatasetStore.getState();

      toggleViewer(true);
      expect(useDatasetStore.getState().isViewerOpen).toBe(true);

      toggleViewer(false);
      expect(useDatasetStore.getState().isViewerOpen).toBe(false);
    });

    it('should clear state when closing viewer', () => {
      useDatasetStore.setState({
        selectedDataset: mockDatasets[0],
        selectedImageId: 101,
        images: mockImages[1],
        isViewerOpen: true,
      });

      const { toggleViewer } = useDatasetStore.getState();
      toggleViewer(false);

      const state = useDatasetStore.getState();
      expect(state.isViewerOpen).toBe(false);
      expect(state.selectedDataset).toBe(null);
      expect(state.selectedImageId).toBe(null);
      expect(state.images).toEqual([]);
    });

    it('should not clear state when opening viewer', () => {
      useDatasetStore.setState({
        selectedDataset: mockDatasets[0],
        selectedImageId: 101,
        images: mockImages[1],
        isViewerOpen: false,
      });

      const { toggleViewer } = useDatasetStore.getState();
      toggleViewer(true);

      const state = useDatasetStore.getState();
      expect(state.isViewerOpen).toBe(true);
      expect(state.selectedDataset).toEqual(mockDatasets[0]);
      expect(state.selectedImageId).toBe(101);
      expect(state.images).toEqual(mockImages[1]);
    });
  });
});
