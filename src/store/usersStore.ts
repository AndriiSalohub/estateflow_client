import { create } from "zustand";
import axios from "axios";
import { $api, API_URL } from "@/api/BaseUrl";
import type { User, UsersState } from "@/types/usersTypes";

export const useUsersStore = create<UsersState>((set) => ({
  isLoading: false,
  error: null,
  users: [],

  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await $api.get(`${API_URL}/api/user/all`);
      set({ users: response.data, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to fetch users"
        : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteUser: async (userId: string) => {
    set({ error: null });
    try {
      await $api.delete(`${API_URL}/api/user/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      }));
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to delete user"
        : "An unexpected error occurred";
      set({ error: errorMessage });
    }
  },

  addUser: async (user) => {
    set({ error: null });
    try {
      const response = await $api.post(`${API_URL}/api/user`, {
        newUserInfo: {
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          bio: user.bio,
          avatarUrl:
            "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
        },
      });
      set((state) => ({
        users: [
          ...state.users,
          {
            ...response.data,
            isEmailVerified: true,
          },
        ],
      }));
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to add user"
        : "An unexpected error occurred";
      set({ error: errorMessage });
    }
  },

  updateUser: async (user: User) => {
    set({ error: null });
    try {
      const response = await $api.patch(`${API_URL}/api/user/${user.id}`, {
        updatedInfo: user,
      });
      set((state) => ({
        users: state.users.map((u) =>
          u.id === user.id ? { ...response.data } : u,
        ),
      }));
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to update user"
        : "An unexpected error occurred";
      set({ error: errorMessage });
    }
  },
}));
