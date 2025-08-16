import { beforeEach, describe, expect, it } from 'vitest';
import { useDatasetStore } from '@/models/dataset';
import { mockDatasets } from '@/mocks/data/datasets';

// Helper function to get a fresh store instance
const getStore = () => useDatasetStore.getState();

describe('DatasetStore - Basic Functionality', () => {
  beforeEach(() => {
    // Reset store state before each test
    useDatasetStore.setState({
      datasets: [],
      images: [],
      isLoading: false,
      selectedDataset: null,
      datasetImagesModalOpen: false,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = getStore();

      expect(store.datasets).toEqual([]);
      expect(store.images).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.selectedDataset).toBe(null);
      expect(store.datasetImagesModalOpen).toBe(false);
    });
  });

  describe('Modal Management', () => {
    it('should open dataset images modal with selected dataset', () => {
      const store = getStore();
      const testDataset = mockDatasets[0];

      store.openModal('datasetImages', testDataset);

      const state = getStore();
      expect(state.datasetImagesModalOpen).toBe(true);
      expect(state.selectedDataset).toEqual(testDataset);
    });

    it('should close dataset images modal and clear state', () => {
      const store = getStore();
      const testDataset = mockDatasets[0];

      // First open the modal
      store.openModal('datasetImages', testDataset);
      expect(getStore().datasetImagesModalOpen).toBe(true);

      // Then close it
      store.closeModal('datasetImages');

      const state = getStore();
      expect(state.datasetImagesModalOpen).toBe(false);
      expect(state.selectedDataset).toBe(null);
      expect(state.images).toEqual([]);
    });

    it('should handle opening modal without dataset', () => {
      const store = getStore();

      store.openModal('datasetImages', undefined);

      const state = getStore();
      expect(state.datasetImagesModalOpen).toBe(true);
      expect(state.selectedDataset).toBe(null);
    });
  });

  describe('Mock Data Validation', () => {
    it('should have valid mock dataset structure', () => {
      expect(mockDatasets).toBeDefined();
      expect(Array.isArray(mockDatasets)).toBe(true);
      expect(mockDatasets.length).toBeGreaterThan(0);

      mockDatasets.forEach((dataset) => {
        expect(dataset).toHaveProperty('id');
        expect(dataset).toHaveProperty('name');
        expect(dataset).toHaveProperty('modality');
        expect(dataset).toHaveProperty('path');
        expect(typeof dataset.id).toBe('number');
        expect(typeof dataset.name).toBe('string');
        expect(['SAR', 'RD', '1D']).toContain(dataset.modality);
        expect(typeof dataset.path).toBe('string');
      });
    });

    it('should group datasets by modality correctly', () => {
      const sarDatasets = mockDatasets.filter((d) => d.modality === 'SAR');
      const rdDatasets = mockDatasets.filter((d) => d.modality === 'RD');
      const oneDDatasets = mockDatasets.filter((d) => d.modality === '1D');

      expect(sarDatasets.length).toBeGreaterThan(0);
      expect(rdDatasets.length).toBeGreaterThan(0);
      expect(oneDDatasets.length).toBeGreaterThan(0);

      sarDatasets.forEach((dataset) => expect(dataset.modality).toBe('SAR'));
      rdDatasets.forEach((dataset) => expect(dataset.modality).toBe('RD'));
      oneDDatasets.forEach((dataset) => expect(dataset.modality).toBe('1D'));
    });
  });

  describe('Store Methods Exist', () => {
    it('should have all required methods', () => {
      const store = getStore();

      expect(typeof store.getDatasetList).toBe('function');
      expect(typeof store.getImageList).toBe('function');
      expect(typeof store.openModal).toBe('function');
      expect(typeof store.closeModal).toBe('function');
    });
  });

  describe('State Updates', () => {
    it('should update loading state correctly', () => {
      // Test that we can set loading state
      useDatasetStore.setState({ isLoading: true });
      expect(getStore().isLoading).toBe(true);

      useDatasetStore.setState({ isLoading: false });
      expect(getStore().isLoading).toBe(false);
    });

    it('should update datasets state correctly', () => {
      // Test that we can set datasets
      useDatasetStore.setState({ datasets: mockDatasets });
      expect(getStore().datasets).toEqual(mockDatasets);
    });
  });
});
