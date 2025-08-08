import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@/mocks/server';

// Mock import.meta.env for tests
vi.stubEnv('VITE_ENABLE_MSW', 'true');
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');
vi.stubEnv('VITE_API_TIMEOUT', '30000');

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

// MSW Server setup
beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
