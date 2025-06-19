export type UserRole =
  | "renter_buyer"
  | "private_seller"
  | "agency"
  | "moderator"
  | "admin";

export interface CurrentUser {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  paypalCredentials?: string;
}

export interface UserStore {
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateProfile: (data: {
    username: string;
    avatarUrl?: string;
    bio?: string;
    paypalCredentials?: string;
  }) => Promise<void>;
  requestEmailChange: (newEmail: string) => Promise<void>;
  confirmEmailChange: (token: string) => Promise<void>;
  requestPasswordChange: (newPassword: string) => Promise<void>;
  confirmPasswordChange: (token: string) => Promise<void>;
  clearError: () => void;
  setUser: (user: CurrentUser | null) => void;
}
