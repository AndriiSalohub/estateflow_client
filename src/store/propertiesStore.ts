import { create } from "zustand";
import { $api, API_URL } from "@/api/BaseUrl";
import type { PropertiesStore, Property } from "@/types/propertiesTypes";
import type { CreateProperty } from "@/lib/types";

export const usePropertiesStore = create<PropertiesStore>((set, get) => ({
  properties: [],
  loading: false,
  error: null,
  filter: null,
  selectedProperty: null,

  fetchAll: async (filter) => {
    set({ loading: true, error: null, filter });
    try {
      const data = await get().fetchProperties(filter);
      set({ properties: data });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to load properties",
      });
    } finally {
      set({ loading: false });
    }
  },

  create: async (propertyData) => {
    set({ loading: true, error: null });
    try {
      await get().createProperty(propertyData);
      await get().fetchAll(get().filter || undefined);
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to create property",
      });
    } finally {
      set({ loading: false });
    }
  },

  remove: async (propertyId) => {
    try {
      await get().deleteProperty(propertyId);
      set((state) => ({
        properties: state.properties.filter((p) => p.id !== propertyId),
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to delete property",
      });
    }
  },

  fetchById: async (propertyId) => {
    set({ loading: true, error: null });
    try {
      const data = await get().fetchPropertyById(propertyId);
      set({ selectedProperty: data });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to load property",
      });
    } finally {
      set({ loading: false });
    }
  },

  verifyProperty: async (propertyId) => {
    try {
      await $api.patch(`${API_URL}/api/properties/${propertyId}/verify`);
      set((state) => ({
        properties: state.properties.map((property) =>
          property.id === propertyId
            ? { ...property, isVerified: true }
            : property,
        ),
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to verify property",
      });
    }
  },

  fetchProperties: async (filter, isVerified) => {
    try {
      const params: any = {};
      if (filter) params.filter = filter;
      if (isVerified !== undefined) params.isVerified = isVerified;

      const response = await $api.get<Property[]>(`${API_URL}/api/properties`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch properties";
      throw new Error(message);
    }
  },

  createProperty: async (property: CreateProperty) => {
    if (!property.title) {
      throw new Error("Title is required");
    }
    if (typeof property.price !== "number" || property.price <= 0) {
      throw new Error("Valid price is required");
    }

    try {
      const response = await $api.post<Property>(
        `${API_URL}/api/properties`,
        property,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create property";
      if (message.includes("Listings limit reached")) {
        throw new Error("Listings limit reached");
      }
      throw new Error(message);
    }
  },

  updateProperty: async (propertyId: string, propertyData: CreateProperty) => {
    if (!propertyId) {
      throw new Error("Property ID is required");
    }

    if (!propertyData.title) {
      throw new Error("Title is required");
    }
    if (typeof propertyData.price !== "number" || propertyData.price <= 0) {
      throw new Error("Valid price is required");
    }

    try {
      const response = await $api.patch<Property>(
        `${API_URL}/api/properties/${propertyId}`,
        propertyData,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to update property";
      if (message.includes("not found")) {
        throw new Error("Property not found");
      }
      if (message.includes("not authorized")) {
        throw new Error("Not authorized to update this property");
      }
      throw new Error(message);
    }
  },

  deleteProperty: async (propertyId: string) => {
    if (!propertyId) {
      throw new Error("Property ID is required");
    }

    try {
      await $api.delete(`${API_URL}/api/properties/${propertyId}`);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to delete property";
      if (message.includes("not found")) {
        throw new Error("Property not found");
      }
      if (message.includes("not authorized")) {
        throw new Error("Not authorized to delete this property");
      }
      throw new Error(message);
    }
  },

  fetchPropertyById: async (propertyId: string): Promise<Property> => {
    if (!propertyId) {
      throw new Error("Property ID is required");
    }

    try {
      const response = await $api.get<Property>(
        `${API_URL}/api/properties/${propertyId}`,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch property";
      if (message.includes("not found")) {
        throw new Error("Property not found");
      }
      throw new Error(message);
    }
  },
}));
