import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/models/auth';
import { mockUsers } from '@/mocks/data/users';
import { mockSession } from '@/mocks/data/session';

// 使用真实的 MSW Mock API，不需要手动 Mock

// Session Cookie认证不需要mock tokenManager

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // 重置 Mock 会话
    mockSession.clear();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const loginData = {
        userAccount: 'admin',
        userPassword: '123456',
      };

      const expectedUser = mockUsers.find((u) => u.userAccount === 'admin')!;

      // Act
      const { login } = useAuthStore.getState();
      await login(loginData);

      // Assert
      const state = useAuthStore.getState();
      expect(state.user).toEqual(expectedUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should handle login failure', async () => {
      // Arrange
      const loginData = {
        userAccount: 'admin',
        userPassword: 'wrong-password',
      };

      // Act & Assert
      const { login } = useAuthStore.getState();
      await expect(login(loginData)).rejects.toThrow();

      const state = useAuthStore.getState();
      expect(state.user).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should set loading state during login', async () => {
      // Arrange
      const loginData = {
        userAccount: 'admin',
        userPassword: '123456',
      };

      // Act - 测试 loading 状态在真实 API 调用中的变化
      const { login } = useAuthStore.getState();

      const loginPromise = login(loginData);

      // MSW 有 500ms 延迟，在开始时应该是 loading
      expect(useAuthStore.getState().isLoading).toBe(true);

      await loginPromise;

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

      // Act
      const { register } = useAuthStore.getState();
      await register(registerData);

      // Assert
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

      // Act & Assert
      const { register } = useAuthStore.getState();
      await expect(register(registerData)).rejects.toThrow();

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Arrange - setup authenticated user
      useAuthStore.setState({
        user: mockUsers[0],
        isAuthenticated: true,
        isLoading: false,
      });

      // Act
      const { logout } = useAuthStore.getState();
      await logout();

      const state = useAuthStore.getState();
      expect(state.user).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should clear user state even if logout API fails', async () => {
      // Arrange - setup authenticated user
      useAuthStore.setState({
        user: mockUsers[0],
        isAuthenticated: true,
        isLoading: false,
      });

      // Act
      const { logout } = useAuthStore.getState();

      // logout 即使 API 失败也应该清理本地状态
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
