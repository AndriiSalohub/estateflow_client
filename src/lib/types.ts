export interface UserInfo {
  email: string;
  isEmailVerified: boolean;
  role: string;
  avatarUrl: string;
  userId: string;
  bio: string;
  username: string;
  listingLimit: number; // если используешь
  createdAt: string;
  updatedAt: string;
  paypalCredentials?: string;
}

export type CreatePropertyImage = {
  imageUrl: string;
  isPrimary: boolean;
};

export type CreateProperty = {
  ownerId: string;
  title: string;
  description: string;
  propertyType: "house" | "apartment" | string;
  transactionType: "sale" | "rent" | string;
  price: string;
  currency: string;
  size: string;
  rooms: number;
  address: string;
  status: "active" | "inactive" | "sold" | "rented";
  documentUrl: string;
  verificationComments: string;
  facilities: string;
  images: CreatePropertyImage[]; // ✅ Используем другой тип
};

export type UpdateProperty = Partial<CreateProperty> & {
  isVerified?: boolean;
};

export const FACILITY_OPTIONS = [
  "Heating",
  "Air conditioning / Conditioner",
  "Hot water",
  "Gas supply",
  "Wi-Fi",
  "Cable TV",
  "Smart TV",
  "Intercom",
  "Security system",
  "Fridge",
  "Freezer",
  "Washing machine",
  "Dryer",
  "Dishwasher",
  "Microwave",
  "Oven",
  "Stove / Cooktop",
  "Double bed",
  "Single bed",
  "Sofa",
  "Dining table",
  "Wardrobe",
  "Desk",
  "Chairs",
  "Shower",
  "Bathtub",
  "Toilet",
  "Heated towel rail",
  "Pets allowed",
  "Balcony",
  "Terrace",
  "Elevator",
  "Parking",
  "Garage",
  "Storage room",
  "Wheelchair accessible",
  "Smoking allowed",
];

export const transactionTypeOptions = ["sale", "rent"];
export const propertyTypeOptions = ["house", "apartment"];
export const currencyOptions = ["USD", "EUR", "GBP", "UAH"];
export const statusOptions = ["active", "inactive"];
export const ourListingsLimit = 5;
