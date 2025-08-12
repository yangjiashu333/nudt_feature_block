import { create } from 'zustand';
import { userApi } from '@/services/api/user';
import type { User, UserRole } from '@/types/auth';
import { useAuthStore } from '@/models/auth';

type ModalType = 'addUser' | 'password' | 'deleteUser' | 'deleteUsers';

interface UserState {
  users: User[];
  isLoading: boolean;
  selectedUser: User | null;
  addUserModalOpen: boolean;
  passwordModalOpen: boolean;
  deleteUserModalOpen: boolean;
  deleteUsersModalOpen: boolean;

  getUserList: () => Promise<void>;
  addUser: (userData: {
    userAccount: string;
    userName?: string;
    userPassword: string;
  }) => Promise<void>;
  updateUser: (
    id: number,
    updates: { userName?: string; userPassword?: string; userRole?: UserRole }
  ) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  deleteUsers: (ids: number[]) => Promise<void>;

  openModal: (modal: ModalType, user?: User | null) => void;
  closeModal: (modal: ModalType) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  selectedUser: null,
  addUserModalOpen: false,
  passwordModalOpen: false,
  deleteUserModalOpen: false,
  deleteUsersModalOpen: false,

  getUserList: async () => {
    set({ isLoading: true });
    try {
      const response = await userApi.getUserList();
      // 如果是普通用户，只显示自己的信息
      const currentUser = useAuthStore.getState().user;
      const users =
        currentUser?.userRole === 'admin'
          ? response
          : response.filter((user) => user.id === currentUser?.id);
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  addUser: async (userData) => {
    set({ isLoading: true });
    try {
      await userApi.createUser(userData);
      const users = await userApi.getUserList();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (id, updates) => {
    set({ isLoading: true });
    try {
      await userApi.updateUser(id, updates);
      const users = await userApi.getUserList();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      await userApi.deleteUser(id);
      const users = await userApi.getUserList();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUsers: async (ids) => {
    set({ isLoading: true });
    try {
      await Promise.all(ids.map((id) => userApi.deleteUser(id)));
      const users = await userApi.getUserList();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  openModal: (modal, user = null) => {
    const modalState = {
      addUser: { addUserModalOpen: true },
      password: { passwordModalOpen: true, selectedUser: user },
      deleteUser: { deleteUserModalOpen: true, selectedUser: user },
      deleteUsers: { deleteUsersModalOpen: true },
    };
    set(modalState[modal]);
  },

  closeModal: (modal) => {
    const modalState = {
      addUser: { addUserModalOpen: false },
      password: { passwordModalOpen: false, selectedUser: null },
      deleteUser: { deleteUserModalOpen: false, selectedUser: null },
      deleteUsers: { deleteUsersModalOpen: false },
    };
    set(modalState[modal]);
  },
}));
