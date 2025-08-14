import { describe, it, expect, beforeEach } from 'vitest';
import { useFeatureStore } from '@/models/feature';
import { useAuthStore } from '@/models/auth';
import { mockFeatures } from '@/mocks/data/features';
import { mockUsers } from '@/mocks/data/users';
import { mockSession } from '@/mocks/data/session';
import type { Feature } from '@/types/feature';

// Test helpers
const resetMockFeatures = () => {
  mockFeatures.length = 0;
  mockFeatures.push(
    {
      id: 1,
      name: 'Age Feature',
      modality: 'demographic',
      description: 'User age from profile data',
    },
    {
      id: 2,
      name: 'Click Rate',
      modality: 'behavioral',
      description: 'User click through rate on ads',
    },
    {
      id: 3,
      name: 'Purchase History',
      modality: 'transactional',
      description: 'Historical purchase patterns',
    },
    {
      id: 4,
      name: 'Location Data',
      modality: 'geographic',
      description: 'Geographic location preferences',
    }
  );
};

const getStore = () => useFeatureStore.getState();
const expectLoadingComplete = (state: ReturnType<typeof getStore>) => {
  expect(state.isLoading).toBe(false);
};

const setupFeatureList = async () => {
  await getStore().getFeatureList();
  return getStore().features;
};

