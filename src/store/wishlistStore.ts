import { create } from "zustand";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/api/wishlist";
import type { PropertyWishlist } from "@/lib/types";

interface WishlistStore {
  wishlist: PropertyWishlist[];
  loading: boolean;
  error: string | null;
  loadWishlist: () => Promise<void>;
  addProperty: (propertyId: string) => Promise<void>;
  removeProperty: (propertyId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],
  loading: false,
  error: null,

  loadWishlist: async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      set({ error: "You are not authorized" });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await fetchWishlist(token);
      set({ wishlist: data });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        set({ error: "You are not authorized" });
        return;
      }
      set({ error: err?.response?.data?.message || "Failed to load wishlist" });
    } finally {
      set({ loading: false });
    }
  },

  addProperty: async (propertyId: string) => {
    try {
      await addToWishlist(propertyId);
      await get().loadWishlist();
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Failed to add to wishlist",
      });
    }
  },

  removeProperty: async (propertyId: string) => {
    try {
      await removeFromWishlist(propertyId);
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item.id !== propertyId),
      }));
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Failed to remove from wishlist",
      });
    }
  },
}));
