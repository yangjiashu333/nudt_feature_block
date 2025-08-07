import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuthStore } from '@/models/auth';
import { authApi } from '@/services/api/auth';
import type { UserLoginReply } from '@/types/auth';
import { mockAuthUsers } from '../mocks/auth-data';
import { mockApiResponses, mockApiErrors } from '../mocks/api-responses';

// Mock the auth API
vi.mock('@/services/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

// Session Cookie认证不需要mock tokenManager

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const loginData = {
        userAccount: 'admin',
        userPassword: 'password',
      };

      const mockResponse = mockApiResponses.loginSuccess();
      vi.mocked(authApi.login).mockResolvedValue(mockResponse);

      // Act
      const { login } = useAuthStore.getState();
      await login(loginData);

      // Assert
      expect(authApi.login).toHaveBeenCalledWith(loginData);
      expect(authApi.login).toHaveBeenCalledTimes(1);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockResponse.user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should handle login failure', async () => {
      // Arrange
      const loginData = {
        userAccount: 'admin',
        userPassword: 'wrong-password',
      };

      vi.mocked(authApi.login).mockRejectedValue(new Error(mockApiErrors.WRONG_PASSWORD));

      // Act & Assert
      const { login } = useAuthStore.getState();
      await expect(login(loginData)).rejects.toThrow(mockApiErrors.WRONG_PASSWORD);

      const state = useAuthStore.getState();
      expect(state.user).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should set loading state during login', async () => {
      // Arrange
      const loginData = {
        userAccount: 'admin',
        userPassword: 'password',
      };

      let resolveLogin: (value: UserLoginReply) => void = () => {};
      const loginPromise = new Promise<UserLoginReply>((resolve) => {
        resolveLogin = resolve;
      });
      vi.mocked(authApi.login).mockReturnValue(loginPromise);

      // Act
      const { login } = useAuthStore.getState();
      const loginCall = login(loginData);

      // Assert loading state
      expect(useAuthStore.getState().isLoading).toBe(true);

      // Resolve the login
      resolveLogin(mockApiResponses.loginSuccess());
      await loginCall;

      // Assert final state
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      // Arrange
      const registerData = {
        userAccount: 'newuser',
        userName: 'New User',
        userPassword: 'password123',
      };

      const mockResponse = mockApiResponses.registerSuccess(100);
      vi.mocked(authApi.register).mockResolvedValue(mockResponse);

      // Act
      const { register } = useAuthStore.getState();
      await register(registerData);

      // Assert
      expect(authApi.register).toHaveBeenCalledWith(registerData);
      expect(authApi.register).toHaveBeenCalledTimes(1);

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should handle register failure when user already exists', async () => {
      // Arrange
      const registerData = {
        userAccount: 'admin', // Already exists
        userName: 'Admin User',
        userPassword: 'password123',
      };

      vi.mocked(authApi.register).mockRejectedValue(new Error(mockApiErrors.USER_ALREADY_EXISTS));

      // Act & Assert
      const { register } = useAuthStore.getState();
      await expect(register(registerData)).rejects.toThrow(mockApiErrors.USER_ALREADY_EXISTS);

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Arrange - setup authenticated user
      useAuthStore.setState({
        user: mockAuthUsers[0],
        isAuthenticated: true,
        isLoading: false,
      });

      vi.mocked(authApi.logout).mockResolvedValue();

      // Act
      const { logout } = useAuthStore.getState();
      await logout();

      // Assert
      expect(authApi.logout).toHaveBeenCalledTimes(1);

      const state = useAuthStore.getState();
      expect(state.user).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should clear user state even if logout API fails', async () => {
      // Arrange - setup authenticated user
      useAuthStore.setState({
        user: mockAuthUsers[0],
        isAuthenticated: true,
        isLoading: false,
      });

      vi.mocked(authApi.logout).mockRejectedValue(new Error(mockApiErrors.NETWORK_ERROR));

      // Act
      const { logout } = useAuthStore.getState();

      // The logout method should not throw error even if API fails
      // because it's wrapped in try/catch with finally block
      await expect(logout()).resolves.toBeUndefined();

      // Assert - should clear state even on API error
      const state = useAuthStore.getState();
      expect(state.user).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const initialState = useAuthStore.getState();

      expect(initialState.user).toBe(null);
      expect(initialState.isAuthenticated).toBe(false);
      expect(initialState.isLoading).toBe(false);
      expect(typeof initialState.login).toBe('function');
      expect(typeof initialState.register).toBe('function');
      expect(typeof initialState.logout).toBe('function');
    });
  });
});
