export interface PropertyWishlist {
  id: string;
  ownerId: string;
  isVerified: boolean;
  title: string;
  description: string;
  facilities: string;
  propertyType: string;
  transactionType: string;
  price: number;
  currency: string;
  size: number;
  rooms: number;
  address: string;
  status: "active" | "sold" | "rented" | "inactive";
  documentUrl: string;
  verificationComments: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  views: string[];
}

export interface WishlistStore {
  wishlist: PropertyWishlist[];
  loading: boolean;
  error: string | null;
  loadWishlist: () => Promise<void>;
  addProperty: (propertyId: string) => Promise<void>;
  removeProperty: (propertyId: string) => Promise<void>;
}
