import type { UserRole } from "./userTypes";

export interface AuthStore {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  register: (data: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (code: string, role?: string) => Promise<{ message: string }>;
  checkAuth: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
