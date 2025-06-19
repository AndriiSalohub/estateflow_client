export interface User {
  userId: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
  avatarUrl: string;
  bio: string;
  username: string;
  listingLimit: number;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    status: string;
    endDate?: string;
  };
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: string;
}

export interface SubscriptionState {
  user: User | null;
  subscription: Subscription | null;
  isExpanded: boolean;
  setUser: (user: User) => void;
  setSubscription: (subscription: Subscription) => void;
  toggleExpanded: () => void;
}
