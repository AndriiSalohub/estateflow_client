export interface User {
  id: string;
  username: string;
  email: string;
  role: "renter_buyer" | "private_seller" | "agency" | "moderator" | "admin";
  isEmailVerified: boolean;
  paypalCredentials?: string;
  listingLimit?: number;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersState {
  isLoading: boolean;
  error: string | null;
  users: User[];
  fetchAllUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addUser: (user: any) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}