describe('FeatureStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useFeatureStore.setState({
      features: [],
      isLoading: false,
      selectedFeature: null,
      addFeatureModalOpen: false,
      editFeatureModalOpen: false,
      deleteFeatureModalOpen: false,
      deleteFeaturesModalOpen: false,
    });

    // Set authenticated user in auth store for tests
    useAuthStore.setState({
      user: mockUsers[0], // admin user
      isAuthenticated: true,
    });

    resetMockFeatures();
    mockSession.setCurrentUser(mockUsers[0]);
  });

  describe('getFeatureList', () => {
    it('should fetch and set feature list successfully', async () => {
      await getStore().getFeatureList();

      const state = getStore();
      expect(state.features).toEqual(mockFeatures);
      expectLoadingComplete(state);
    });

    it('should set loading state during getFeatureList', async () => {
      const promise = getStore().getFeatureList();

      expect(getStore().isLoading).toBe(true);
      await promise;
      expectLoadingComplete(getStore());
    });
  });

  describe('addFeature', () => {
    it('should add feature successfully and refresh feature list', async () => {
      const newFeatureData = {
        name: 'Test Feature',
        modality: 'test',
        description: 'Test feature description',
      };

      await getStore().addFeature(newFeatureData);

      const state = getStore();
      expectLoadingComplete(state);

      const newFeature = state.features.find((f) => f.name === 'Test Feature');
      expect(newFeature).toBeDefined();
      expect(newFeature?.modality).toBe('test');
      expect(newFeature?.description).toBe('Test feature description');
    });

    it('should handle addFeature failure when feature name already exists', async () => {
      const existingFeatureData = {
        name: 'Age Feature',
        modality: 'test',
        description: 'Test description',
      };

      await expect(getStore().addFeature(existingFeatureData)).rejects.toThrow();
      expectLoadingComplete(getStore());
    });
  });

  describe('updateFeature', () => {
    it('should update feature successfully and refresh feature list', async () => {
      const features = await setupFeatureList();
      const featureToUpdate = features[1];

      const updates = {
        name: 'Updated Feature Name',
        description: 'Updated description',
      };
      await getStore().updateFeature(featureToUpdate.id, updates);

      const state = getStore();
      expectLoadingComplete(state);

      const updatedFeature = state.features.find((f) => f.id === featureToUpdate.id);
      expect(updatedFeature?.name).toBe('Updated Feature Name');
      expect(updatedFeature?.description).toBe('Updated description');
    });

    it('should handle updateFeature failure for non-existent feature', async () => {
      const nonExistentId = 999;
      const updates = { name: 'New Name' };

      await expect(getStore().updateFeature(nonExistentId, updates)).rejects.toThrow();
      expectLoadingComplete(getStore());
    });
  });

  describe('deleteFeature', () => {
    it('should delete feature successfully and refresh feature list', async () => {
      const features = await setupFeatureList();
      const featureToDelete = features[1];
      const initialCount = features.length;

      await getStore().deleteFeature(featureToDelete.id);

      const state = getStore();
      expectLoadingComplete(state);
      expect(state.features.length).toBe(initialCount - 1);
      expect(state.features.find((f) => f.id === featureToDelete.id)).toBeUndefined();
    });

    it('should handle deleteFeature failure for non-existent feature', async () => {
      const nonExistentId = 999;

      await expect(getStore().deleteFeature(nonExistentId)).rejects.toThrow();
      expectLoadingComplete(getStore());
    });
  });

  describe('deleteFeatures', () => {
    it('should delete multiple features successfully and refresh feature list', async () => {
      const features = await setupFeatureList();
      const idsToDelete = [3, 4];
      const initialCount = features.length;

      await getStore().deleteFeatures(idsToDelete);

      const state = getStore();
      expectLoadingComplete(state);
      expect(state.features.length).toBe(initialCount - idsToDelete.length);
      idsToDelete.forEach((id) => {
        expect(state.features.find((f) => f.id === id)).toBeUndefined();
      });
    });

    it('should handle partial failure when deleting multiple features', async () => {
      await setupFeatureList();
      const idsToDelete = [2, 999]; // One valid, one invalid

      await expect(getStore().deleteFeatures(idsToDelete)).rejects.toThrow();
      expectLoadingComplete(getStore());
    });
  });

  describe('modal operations', () => {
    const testModalOperation = (
      modalType: 'addFeature' | 'editFeature' | 'deleteFeature' | 'deleteFeatures',
      modalStateKey: string,
      testFeature?: Feature
    ) => {
      const { openModal, closeModal } = getStore();

      openModal(modalType, testFeature);
      const openState = getStore();
      expect(openState[modalStateKey as keyof typeof openState]).toBe(true);
      if (testFeature) expect(openState.selectedFeature).toBe(testFeature);

      closeModal(modalType);
      const closedState = getStore();
      expect(closedState[modalStateKey as keyof typeof closedState]).toBe(false);
      if (testFeature) expect(closedState.selectedFeature).toBe(null);
    };

    it('should open and close addFeature modal', () => {
      testModalOperation('addFeature', 'addFeatureModalOpen');
    });

    it('should open and close editFeature modal with feature selection', () => {
      testModalOperation('editFeature', 'editFeatureModalOpen', mockFeatures[0]);
    });

    it('should open and close deleteFeature modal with feature selection', () => {
      testModalOperation('deleteFeature', 'deleteFeatureModalOpen', mockFeatures[1]);
    });

    it('should open and close deleteFeatures modal', () => {
      testModalOperation('deleteFeatures', 'deleteFeaturesModalOpen');
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const initialState = useFeatureStore.getState();

      expect(initialState.features).toEqual([]);
      expect(initialState.isLoading).toBe(false);
      expect(initialState.selectedFeature).toBe(null);
      expect(initialState.addFeatureModalOpen).toBe(false);
      expect(initialState.editFeatureModalOpen).toBe(false);
      expect(initialState.deleteFeatureModalOpen).toBe(false);
      expect(initialState.deleteFeaturesModalOpen).toBe(false);
      expect(typeof initialState.getFeatureList).toBe('function');
      expect(typeof initialState.addFeature).toBe('function');
      expect(typeof initialState.updateFeature).toBe('function');
      expect(typeof initialState.deleteFeature).toBe('function');
      expect(typeof initialState.deleteFeatures).toBe('function');
      expect(typeof initialState.openModal).toBe('function');
      expect(typeof initialState.closeModal).toBe('function');
    });
  });
});
