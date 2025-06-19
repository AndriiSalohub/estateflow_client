import { create } from "zustand";
import type { SubscriptionState } from "@/types/subscriptionTypes";

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  user: null,
  subscription: null,
  isExpanded: false,
  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));
