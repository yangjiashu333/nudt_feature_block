import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useUserStore } from '@/models/user';
import { userApi } from '@/services/api/user';
import { mockUsersDatabase, createMockUser } from '../mocks/user-data';
import { mockApiResponses, mockApiErrors } from '../mocks/api-responses';
import type { UserListReply } from '@/types/auth';

// Mock the user API
vi.mock('@/services/api/user', () => ({
  userApi: {
    getUserList: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    deleteUsers: vi.fn(),
  },
}));

describe('UserStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useUserStore.setState({
      users: [],
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserList', () => {
    it('should fetch and set user list successfully', async () => {
      // Arrange
      const mockUsers = mockApiResponses.getUserListSuccess();
      vi.mocked(userApi.getUserList).mockResolvedValue(mockUsers);

      // Act
      const { getUserList } = useUserStore.getState();
      await getUserList();

      // Assert
      expect(userApi.getUserList).toHaveBeenCalledTimes(1);

      const state = useUserStore.getState();
      expect(state.users).toEqual(mockUsers);
      expect(state.isLoading).toBe(false);
    });

    it('should handle getUserList failure', async () => {
      // Arrange
      vi.mocked(userApi.getUserList).mockRejectedValue(new Error(mockApiErrors.NETWORK_ERROR));

      // Act & Assert
      const { getUserList } = useUserStore.getState();
      await expect(getUserList()).rejects.toThrow(mockApiErrors.NETWORK_ERROR);

      const state = useUserStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should set loading state during getUserList', async () => {
      // Arrange
      let resolveGetUserList: (value: UserListReply) => void = () => {};
      const getUserListPromise = new Promise<UserListReply>((resolve) => {
        resolveGetUserList = resolve;
      });
      vi.mocked(userApi.getUserList).mockReturnValue(getUserListPromise);

      // Act
      const { getUserList } = useUserStore.getState();
      const getUserListCall = getUserList();

      // Assert loading state
      expect(useUserStore.getState().isLoading).toBe(true);

      // Resolve the API call
      resolveGetUserList(mockApiResponses.getUserListSuccess());
      await getUserListCall;

      // Assert final state
      expect(useUserStore.getState().isLoading).toBe(false);
    });
  });

  describe('addUser', () => {
    it('should add user successfully and refresh user list', async () => {
      // Arrange
      const newUserData = {
        userAccount: 'testuser',
        userName: 'Test User',
        userPassword: 'password123',
        userRole: 'user' as const,
      };

      const createResponse = mockApiResponses.createUserSuccess(100);
      const updatedUserList = [
        ...mockUsersDatabase,
        createMockUser({ userAccount: 'testuser', userName: 'Test User', userRole: 'user' }),
      ];

      vi.mocked(userApi.createUser).mockResolvedValue(createResponse);
      vi.mocked(userApi.getUserList).mockResolvedValue(updatedUserList);

      // Act
      const { addUser } = useUserStore.getState();
      await addUser(newUserData);

      // Assert
      expect(userApi.createUser).toHaveBeenCalledWith(newUserData);
      expect(userApi.getUserList).toHaveBeenCalledTimes(1);

      const state = useUserStore.getState();
      expect(state.users).toEqual(updatedUserList);
      expect(state.isLoading).toBe(false);
    });

    it('should handle addUser failure when user already exists', async () => {
      // Arrange
      const existingUserData = {
        userAccount: 'admin', // Already exists
        userName: 'Admin User',
        userPassword: 'password123',
        userRole: 'admin' as const,
      };

      vi.mocked(userApi.createUser).mockRejectedValue(new Error(mockApiErrors.USER_ALREADY_EXISTS));

      // Act & Assert
      const { addUser } = useUserStore.getState();
      await expect(addUser(existingUserData)).rejects.toThrow(mockApiErrors.USER_ALREADY_EXISTS);

      const state = useUserStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully and refresh user list', async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        userName: 'Updated Name',
        userRole: 'user' as const,
      };

      const updatedUser = { ...mockUsersDatabase[0], ...updateData };
      const updatedUserList = mockUsersDatabase.map((u) => (u.id === userId ? updatedUser : u));

      vi.mocked(userApi.updateUser).mockResolvedValue(updatedUser);
      vi.mocked(userApi.getUserList).mockResolvedValue(updatedUserList);

      // Act
      const { updateUser } = useUserStore.getState();
      await updateUser(userId, updateData);

      // Assert
      expect(userApi.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(userApi.getUserList).toHaveBeenCalledTimes(1);

      const state = useUserStore.getState();
      expect(state.users).toEqual(updatedUserList);
      expect(state.isLoading).toBe(false);
    });

    it('should handle updateUser failure when user not found', async () => {
      // Arrange
      const nonExistentUserId = 999;
      const updateData = { userName: 'New Name' };

      vi.mocked(userApi.updateUser).mockRejectedValue(new Error(mockApiErrors.USER_NOT_FOUND));

      // Act & Assert
      const { updateUser } = useUserStore.getState();
      await expect(updateUser(nonExistentUserId, updateData)).rejects.toThrow(
        mockApiErrors.USER_NOT_FOUND
      );

      const state = useUserStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully and refresh user list', async () => {
      // Arrange
      const userIdToDelete = 2;
      const updatedUserList = mockUsersDatabase.filter((u) => u.id !== userIdToDelete);

      vi.mocked(userApi.deleteUser).mockResolvedValue();
      vi.mocked(userApi.getUserList).mockResolvedValue(updatedUserList);

      // Act
      const { deleteUser } = useUserStore.getState();
      await deleteUser(userIdToDelete);

      // Assert
      expect(userApi.deleteUser).toHaveBeenCalledWith(userIdToDelete);
      expect(userApi.getUserList).toHaveBeenCalledTimes(1);

      const state = useUserStore.getState();
      expect(state.users).toEqual(updatedUserList);
      expect(state.isLoading).toBe(false);
    });

    it('should handle deleteUser failure when user not found', async () => {
      // Arrange
      const nonExistentUserId = 999;
      vi.mocked(userApi.deleteUser).mockRejectedValue(new Error(mockApiErrors.USER_NOT_FOUND));

      // Act & Assert
      const { deleteUser } = useUserStore.getState();
      await expect(deleteUser(nonExistentUserId)).rejects.toThrow(mockApiErrors.USER_NOT_FOUND);

      const state = useUserStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('deleteUsers', () => {
    it('should delete multiple users successfully and refresh user list', async () => {
      // Arrange
      const userIdsToDelete = [2, 3, 4];
      const updatedUserList = mockUsersDatabase.filter((u) => !userIdsToDelete.includes(u.id));

      vi.mocked(userApi.deleteUsers).mockResolvedValue();
      vi.mocked(userApi.getUserList).mockResolvedValue(updatedUserList);

      // Act
      const { deleteUsers } = useUserStore.getState();
      await deleteUsers(userIdsToDelete);

      // Assert
      expect(userApi.deleteUsers).toHaveBeenCalledWith(userIdsToDelete);
      expect(userApi.getUserList).toHaveBeenCalledTimes(1);

      const state = useUserStore.getState();
      expect(state.users).toEqual(updatedUserList);
      expect(state.isLoading).toBe(false);
    });

    it('should handle deleteUsers with empty array', async () => {
      // Arrange
      const emptyArray: number[] = [];
      vi.mocked(userApi.deleteUsers).mockResolvedValue();
      vi.mocked(userApi.getUserList).mockResolvedValue(mockUsersDatabase);

      // Act
      const { deleteUsers } = useUserStore.getState();
      await deleteUsers(emptyArray);

      // Assert
      expect(userApi.deleteUsers).toHaveBeenCalledWith(emptyArray);
      expect(userApi.getUserList).toHaveBeenCalledTimes(1);
    });
  });

  describe('loading states', () => {
    it('should handle loading states correctly for all operations', async () => {
      // Test that all operations properly set and unset loading state
      const operations = [
        () => useUserStore.getState().getUserList(),
        () =>
          useUserStore
            .getState()
            .addUser({ userAccount: 'test', userPassword: 'pass', userRole: 'user' }),
        () => useUserStore.getState().updateUser(1, { userName: 'test' }),
        () => useUserStore.getState().deleteUser(1),
        () => useUserStore.getState().deleteUsers([1, 2]),
      ];

      // Mock all API calls to resolve immediately
      vi.mocked(userApi.getUserList).mockResolvedValue(mockUsersDatabase);
      vi.mocked(userApi.createUser).mockResolvedValue(mockApiResponses.createUserSuccess(100));
      vi.mocked(userApi.updateUser).mockResolvedValue(mockUsersDatabase[0]);
      vi.mocked(userApi.deleteUser).mockResolvedValue();
      vi.mocked(userApi.deleteUsers).mockResolvedValue();

      for (const operation of operations) {
        // Reset loading state
        useUserStore.setState({ isLoading: false });

        // Execute operation and verify loading state is properly managed
        await operation();

        const state = useUserStore.getState();
        expect(state.isLoading).toBe(false);
      }
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const initialState = useUserStore.getState();

      expect(initialState.users).toEqual([]);
      expect(initialState.isLoading).toBe(false);
      expect(typeof initialState.getUserList).toBe('function');
      expect(typeof initialState.addUser).toBe('function');
      expect(typeof initialState.updateUser).toBe('function');
      expect(typeof initialState.deleteUser).toBe('function');
      expect(typeof initialState.deleteUsers).toBe('function');
    });
  });
});
