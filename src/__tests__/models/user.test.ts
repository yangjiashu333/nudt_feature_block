import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '@/models/user';
import { useAuthStore } from '@/models/auth';
import { mockUsers } from '@/mocks/data/users';
import { mockSession } from '@/mocks/data/session';
import type { User } from '@/types/auth';

// 使用真实的 MSW Mock API，不需要手动 Mock

// Test helpers
const resetMockUsers = () => {
  mockUsers.length = 0;
  mockUsers.push(
    { id: 1, userName: '管理员', userAccount: 'admin', userRole: 'admin' },
    { id: 2, userName: '测试用户', userAccount: 'test', userRole: 'user' },
    { id: 3, userName: 'Demo用户', userAccount: 'demo', userRole: 'user' },
    { id: 4, userName: '被禁用户', userAccount: 'banned', userRole: 'ban' }
  );
};

const getStore = () => useUserStore.getState();
const expectLoadingComplete = (state: ReturnType<typeof getStore>) => {
  expect(state.isLoading).toBe(false);
};

const setupUserList = async () => {
  await getStore().getUserList();
  return getStore().users;
};

describe('UserStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useUserStore.setState({
      users: [],
      isLoading: false,
      selectedUser: null,
      addUserModalOpen: false,
      passwordModalOpen: false,
      deleteUserModalOpen: false,
      deleteUsersModalOpen: false,
    });

    // Set admin user in auth store for tests
    useAuthStore.setState({
      user: mockUsers[0], // admin user
      isAuthenticated: true,
    });

    resetMockUsers();
    mockSession.setCurrentUser(mockUsers[0]);
  });

  describe('getUserList', () => {
    it('should fetch and set user list successfully for admin', async () => {
      // Ensure admin user is set
      useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true });
      
      await getStore().getUserList();

      const state = getStore();
      expect(state.users).toEqual(mockUsers);
      expectLoadingComplete(state);
    });

    it('should fetch only own user data for regular user', async () => {
      // Set regular user
      useAuthStore.setState({ user: mockUsers[1], isAuthenticated: true });
      
      await getStore().getUserList();

      const state = getStore();
      expect(state.users).toEqual([mockUsers[1]]);
      expectLoadingComplete(state);
    });

    it('should set loading state during getUserList', async () => {
      // Ensure admin user is set
      useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true });
      
      const promise = getStore().getUserList();

      expect(getStore().isLoading).toBe(true);
      await promise;
      expectLoadingComplete(getStore());
    });
  });

  describe('addUser', () => {
    it('should add user successfully and refresh user list', async () => {
      // Ensure admin user is set
      useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true });
      
      const newUserData = {
        userAccount: 'testuser',
        userName: 'Test User',
        userPassword: 'password123',
      };

      await getStore().addUser(newUserData);

      const state = getStore();
      expectLoadingComplete(state);

      const newUser = state.users.find((u) => u.userAccount === 'testuser');
      expect(newUser).toBeDefined();
      expect(newUser?.userName).toBe('Test User');
    });

    it('should handle addUser failure when user already exists', async () => {
      // Ensure admin user is set
      useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true });
      
      const existingUserData = {
        userAccount: 'admin',
        userName: 'Admin User',
        userPassword: 'password123',
      };

      await expect(getStore().addUser(existingUserData)).rejects.toThrow();
      expectLoadingComplete(getStore());
    });
  });

  describe('updateUser', () => {
    it('should update user successfully and refresh user list', async () => {
      // Ensure admin user is set
      useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true });
      
      const users = await setupUserList();
      const userToUpdate = users[1];

      const updates = { userName: 'Updated User Name', userRole: 'ban' as const };
      await getStore().updateUser(userToUpdate.id, updates);

      const state = getStore();
      expectLoadingComplete(state);

      const updatedUser = state.users.find((u) => u.id === userToUpdate.id);
      expect(updatedUser?.userName).toBe('Updated User Name');
      expect(updatedUser?.userRole).toBe('ban');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully and refresh user list', async () => {
      // Ensure admin user is set
      useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true });
      
      const users = await setupUserList();
      const userToDelete = users[1];
      const initialCount = users.length;

      await getStore().deleteUser(userToDelete.id);

      const state = getStore();
      expectLoadingComplete(state);
      expect(state.users.length).toBe(initialCount - 1);
      expect(state.users.find((u) => u.id === userToDelete.id)).toBeUndefined();
    });
  });

  describe('deleteUsers', () => {
    it('should delete multiple users successfully and refresh user list', async () => {
      // Ensure admin user is set
      useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true });
      
      const users = await setupUserList();
      const idsToDelete = [3, 4];
      const initialCount = users.length;

      await getStore().deleteUsers(idsToDelete);

      const state = getStore();
      expectLoadingComplete(state);
      expect(state.users.length).toBe(initialCount - idsToDelete.length);
      idsToDelete.forEach((id) => {
        expect(state.users.find((u) => u.id === id)).toBeUndefined();
      });
    });
  });

  describe('modal operations', () => {
    const testModalOperation = (
      modalType: 'addUser' | 'password' | 'deleteUser' | 'deleteUsers',
      modalStateKey: string,
      testUser?: User
    ) => {
      const { openModal, closeModal } = getStore();

      openModal(modalType, testUser);
      const openState = getStore();
      expect(openState[modalStateKey as keyof typeof openState]).toBe(true);
      if (testUser) expect(openState.selectedUser).toBe(testUser);

      closeModal(modalType);
      const closedState = getStore();
      expect(closedState[modalStateKey as keyof typeof closedState]).toBe(false);
      if (testUser) expect(closedState.selectedUser).toBe(null);
    };

    it('should open and close addUser modal', () => {
      testModalOperation('addUser', 'addUserModalOpen');
    });

    it('should open and close password modal with user selection', () => {
      testModalOperation('password', 'passwordModalOpen', mockUsers[0]);
    });

    it('should open and close deleteUser modal with user selection', () => {
      testModalOperation('deleteUser', 'deleteUserModalOpen', mockUsers[1]);
    });

    it('should open and close deleteUsers modal', () => {
      testModalOperation('deleteUsers', 'deleteUsersModalOpen');
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const initialState = useUserStore.getState();

      expect(initialState.users).toEqual([]);
      expect(initialState.isLoading).toBe(false);
      expect(initialState.selectedUser).toBe(null);
      expect(initialState.addUserModalOpen).toBe(false);
      expect(initialState.passwordModalOpen).toBe(false);
      expect(initialState.deleteUserModalOpen).toBe(false);
      expect(initialState.deleteUsersModalOpen).toBe(false);
      expect(typeof initialState.getUserList).toBe('function');
      expect(typeof initialState.addUser).toBe('function');
      expect(typeof initialState.updateUser).toBe('function');
      expect(typeof initialState.deleteUser).toBe('function');
      expect(typeof initialState.deleteUsers).toBe('function');
      expect(typeof initialState.openModal).toBe('function');
      expect(typeof initialState.closeModal).toBe('function');
    });
  });
});
