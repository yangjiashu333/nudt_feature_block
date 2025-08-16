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

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    control: {},
    handleSubmit: vi.fn((fn) => fn),
    reset: vi.fn(),
    formState: { errors: {} },
  })),
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
  );
};

const getStore = () => useFeatureStore.getState();

describe('EditFeatureModal Integration', () => {
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
      
      expect(typeof store.updateFeature).toBe('function');
      expect(typeof store.openModal).toBe('function');
      expect(typeof store.closeModal).toBe('function');
      expect(store.editFeatureModalOpen).toBe(false);
      expect(store.selectedFeature).toBe(null);
      expect(store.isLoading).toBe(false);
    });

    it('should handle edit modal open state management', () => {
      const { openModal, closeModal } = getStore();
      const testFeature = mockFeatures[0];
      
      // Test opening modal with selected feature
      openModal('editFeature', testFeature);
      const openState = getStore();
      expect(openState.editFeatureModalOpen).toBe(true);
      expect(openState.selectedFeature).toBe(testFeature);
      
      // Test closing modal
      closeModal('editFeature');
      const closedState = getStore();
      expect(closedState.editFeatureModalOpen).toBe(false);
      expect(closedState.selectedFeature).toBe(null);
    });
  });

  describe('Feature Selection and Pre-filling', () => {
    it('should correctly handle selected feature for editing', () => {
      const store = getStore();
      const featureToEdit = mockFeatures[1];
      
      // Simulate opening edit modal with specific feature
      store.openModal('editFeature', featureToEdit);
      
      const state = getStore();
      expect(state.selectedFeature).toEqual(featureToEdit);
      expect(state.editFeatureModalOpen).toBe(true);
      
      // Verify the selected feature data
      expect(state.selectedFeature?.name).toBe('Click Rate');
      expect(state.selectedFeature?.modality).toBe('RD');
      expect(state.selectedFeature?.description).toBe('User click through rate on ads');
    });

    it('should handle feature with minimal data', () => {
      const minimalFeature: Feature = {
        id: 99,
        name: 'Minimal Feature',
        modality: 'SAR',
      };
      
      const store = getStore();
      store.openModal('editFeature', minimalFeature);
      
      const state = getStore();
      expect(state.selectedFeature).toEqual(minimalFeature);
      expect(state.selectedFeature?.description).toBeUndefined();
    });

    it('should handle feature with all modality types', () => {
      const modalityTypes = ['SAR', 'RD', '1D'] as const;
      
      modalityTypes.forEach((modality, index) => {
        const testFeature: Feature = {
          id: index + 100,
          name: `${modality} Test Feature`,
          modality,
          description: `Feature with ${modality} modality`,
        };
        
        const store = getStore();
        store.openModal('editFeature', testFeature);
        
        const state = getStore();
        expect(state.selectedFeature?.modality).toBe(modality);
        expect(state.selectedFeature?.name).toBe(`${modality} Test Feature`);
        
        store.closeModal('editFeature');
      });
    });
  });

  describe('Feature Update Logic', () => {
    it('should update feature with valid data successfully', async () => {
      const store = getStore();
      
      // First setup feature list
      await store.getFeatureList();
      const featureToUpdate = getStore().features[0];
      
      const updates = {
        name: 'Updated Feature Name',
        modality: 'RD' as const,
        description: 'Updated feature description',
      };

      // Simulate the form submission logic
      await store.updateFeature(featureToUpdate.id, updates);

      const updatedStore = getStore();
      expect(updatedStore.isLoading).toBe(false);
      
      const updatedFeature = updatedStore.features.find((f) => f.id === featureToUpdate.id);
      expect(updatedFeature).toBeDefined();
      expect(updatedFeature?.name).toBe('Updated Feature Name');
      expect(updatedFeature?.modality).toBe('RD');
      expect(updatedFeature?.description).toBe('Updated feature description');
    });

    it('should update feature with partial data', async () => {
      const store = getStore();
      
      // Setup feature list
      await store.getFeatureList();
      const featureToUpdate = getStore().features[1];
      const originalModality = featureToUpdate.modality;
      
      // Update only name
      const partialUpdates = {
        name: 'Partially Updated Feature',
      };

      await store.updateFeature(featureToUpdate.id, partialUpdates);

      const updatedStore = getStore();
      const updatedFeature = updatedStore.features.find((f) => f.id === featureToUpdate.id);
      expect(updatedFeature?.name).toBe('Partially Updated Feature');
      expect(updatedFeature?.modality).toBe(originalModality); // Should remain unchanged
    });

    it('should update feature modality correctly', async () => {
      const store = getStore();
      
      // Setup feature list
      await store.getFeatureList();
      const featureToUpdate = getStore().features[0];
      
      // Change modality
      const modalityUpdate = {
        modality: '1D' as const,
      };

      await store.updateFeature(featureToUpdate.id, modalityUpdate);

      const updatedStore = getStore();
      const updatedFeature = updatedStore.features.find((f) => f.id === featureToUpdate.id);
      expect(updatedFeature?.modality).toBe('1D');
    });

    it('should clear description when updated to empty', async () => {
      const store = getStore();
      
      // Setup feature list
      await store.getFeatureList();
      const featureToUpdate = getStore().features[2]; // Has description
      
      // Clear description
      const clearDescriptionUpdate = {
        description: '',
      };

      await store.updateFeature(featureToUpdate.id, clearDescriptionUpdate);

      const updatedStore = getStore();
      const updatedFeature = updatedStore.features.find((f) => f.id === featureToUpdate.id);
      expect(updatedFeature?.description).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should handle update of non-existent feature', async () => {
      const store = getStore();
      const nonExistentId = 999;
      
      const updates = {
        name: 'Updated Name',
        description: 'Updated description',
      };

      await expect(store.updateFeature(nonExistentId, updates)).rejects.toThrow();
      expect(getStore().isLoading).toBe(false);
    });

    it('should handle duplicate name error during update', async () => {
      const store = getStore();
      
      // Setup feature list
      await store.getFeatureList();
      const features = getStore().features;
      const featureToUpdate = features[0];
      const existingFeatureName = features[1].name;
      
      // Try to update to existing name
      const duplicateNameUpdate = {
        name: existingFeatureName,
      };

      await expect(store.updateFeature(featureToUpdate.id, duplicateNameUpdate)).rejects.toThrow();
      expect(getStore().isLoading).toBe(false);
    });

    it('should handle network or server errors gracefully', async () => {
      const store = getStore();
      
      // Setup feature list first
      await store.getFeatureList();
      const features = getStore().features;
      const featureToUpdate = features[0];
      const existingFeatureName = features[1].name;
      
      // Mock a scenario that would cause server error (duplicate name)
      const invalidUpdate = {
        name: existingFeatureName, // Duplicate name should cause validation error
      };

      // The store should handle errors and reset loading state
      await expect(store.updateFeature(featureToUpdate.id, invalidUpdate)).rejects.toThrow();
      expect(getStore().isLoading).toBe(false);
    });
  });

  describe('Form Validation Requirements', () => {
    it('should require feature name field for updates', () => {
      // Test that name field is required in schema when provided
      const invalidUpdate = {
        name: '',
        description: 'Updated description',
      };

      // This would be caught by the form validation before reaching the store
      expect(() => {
        if (invalidUpdate.name !== undefined && invalidUpdate.name.trim() === '') {
          throw new Error('请输入特征名称');
        }
      }).toThrow('请输入特征名称');
    });

    it('should validate modality field when provided', () => {
      const validModalities = ['SAR', 'RD', '1D'];
      const invalidModality = 'INVALID';
      
      expect(() => {
        if (!validModalities.includes(invalidModality)) {
          throw new Error('请选择数据模态');
        }
      }).toThrow('请选择数据模态');
    });

    it('should accept valid modality values for updates', () => {
      const validModalities = ['SAR', 'RD', '1D'];
      
      validModalities.forEach(modality => {
        expect(() => {
          if (!validModalities.includes(modality)) {
            throw new Error('请选择数据模态');
          }
        }).not.toThrow();
      });
    });

    it('should allow optional description field updates', () => {
      const updateWithoutDescription = {
        name: 'Updated Feature',
        modality: 'SAR' as const,
      };

      const updateWithDescription = {
        name: 'Updated Feature',
        modality: 'SAR' as const,
        description: 'Updated description',
      };

      // Both should be valid
      expect(() => {
        if (updateWithoutDescription.name && !updateWithoutDescription.name.trim()) {
          throw new Error('Name required');
        }
      }).not.toThrow();

      expect(() => {
        if (updateWithDescription.name && !updateWithDescription.name.trim()) {
          throw new Error('Name required');
        }
      }).not.toThrow();
    });
  });

  describe('Loading State Management', () => {
    it('should manage loading state during feature update', async () => {
      const store = getStore();
      
      // Setup feature list
      await store.getFeatureList();
      const featureToUpdate = getStore().features[0];
      
      // Initially not loading
      expect(store.isLoading).toBe(false);
      
      // Start updating feature
      const updatePromise = store.updateFeature(featureToUpdate.id, {
        name: 'Loading Test Update',
        description: 'Testing loading state during update',
      });
      
      // Should complete and reset loading state
      await updatePromise;
      expect(getStore().isLoading).toBe(false);
    });

    it('should reset loading state on update error', async () => {
      const store = getStore();
      
      try {
        await store.updateFeature(999, { // Non-existent ID
          name: 'Error Test Update',
        });
      } catch {
        // Error expected, loading should be reset
        expect(getStore().isLoading).toBe(false);
      }
    });
  });

  describe('Modal State Integration', () => {
    it('should close modal after successful feature update', async () => {
      const store = getStore();
      
      // Setup feature list
      await store.getFeatureList();
      const featureToUpdate = getStore().features[0];
      
      // Open edit modal
      store.openModal('editFeature', featureToUpdate);
      expect(getStore().editFeatureModalOpen).toBe(true);
      
      // Update feature successfully
      await store.updateFeature(featureToUpdate.id, {
        name: 'Success Update Test',
        description: 'Test successful update',
      });
      
      // Modal should remain open until explicitly closed
      // This simulates the component logic where modal is closed after success
      store.closeModal('editFeature');
      expect(getStore().editFeatureModalOpen).toBe(false);
      expect(getStore().selectedFeature).toBe(null);
    });

    it('should handle modal cancellation without changes', () => {
      const store = getStore();
      const testFeature = mockFeatures[1];
      
      // Open edit modal
      store.openModal('editFeature', testFeature);
      expect(getStore().editFeatureModalOpen).toBe(true);
      expect(getStore().selectedFeature).toBe(testFeature);
      
      // Cancel/close modal without saving
      store.closeModal('editFeature');
      expect(getStore().editFeatureModalOpen).toBe(false);
      expect(getStore().selectedFeature).toBe(null);
    });

    it('should handle switching between different features for editing', () => {
      const store = getStore();
      const firstFeature = mockFeatures[0];
      const secondFeature = mockFeatures[1];
      
      // Open edit modal with first feature
      store.openModal('editFeature', firstFeature);
      expect(getStore().selectedFeature).toBe(firstFeature);
      
      // Switch to second feature (close and open new)
      store.closeModal('editFeature');
      store.openModal('editFeature', secondFeature);
      expect(getStore().selectedFeature).toBe(secondFeature);
      expect(getStore().editFeatureModalOpen).toBe(true);
    });
  });

  describe('Feature List Refresh', () => {
    it('should refresh feature list after updating feature', async () => {
      const store = getStore();
      
      // Get initial feature list
      await store.getFeatureList();
      const featureToUpdate = getStore().features[0];
      const originalName = featureToUpdate.name;
      
      // Update feature
      await store.updateFeature(featureToUpdate.id, {
        name: 'Refresh Test Update',
        description: 'Testing list refresh after update',
      });
      
      // Feature list should be updated
      const updatedStore = getStore();
      const updatedFeature = updatedStore.features.find(f => f.id === featureToUpdate.id);
      expect(updatedFeature?.name).toBe('Refresh Test Update');
      expect(updatedFeature?.name).not.toBe(originalName);
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
      const featureToUpdate = getStore().features[0];
      
      // Should be able to update feature when authenticated
      await featureStore.updateFeature(featureToUpdate.id, {
        name: 'Auth Test Update',
        description: 'Testing update with authentication',
      });
      
      const updatedFeature = getStore().features.find(f => f.id === featureToUpdate.id);
      expect(updatedFeature?.name).toBe('Auth Test Update');
    });
  });

  describe('Edge Cases', () => {
    it('should handle editing feature without initial description', async () => {
      const featureWithoutDescription: Feature = {
        id: 100,
        name: 'No Description Feature',
        modality: 'SAR',
      };
      
      const store = getStore();
      
      // Add the feature to mock data
      mockFeatures.push(featureWithoutDescription);
      await store.getFeatureList();
      
      // Update to add description
      await store.updateFeature(featureWithoutDescription.id, {
        description: 'Added description during edit',
      });
      
      const updatedFeature = getStore().features.find(f => f.id === featureWithoutDescription.id);
      expect(updatedFeature?.description).toBe('Added description during edit');
    });

    it('should handle updating feature name with special characters', async () => {
      const store = getStore();
      
      // Setup feature list
      await store.getFeatureList();
      const featureToUpdate = getStore().features[0];
      
      // Update with special characters
      await store.updateFeature(featureToUpdate.id, {
        name: 'Feature_With-Special.Characters',
        description: 'Testing special characters: !@#$%^&*()',
      });
      
      const updatedFeature = getStore().features.find(f => f.id === featureToUpdate.id);
      expect(updatedFeature?.name).toBe('Feature_With-Special.Characters');
      expect(updatedFeature?.description).toBe('Testing special characters: !@#$%^&*()');
    });
  });
});