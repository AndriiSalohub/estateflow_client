import type { CreateProperty } from "@/lib/types";

export interface PropertiesStore {
  properties: Property[];
  loading: boolean;
  error: string | null;
  selectedProperty: Property | null;
  filter: "active" | "sold_rented" | "inactive" | null;
  fetchAll: (filter?: "active" | "sold_rented" | "inactive") => Promise<void>;
  create: (
    propertyData: Omit<
      Property,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "isVerified"
      | "views"
      | "pricingHistory"
      | "owner"
      | "isWished"
    >,
  ) => Promise<void>;
  remove: (propertyId: string) => Promise<void>;
  fetchById: (propertyId: string) => Promise<void>;
  verifyProperty: (propertyId: string) => Promise<void>;
  fetchProperties: (
    filter?: "active" | "sold_rented" | "inactive",
    isVerified?: boolean,
  ) => Promise<Property[]>;
  createProperty: (property: CreateProperty) => Promise<Property>;
  updateProperty: (
    propertyId: string,
    propertyData: CreateProperty,
  ) => Promise<Property>;
  deleteProperty: (propertyId: string) => Promise<void>;
  fetchPropertyById: (propertyId: string) => Promise<Property>;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface PropertyView {
  id: string;
  propertyId: string;
  viewedAt: string;
}

export interface PropertyPriceHistory {
  id: string;
  propertyId: string;
  price: string;
  currency: string;
  effectiveDate: string;
}

export interface PropertyOwner {
  id: string;
  username: string;
  email: string;
  role: "renter_buyer" | "agent" | "admin";
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  facilities: string;
  propertyType: string;
  transactionType: string;
  price: string;
  currency: string;
  size: string;
  rooms: number;
  address: string;
  status: "active" | "sold" | "rented" | "inactive";
  documentUrl: string;
  verificationComments: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  views: PropertyView[];
  pricingHistory: PropertyPriceHistory[];
  owner: PropertyOwner;
  isWished: boolean;
}
