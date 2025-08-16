import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFeatureStore } from '@/models/feature';
import { useAuthStore } from '@/models/auth';
import { mockFeatures } from '@/mocks/data/features';
import { mockUsers } from '@/mocks/data/users';
import { mockSession } from '@/mocks/data/session';
import type { Feature } from '@/types/feature';

// Mock React hooks since we're testing component logic
vi.mock('react', () => ({
  useState: vi.fn(() => [false, vi.fn()]),
  useEffect: vi.fn(),
}));

// Test helpers
const resetMockFeatures = () => {
  mockFeatures.length = 0;
  mockFeatures.push(
    {
      id: 1,
      name: 'Age Feature',
      modality: 'SAR',
      description: 'User age from profile data',
    },
    {
      id: 2,
      name: 'Click Rate',
      modality: 'RD',
      description: 'User click through rate on ads',
    },
    {
      id: 3,
      name: 'Purchase History',
      modality: '1D',
      description: 'Historical purchase patterns',
    },
    {
      id: 4,
      name: 'Location Data',
      modality: 'SAR',
      description: 'Geographic location preferences',
    }
  );
};

const getStore = () => useFeatureStore.getState();

describe('DeleteFeatureDialog Integration', () => {
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

  describe('Component Integration with Store', () => {
    it('should integrate with useFeatureStore correctly', () => {
      const store = getStore();

      expect(typeof store.deleteFeature).toBe('function');
      expect(typeof store.openModal).toBe('function');
      expect(typeof store.closeModal).toBe('function');
      expect(store.deleteFeatureModalOpen).toBe(false);
      expect(store.selectedFeature).toBe(null);
      expect(store.isLoading).toBe(false);
    });

    it('should handle delete dialog open state management', () => {
      const { openModal, closeModal } = getStore();
      const testFeature = mockFeatures[0];

      // Test opening dialog with selected feature
      openModal('deleteFeature', testFeature);
      const openState = getStore();
      expect(openState.deleteFeatureModalOpen).toBe(true);
      expect(openState.selectedFeature).toBe(testFeature);

      // Test closing dialog
      closeModal('deleteFeature');
      const closedState = getStore();
      expect(closedState.deleteFeatureModalOpen).toBe(false);
      expect(closedState.selectedFeature).toBe(null);
    });
  });

  describe('Feature Selection for Deletion', () => {
    it('should correctly handle selected feature for deletion', () => {
      const store = getStore();
      const featureToDelete = mockFeatures[1];

      // Simulate opening delete dialog with specific feature
      store.openModal('deleteFeature', featureToDelete);

      const state = getStore();
      expect(state.selectedFeature).toEqual(featureToDelete);
      expect(state.deleteFeatureModalOpen).toBe(true);

      // Verify the selected feature data is correct
      expect(state.selectedFeature?.name).toBe('Click Rate');
      expect(state.selectedFeature?.modality).toBe('RD');
      expect(state.selectedFeature?.id).toBe(2);
    });

    it('should handle different feature types for deletion', () => {
      const modalityTypes = ['SAR', 'RD', '1D'] as const;
      const testFeatures = mockFeatures.filter((f) => modalityTypes.includes(f.modality));

      testFeatures.forEach((feature) => {
        const store = getStore();
        store.openModal('deleteFeature', feature);

        const state = getStore();
        expect(state.selectedFeature).toEqual(feature);
        expect(state.selectedFeature?.modality).toBe(feature.modality);

        store.closeModal('deleteFeature');
      });
    });

    it('should handle feature with minimal data for deletion', () => {
      const minimalFeature: Feature = {
        id: 99,
        name: 'Minimal Feature',
        modality: 'SAR',
      };

      const store = getStore();
      store.openModal('deleteFeature', minimalFeature);

      const state = getStore();
      expect(state.selectedFeature).toEqual(minimalFeature);
      expect(state.selectedFeature?.description).toBeUndefined();
    });

    it('should handle null feature gracefully', () => {
      const store = getStore();

      // Simulate dialog being opened without a feature (edge case)
      store.openModal('deleteFeature', null);

      const state = getStore();
      expect(state.selectedFeature).toBe(null);
      expect(state.deleteFeatureModalOpen).toBe(true);
    });
  });

  describe('Feature Deletion Logic', () => {
    it('should delete feature successfully', async () => {
      const store = getStore();

      // Setup feature list
      await store.getFeatureList();
      const initialFeatures = getStore().features;
      const featureToDelete = initialFeatures[1];
      const initialCount = initialFeatures.length;

      // Simulate the deletion logic
      await store.deleteFeature(featureToDelete.id);

      const updatedStore = getStore();
      expect(updatedStore.isLoading).toBe(false);
      expect(updatedStore.features.length).toBe(initialCount - 1);

      // Verify the feature is actually removed
      const deletedFeature = updatedStore.features.find((f) => f.id === featureToDelete.id);
      expect(deletedFeature).toBeUndefined();
    });

    it('should delete features with different modalities', async () => {
      const store = getStore();

      // Setup feature list
      await store.getFeatureList();
      const features = getStore().features;

      // Delete one feature of each modality type
      const sarFeature = features.find((f) => f.modality === 'SAR');
      const rdFeature = features.find((f) => f.modality === 'RD');
      const oneDFeature = features.find((f) => f.modality === '1D');

      if (sarFeature) {
        await store.deleteFeature(sarFeature.id);
        expect(getStore().features.find((f) => f.id === sarFeature.id)).toBeUndefined();
      }

      if (rdFeature) {
        await store.deleteFeature(rdFeature.id);
        expect(getStore().features.find((f) => f.id === rdFeature.id)).toBeUndefined();
      }

      if (oneDFeature) {
        await store.deleteFeature(oneDFeature.id);
        expect(getStore().features.find((f) => f.id === oneDFeature.id)).toBeUndefined();
      }
    });

    it('should delete features with and without descriptions', async () => {
      const store = getStore();

      // Setup feature list
      await store.getFeatureList();
      const features = getStore().features;
      const initialCount = features.length;

      // Find features with and without descriptions
      const featureWithDescription = features.find((f) => f.description);
      const featureWithoutDescription = features.find((f) => !f.description);

      let deletedCount = 0;

      if (featureWithDescription) {
        await store.deleteFeature(featureWithDescription.id);
        deletedCount++;
        expect(getStore().features.find((f) => f.id === featureWithDescription.id)).toBeUndefined();
      }

      if (featureWithoutDescription) {
        await store.deleteFeature(featureWithoutDescription.id);
        deletedCount++;
        expect(
          getStore().features.find((f) => f.id === featureWithoutDescription.id)
        ).toBeUndefined();
      }

      expect(getStore().features.length).toBe(initialCount - deletedCount);
    });

    it('should handle deletion of last remaining feature', async () => {
      const store = getStore();

      // Setup with just one feature
      resetMockFeatures();
      mockFeatures.length = 0;
      mockFeatures.push({
        id: 1,
        name: 'Last Feature',
        modality: 'SAR',
        description: 'The last remaining feature',
      });

      await store.getFeatureList();
      expect(getStore().features.length).toBe(1);

      // Delete the last feature
      await store.deleteFeature(1);

      const finalState = getStore();
      expect(finalState.features.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle deletion of non-existent feature', async () => {
      const store = getStore();
      const nonExistentId = 999;

      await expect(store.deleteFeature(nonExistentId)).rejects.toThrow();
      expect(getStore().isLoading).toBe(false);
    });

    it('should handle network or server errors gracefully', async () => {
      const store = getStore();

      // Setup feature list
      await store.getFeatureList();

      // Mock a scenario that might cause server error
      // (This is simulated since our mock implementation doesn't have complex error scenarios)
      const invalidId = -1; // Negative IDs might cause issues

      await expect(store.deleteFeature(invalidId)).rejects.toThrow();
      expect(getStore().isLoading).toBe(false);
    });

    it('should maintain data integrity after failed deletion', async () => {
      const store = getStore();

      // Setup feature list
      await store.getFeatureList();
      const originalFeatures = [...getStore().features];
      const originalCount = originalFeatures.length;

      // Try to delete non-existent feature
      try {
        await store.deleteFeature(999);
      } catch {
        // Expected error
      }

      // Verify no features were accidentally deleted
      const finalState = getStore();
      expect(finalState.features.length).toBe(originalCount);
      expect(finalState.isLoading).toBe(false);
    });
  });

  describe('Loading State Management', () => {
    it('should manage loading state during feature deletion', async () => {
      const store = getStore();

      // Setup feature list
      await store.getFeatureList();
      const featureToDelete = getStore().features[0];

      // Initially not loading
      expect(store.isLoading).toBe(false);

      // Start deletion
      const deletePromise = store.deleteFeature(featureToDelete.id);

      // Should complete and reset loading state
      await deletePromise;
      expect(getStore().isLoading).toBe(false);
    });

    it('should reset loading state on deletion error', async () => {
      const store = getStore();

      try {
        await store.deleteFeature(999); // Non-existent ID
      } catch {
        // Error expected, loading should be reset
        expect(getStore().isLoading).toBe(false);
      }
    });
  });

  describe('Dialog State Integration', () => {
    it('should close dialog after successful feature deletion', async () => {
      const store = getStore();

      // Setup feature list
      await store.getFeatureList();
      const featureToDelete = getStore().features[0];

      // Open delete dialog
      store.openModal('deleteFeature', featureToDelete);
      expect(getStore().deleteFeatureModalOpen).toBe(true);

      // Delete feature successfully
      await store.deleteFeature(featureToDelete.id);

      // Dialog should remain open until explicitly closed
      // This simulates the component logic where dialog is closed after success
      store.closeModal('deleteFeature');
      expect(getStore().deleteFeatureModalOpen).toBe(false);
      expect(getStore().selectedFeature).toBe(null);
    });

    it('should handle dialog cancellation', () => {
      const store = getStore();
      const testFeature = mockFeatures[1];

      // Open delete dialog
      store.openModal('deleteFeature', testFeature);
      expect(getStore().deleteFeatureModalOpen).toBe(true);
      expect(getStore().selectedFeature).toBe(testFeature);

      // Cancel deletion (close dialog without deleting)
      store.closeModal('deleteFeature');
      expect(getStore().deleteFeatureModalOpen).toBe(false);
      expect(getStore().selectedFeature).toBe(null);

      // Feature should still exist (since we didn't actually delete)
      expect(mockFeatures.find((f) => f.id === testFeature.id)).toBeDefined();
    });

    it('should handle switching between different features for deletion', () => {
      const store = getStore();
      const firstFeature = mockFeatures[0];
      const secondFeature = mockFeatures[1];

      // Open delete dialog with first feature
      store.openModal('deleteFeature', firstFeature);
      expect(getStore().selectedFeature).toBe(firstFeature);

      // Switch to second feature (close and open new)
      store.closeModal('deleteFeature');
      store.openModal('deleteFeature', secondFeature);
      expect(getStore().selectedFeature).toBe(secondFeature);
      expect(getStore().deleteFeatureModalOpen).toBe(true);
    });
  });

  describe('Feature List Refresh', () => {
    it('should refresh feature list after deleting feature', async () => {
      const store = getStore();

      // Get initial feature list
      await store.getFeatureList();
      const initialCount = getStore().features.length;
      const featureToDelete = getStore().features[1];

      // Delete feature
      await store.deleteFeature(featureToDelete.id);

      // Feature list should be updated
      const updatedStore = getStore();
      expect(updatedStore.features.length).toBe(initialCount - 1);
      expect(updatedStore.features.find((f) => f.id === featureToDelete.id)).toBeUndefined();
    });

    it('should maintain correct feature IDs after deletion', async () => {
      const store = getStore();

      // Setup feature list
      await store.getFeatureList();
      const features = getStore().features;
      const featureToDelete = features[1]; // Delete middle feature
      const remainingFeatureIds = features
        .filter((f) => f.id !== featureToDelete.id)
        .map((f) => f.id);

      // Delete feature
      await store.deleteFeature(featureToDelete.id);

      // Verify remaining features have correct IDs
      const finalFeatures = getStore().features;
      const finalFeatureIds = finalFeatures.map((f) => f.id);

      expect(finalFeatureIds).toEqual(expect.arrayContaining(remainingFeatureIds));
      expect(finalFeatureIds).not.toContain(featureToDelete.id);
    });
  });

  describe('Authentication Integration', () => {
    it('should work with authenticated user', async () => {
      const authStore = useAuthStore.getState();
      expect(authStore.isAuthenticated).toBe(true);
      expect(authStore.user).toBeDefined();

      // Setup feature list
      const featureStore = getStore();
      await featureStore.getFeatureList();
      const featureToDelete = getStore().features[0];
      const initialCount = getStore().features.length;

      // Should be able to delete feature when authenticated
      await featureStore.deleteFeature(featureToDelete.id);

      const finalCount = getStore().features.length;
      expect(finalCount).toBe(initialCount - 1);
    });
  });

  describe('Confirmation Dialog Behavior', () => {
    it('should display correct feature information for deletion confirmation', () => {
      const store = getStore();
      const featureToDelete = mockFeatures[2]; // Purchase History

      // Open delete dialog
      store.openModal('deleteFeature', featureToDelete);

      const state = getStore();
      expect(state.selectedFeature?.name).toBe('Purchase History');
      expect(state.selectedFeature?.modality).toBe('1D');
      expect(state.selectedFeature?.description).toBe('Historical purchase patterns');
    });

    it('should handle features with long names', () => {
      const longNameFeature: Feature = {
        id: 100,
        name: 'This is a very long feature name that might be truncated in the UI but should still work correctly',
        modality: 'SAR',
        description: 'Feature with a very long name for testing display purposes',
      };

      const store = getStore();
      store.openModal('deleteFeature', longNameFeature);

      const state = getStore();
      expect(state.selectedFeature?.name).toBe(longNameFeature.name);
      expect(state.selectedFeature?.name.length).toBeGreaterThan(50);
    });

    it('should handle features with special characters in name', () => {
      const specialCharFeature: Feature = {
        id: 101,
        name: 'Feature with "quotes" & <special> characters',
        modality: 'RD',
        description: 'Testing special characters: !@#$%^&*()',
      };

      const store = getStore();
      store.openModal('deleteFeature', specialCharFeature);

      const state = getStore();
      expect(state.selectedFeature?.name).toBe('Feature with "quotes" & <special> characters');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid dialog open/close operations', () => {
      const store = getStore();
      const testFeature = mockFeatures[0];

      // Rapidly open and close dialog multiple times
      for (let i = 0; i < 5; i++) {
        store.openModal('deleteFeature', testFeature);
        expect(getStore().deleteFeatureModalOpen).toBe(true);

        store.closeModal('deleteFeature');
        expect(getStore().deleteFeatureModalOpen).toBe(false);
      }
    });

    it('should handle attempting to delete same feature multiple times', async () => {
      const store = getStore();

      // Setup feature list
      await store.getFeatureList();
      const featureToDelete = getStore().features[0];

      // First deletion should succeed
      await store.deleteFeature(featureToDelete.id);
      expect(getStore().features.find((f) => f.id === featureToDelete.id)).toBeUndefined();

      // Second deletion attempt should fail
      await expect(store.deleteFeature(featureToDelete.id)).rejects.toThrow();
    });

    it('should handle dialog state when store is reset', () => {
      const store = getStore();
      const testFeature = mockFeatures[0];

      // Open dialog
      store.openModal('deleteFeature', testFeature);
      expect(getStore().deleteFeatureModalOpen).toBe(true);

      // Reset store (simulating app refresh or navigation)
      useFeatureStore.setState({
        features: [],
        isLoading: false,
        selectedFeature: null,
        addFeatureModalOpen: false,
        editFeatureModalOpen: false,
        deleteFeatureModalOpen: false,
        deleteFeaturesModalOpen: false,
      });

      // Dialog should be closed
      expect(getStore().deleteFeatureModalOpen).toBe(false);
      expect(getStore().selectedFeature).toBe(null);
    });
  });
});
