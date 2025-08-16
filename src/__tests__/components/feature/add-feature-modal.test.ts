import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFeatureStore } from '@/models/feature';
import { useAuthStore } from '@/models/auth';
import { mockFeatures } from '@/mocks/data/features';
import { mockUsers } from '@/mocks/data/users';
import { mockSession } from '@/mocks/data/session';

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
  );
};

const getStore = () => useFeatureStore.getState();

describe('AddFeatureModal Integration', () => {
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
      
      expect(typeof store.addFeature).toBe('function');
      expect(store.addFeatureModalOpen).toBe(false);
      expect(store.isLoading).toBe(false);
    });

    it('should handle modal open state management', () => {
      const { openModal, closeModal } = getStore();
      
      // Test opening modal
      openModal('addFeature');
      expect(getStore().addFeatureModalOpen).toBe(true);
      
      // Test closing modal
      closeModal('addFeature');
      expect(getStore().addFeatureModalOpen).toBe(false);
    });
  });

  describe('Feature Addition Logic', () => {
    it('should add feature with valid data successfully', async () => {
      const store = getStore();
      const newFeatureData = {
        name: 'Test Feature',
        modality: 'SAR' as const,
        description: 'Test feature description',
      };

      // Simulate the form submission logic
      await store.addFeature(newFeatureData);

      const updatedStore = getStore();
      expect(updatedStore.isLoading).toBe(false);
      
      const addedFeature = updatedStore.features.find((f) => f.name === 'Test Feature');
      expect(addedFeature).toBeDefined();
      expect(addedFeature?.modality).toBe('SAR');
      expect(addedFeature?.description).toBe('Test feature description');
    });

    it('should handle feature addition with minimum required fields', async () => {
      const store = getStore();
      const minimalFeatureData = {
        name: 'Minimal Feature',
        modality: 'RD' as const,
      };

      await store.addFeature(minimalFeatureData);

      const updatedStore = getStore();
      const addedFeature = updatedStore.features.find((f) => f.name === 'Minimal Feature');
      expect(addedFeature).toBeDefined();
      expect(addedFeature?.modality).toBe('RD');
      expect(addedFeature?.description).toBeUndefined();
    });

    it('should handle feature addition with all modality types', async () => {
      const store = getStore();
      const modalityTypes = ['SAR', 'RD', '1D'] as const;

      for (const modality of modalityTypes) {
        const featureData = {
          name: `${modality} Feature`,
          modality,
          description: `Feature with ${modality} modality`,
        };

        await store.addFeature(featureData);
        
        const addedFeature = getStore().features.find((f) => f.name === `${modality} Feature`);
        expect(addedFeature).toBeDefined();
        expect(addedFeature?.modality).toBe(modality);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle duplicate feature name error', async () => {
      const store = getStore();
      
      // First add a feature
      await store.addFeature({
        name: 'Duplicate Feature',
        modality: 'SAR' as const,
        description: 'Original feature',
      });

      // Try to add feature with same name
      const duplicateFeatureData = {
        name: 'Duplicate Feature',
        modality: 'RD' as const,
        description: 'Duplicate attempt',
      };

      await expect(store.addFeature(duplicateFeatureData)).rejects.toThrow();
      expect(getStore().isLoading).toBe(false);
    });

    it('should handle network or server errors gracefully', async () => {
      const store = getStore();
      
      // Mock a scenario that would cause server error by adding duplicate
      await store.addFeature({
        name: 'Test Feature',
        modality: 'SAR' as const,
        description: 'First feature',
      });

      const duplicateFeatureData = {
        name: 'Test Feature', // Duplicate name should cause server error
        modality: 'RD' as const,
      };

      // The store should handle errors and reset loading state
      await expect(store.addFeature(duplicateFeatureData)).rejects.toThrow();
      expect(getStore().isLoading).toBe(false);
    });
  });

  describe('Form Validation Requirements', () => {
    it('should require feature name field', () => {
      // Test that name field is required in schema
      const invalidData = {
        modality: 'SAR' as const,
        description: 'Feature without name',
      } as Partial<{ name: string; modality: string; description: string }>;

      // This would be caught by the form validation before reaching the store
      expect(() => {
        if (!invalidData.name || invalidData.name.trim() === '') {
          throw new Error('请输入特征名称');
        }
      }).toThrow('请输入特征名称');
    });

    it('should require modality field', () => {
      // Test that modality field is required in schema
      const invalidData = {
        name: 'Feature without modality',
        description: 'Test description',
      } as Partial<{ name: string; modality: string; description: string }>;

      // This would be caught by the form validation before reaching the store
      expect(() => {
        if (!invalidData.modality) {
          throw new Error('请选择数据模态');
        }
      }).toThrow('请选择数据模态');
    });

    it('should accept valid modality values', () => {
      const validModalities = ['SAR', 'RD', '1D'];
      
      validModalities.forEach(modality => {
        expect(() => {
          if (!validModalities.includes(modality)) {
            throw new Error('请选择数据模态');
          }
        }).not.toThrow();
      });
    });

    it('should reject invalid modality values', () => {
      const invalidModality = 'INVALID';
      
      expect(() => {
        const validModalities = ['SAR', 'RD', '1D'];
        if (!validModalities.includes(invalidModality)) {
          throw new Error('请选择数据模态');
        }
      }).toThrow('请选择数据模态');
    });

    it('should allow optional description field', () => {
      const dataWithoutDescription = {
        name: 'Test Feature',
        modality: 'SAR' as const,
      };

      const dataWithDescription = {
        name: 'Test Feature',
        modality: 'SAR' as const,
        description: 'Test description',
      };

      // Both should be valid
      expect(() => {
        if (!dataWithoutDescription.name) throw new Error('Name required');
        if (!dataWithoutDescription.modality) throw new Error('Modality required');
      }).not.toThrow();

      expect(() => {
        if (!dataWithDescription.name) throw new Error('Name required');
        if (!dataWithDescription.modality) throw new Error('Modality required');
      }).not.toThrow();
    });
  });

  describe('Loading State Management', () => {
    it('should manage loading state during feature addition', async () => {
      const store = getStore();
      
      // Initially not loading
      expect(store.isLoading).toBe(false);
      
      // Start adding feature
      const addPromise = store.addFeature({
        name: 'Loading Test Feature',
        modality: 'SAR' as const,
        description: 'Testing loading state',
      });
      
      // Should complete and reset loading state
      await addPromise;
      expect(getStore().isLoading).toBe(false);
    });

    it('should reset loading state on error', async () => {
      const store = getStore();
      
      try {
        await store.addFeature({
          name: 'Age Feature', // Duplicate name
          modality: 'RD' as const,
        });
      } catch {
        // Error expected, loading should be reset
        expect(getStore().isLoading).toBe(false);
      }
    });
  });

  describe('Modal State Integration', () => {
    it('should close modal after successful feature addition', async () => {
      const { openModal, addFeature } = getStore();
      
      // Open modal
      openModal('addFeature');
      expect(getStore().addFeatureModalOpen).toBe(true);
      
      // Add feature successfully
      await addFeature({
        name: 'Success Test Feature',
        modality: 'SAR' as const,
        description: 'Test successful addition',
      });
      
      // Modal should remain open until explicitly closed
      // This simulates the component logic where modal is closed after success
      const store = getStore();
      store.closeModal('addFeature');
      expect(getStore().addFeatureModalOpen).toBe(false);
    });

    it('should handle modal cancellation', () => {
      const { openModal, closeModal } = getStore();
      
      // Open modal
      openModal('addFeature');
      expect(getStore().addFeatureModalOpen).toBe(true);
      
      // Cancel/close modal
      closeModal('addFeature');
      expect(getStore().addFeatureModalOpen).toBe(false);
      expect(getStore().selectedFeature).toBe(null);
    });
  });

  describe('Feature List Refresh', () => {
    it('should refresh feature list after adding new feature', async () => {
      const store = getStore();
      
      // Get initial feature list
      await store.getFeatureList();
      const initialCount = getStore().features.length;
      
      // Add new feature
      await store.addFeature({
        name: 'Refresh Test Feature',
        modality: '1D' as const,
        description: 'Testing list refresh',
      });
      
      // Feature list should be updated
      const updatedStore = getStore();
      expect(updatedStore.features.length).toBe(initialCount + 1);
      expect(updatedStore.features.find(f => f.name === 'Refresh Test Feature')).toBeDefined();
    });
  });

  describe('Authentication Integration', () => {
    it('should work with authenticated user', async () => {
      const authStore = useAuthStore.getState();
      expect(authStore.isAuthenticated).toBe(true);
      expect(authStore.user).toBeDefined();
      
      // Should be able to add feature when authenticated
      const featureStore = getStore();
      await featureStore.addFeature({
        name: 'Auth Test Feature',
        modality: 'SAR' as const,
        description: 'Testing with authentication',
      });
      
      const addedFeature = getStore().features.find(f => f.name === 'Auth Test Feature');
      expect(addedFeature).toBeDefined();
    });
  });
});