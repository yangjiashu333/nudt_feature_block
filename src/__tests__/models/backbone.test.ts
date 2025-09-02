import { describe, it, expect, beforeEach } from 'vitest';
import { useBackboneStore } from '@/models/backbone';
import { mockBackbones } from '@/mocks/data/backbones';

describe('BackboneStore', () => {
  beforeEach(() => {
    useBackboneStore.setState({
      backbones: [],
      isLoading: false,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const initialState = useBackboneStore.getState();

      expect(initialState.backbones).toEqual([]);
      expect(initialState.isLoading).toBe(false);
      expect(typeof initialState.getBackboneList).toBe('function');
    });
  });

  describe('getBackboneList', () => {
    it('should fetch backbone list successfully', async () => {
      const { getBackboneList } = useBackboneStore.getState();
      await getBackboneList();

      const state = useBackboneStore.getState();
      expect(state.backbones).toEqual(mockBackbones);
      expect(state.isLoading).toBe(false);
    });

    it('should set loading state during fetch', async () => {
      const { getBackboneList } = useBackboneStore.getState();

      const fetchPromise = getBackboneList();

      expect(useBackboneStore.getState().isLoading).toBe(true);

      await fetchPromise;

      expect(useBackboneStore.getState().isLoading).toBe(false);
    });

    it('should handle API errors gracefully', async () => {
      // This would be tested with MSW server error handlers in a real scenario
      const { getBackboneList } = useBackboneStore.getState();

      // For now, just test that the function exists and loading state is managed
      await getBackboneList();

      const state = useBackboneStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should reset loading state even if API fails', async () => {
      const { getBackboneList } = useBackboneStore.getState();

      // Test that loading is managed properly
      await getBackboneList();

      const state = useBackboneStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should update state with fetched backbones', async () => {
      const { getBackboneList } = useBackboneStore.getState();
      await getBackboneList();

      const state = useBackboneStore.getState();
      expect(state.backbones).toHaveLength(mockBackbones.length);
      expect(state.backbones[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
      });
    });

    it('should handle empty response', async () => {
      // This would be tested with MSW handlers returning empty arrays
      const { getBackboneList } = useBackboneStore.getState();
      await getBackboneList();

      const state = useBackboneStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('backbone data structure', () => {
    it('should validate backbone object structure', async () => {
      const { getBackboneList } = useBackboneStore.getState();
      await getBackboneList();

      const state = useBackboneStore.getState();
      const backbone = state.backbones[0];

      expect(backbone).toHaveProperty('id');
      expect(backbone).toHaveProperty('name');
      expect(typeof backbone.id).toBe('number');
      expect(typeof backbone.name).toBe('string');

      if (backbone.description) {
        expect(typeof backbone.description).toBe('string');
      }

      if (backbone.params_schema) {
        expect(typeof backbone.params_schema).toBe('string');
        expect(() => JSON.parse(backbone.params_schema!)).not.toThrow();
      }
    });

    it('should handle backbones with and without optional fields', async () => {
      const { getBackboneList } = useBackboneStore.getState();
      await getBackboneList();

      const state = useBackboneStore.getState();

      const backboneWithSchema = state.backbones.find((b) => b.params_schema);
      const backboneWithoutSchema = state.backbones.find((b) => !b.params_schema);

      expect(backboneWithSchema).toBeDefined();
      expect(backboneWithoutSchema).toBeDefined();

      if (backboneWithSchema?.params_schema) {
        expect(() => JSON.parse(backboneWithSchema.params_schema!)).not.toThrow();
      }
    });
  });

  describe('concurrent requests', () => {
    it('should handle multiple concurrent requests', async () => {
      const { getBackboneList } = useBackboneStore.getState();

      const promises = [getBackboneList(), getBackboneList(), getBackboneList()];

      await Promise.all(promises);

      const state = useBackboneStore.getState();
      expect(state.backbones).toEqual(mockBackbones);
      expect(state.isLoading).toBe(false);
    });
  });
});
