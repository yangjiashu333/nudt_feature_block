import { vi } from 'vitest';

// Mock global objects for Node environment
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

global.localStorage = mockLocalStorage as Storage;

global.alert = vi.fn();
