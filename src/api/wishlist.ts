import { $api } from "./BaseUrl";

export const fetchWishlist = (token: string) => {
  return $api.get("/api/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addToWishlist = (propertyId: string) => {
  try {
    return $api.post("/api/wishlist", { propertyId });
  } catch (err) {}
};

export const removeFromWishlist = (propertyId: string) => {
  return $api.delete(`/api/wishlist/${propertyId}`);
};
