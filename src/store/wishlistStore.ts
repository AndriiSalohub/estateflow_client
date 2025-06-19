import { create } from "zustand";
import { $api, API_URL } from "@/api/BaseUrl";
import type { WishlistStore } from "@/types/wishlistTypes";

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],
  loading: false,
  error: null,

  loadWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await $api.get(`${API_URL}/api/wishlist`);
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
      await $api.post(`${API_URL}/api/wishlist`, { propertyId });
      await get().loadWishlist();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        set({ error: "Property is already in your wishlist" });
      } else if (err?.response?.status === 401) {
        set({ error: "You are not authorized" });
      } else {
        set({
          error: err?.response?.data?.message || "Failed to add to wishlist",
        });
      }
    }
  },

  removeProperty: async (propertyId: string) => {
    try {
      await $api.delete(`${API_URL}/api/wishlist/${propertyId}`);
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item.id !== propertyId),
      }));
    } catch (err: any) {
      if (err?.response?.status === 401) {
        set({ error: "You are not authorized" });
      } else {
        set({
          error:
            err?.response?.data?.message || "Failed to remove from wishlist",
        });
      }
    }
  },
}));
