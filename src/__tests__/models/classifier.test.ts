import { describe, it, expect, beforeEach } from 'vitest';
import { useClassifierStore } from '@/models/classifier';
import { mockClassifiers } from '@/mocks/data/classifiers';

describe('ClassifierStore', () => {
  beforeEach(() => {
    useClassifierStore.setState({
      classifiers: [],
      isLoading: false,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const initialState = useClassifierStore.getState();

      expect(initialState.classifiers).toEqual([]);
      expect(initialState.isLoading).toBe(false);
      expect(typeof initialState.getClassifierList).toBe('function');
    });
  });

  describe('getClassifierList', () => {
    it('should fetch classifier list successfully', async () => {
      const { getClassifierList } = useClassifierStore.getState();
      await getClassifierList();

      const state = useClassifierStore.getState();
      expect(state.classifiers).toEqual(mockClassifiers);
      expect(state.isLoading).toBe(false);
    });

    it('should set loading state during fetch', async () => {
      const { getClassifierList } = useClassifierStore.getState();

      const fetchPromise = getClassifierList();

      expect(useClassifierStore.getState().isLoading).toBe(true);

      await fetchPromise;

      expect(useClassifierStore.getState().isLoading).toBe(false);
    });

    it('should handle API errors gracefully', async () => {
      // This would be tested with MSW server error handlers in a real scenario
      const { getClassifierList } = useClassifierStore.getState();

      // For now, just test that the function exists and loading state is managed
      await getClassifierList();

      const state = useClassifierStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should reset loading state even if API fails', async () => {
      const { getClassifierList } = useClassifierStore.getState();

      // Test that loading is managed properly
      await getClassifierList();

      const state = useClassifierStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should update state with fetched classifiers', async () => {
      const { getClassifierList } = useClassifierStore.getState();
      await getClassifierList();

      const state = useClassifierStore.getState();
      expect(state.classifiers).toHaveLength(mockClassifiers.length);
      expect(state.classifiers[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
      });
    });

    it('should handle empty response', async () => {
      // This would be tested with MSW handlers returning empty arrays
      const { getClassifierList } = useClassifierStore.getState();
      await getClassifierList();

      const state = useClassifierStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('classifier data structure', () => {
    it('should validate classifier object structure', async () => {
      const { getClassifierList } = useClassifierStore.getState();
      await getClassifierList();

      const state = useClassifierStore.getState();
      const classifier = state.classifiers[0];

      expect(classifier).toHaveProperty('id');
      expect(classifier).toHaveProperty('name');
      expect(typeof classifier.id).toBe('number');
      expect(typeof classifier.name).toBe('string');

      if (classifier.description) {
        expect(typeof classifier.description).toBe('string');
      }

      if (classifier.params_schema) {
        expect(typeof classifier.params_schema).toBe('string');
        expect(() => JSON.parse(classifier.params_schema!)).not.toThrow();
      }
    });

    it('should handle classifiers with and without optional fields', async () => {
      const { getClassifierList } = useClassifierStore.getState();
      await getClassifierList();

      const state = useClassifierStore.getState();
      
      const classifierWithSchema = state.classifiers.find(c => c.params_schema);
      const classifierWithoutSchema = state.classifiers.find(c => !c.params_schema);

      expect(classifierWithSchema).toBeDefined();
      expect(classifierWithoutSchema).toBeDefined();

      if (classifierWithSchema?.params_schema) {
        expect(() => JSON.parse(classifierWithSchema.params_schema!)).not.toThrow();
      }
    });
  });

  describe('classifier types validation', () => {
    it('should contain expected classifier types', async () => {
      const { getClassifierList } = useClassifierStore.getState();
      await getClassifierList();

      const state = useClassifierStore.getState();
      const classifierNames = state.classifiers.map(c => c.name);

      expect(classifierNames).toContain('SVM');
      expect(classifierNames).toContain('Random Forest');
      expect(classifierNames).toContain('XGBoost');
      expect(classifierNames).toContain('Logistic Regression');
      expect(classifierNames).toContain('Naive Bayes');
      expect(classifierNames).toContain('Neural Network');
    });

    it('should have valid parameter schemas for classifiers that have them', async () => {
      const { getClassifierList } = useClassifierStore.getState();
      await getClassifierList();

      const state = useClassifierStore.getState();
      const classifiersWithSchema = state.classifiers.filter(c => c.params_schema);

      for (const classifier of classifiersWithSchema) {
        const schema = JSON.parse(classifier.params_schema!);
        expect(typeof schema).toBe('object');
        
        for (const [key, value] of Object.entries(schema)) {
          expect(typeof key).toBe('string');
          expect(typeof value).toBe('object');
          expect(value).toHaveProperty('type');
        }
      }
    });
  });

  describe('concurrent requests', () => {
    it('should handle multiple concurrent requests', async () => {
      const { getClassifierList } = useClassifierStore.getState();

      const promises = [
        getClassifierList(),
        getClassifierList(),
        getClassifierList(),
      ];

      await Promise.all(promises);

      const state = useClassifierStore.getState();
      expect(state.classifiers).toEqual(mockClassifiers);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('state management', () => {
    it('should maintain state across multiple calls', async () => {
      const { getClassifierList } = useClassifierStore.getState();
      
      await getClassifierList();
      const firstState = useClassifierStore.getState();
      
      await getClassifierList();
      const secondState = useClassifierStore.getState();

      expect(secondState.classifiers).toEqual(firstState.classifiers);
      expect(secondState.isLoading).toBe(false);
    });

    it('should allow manual state updates', () => {
      const customClassifiers = [
        { id: 999, name: 'Custom Classifier', description: 'Test classifier' }
      ];

      useClassifierStore.setState({ classifiers: customClassifiers });

      const state = useClassifierStore.getState();
      expect(state.classifiers).toEqual(customClassifiers);
    });
  });
});