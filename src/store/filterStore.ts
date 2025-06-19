import { create } from "zustand";
import axios from "axios";
import { API_URL } from "@/api/BaseUrl";
import type { FilterState } from "@/types/filterTypes";

const DEFAULT_TYPES = ["sale", "rent"] as const;
const DEFAULT_ROOMS = [1, 2, 3, 4, 5] as const;
const DEFAULT_PROPERTY_TYPES = ["apartment", "house"] as const;

const fetchFilterData = async () => {
  try {
    const [
      priceResponse,
      areaResponse,
      roomsResponse,
      typesResponse,
      propertyTypesResponse,
    ] = await Promise.all([
      axios.get(`${API_URL}/api/filters/price-range`),
      axios.get(`${API_URL}/api/filters/area-range`),
      axios.get(`${API_URL}/api/filters/rooms`),
      axios.get(`${API_URL}/api/filters/transaction-types`),
      axios.get(`${API_URL}/api/filters/property-types`),
    ]);

    return {
      price: [0, priceResponse.data.maxPrice || 0] as [number, number],
      area: [0, areaResponse.data.maxArea || 0] as [number, number],
      rooms: roomsResponse.data.rooms || DEFAULT_ROOMS,
      types: typesResponse.data.transactionTypes || DEFAULT_TYPES,
      propertyTypes:
        propertyTypesResponse.data.propertyTypes || DEFAULT_PROPERTY_TYPES,
    };
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to fetch filter data"
        : "Failed to fetch filter data",
    );
  }
};

export const useFilterStore = create<FilterState>((set, get) => ({
  price: [0, 0],
  area: [0, 0],
  types: [...DEFAULT_TYPES],
  rooms: [...DEFAULT_ROOMS],
  propertyTypes: [...DEFAULT_PROPERTY_TYPES],
  searchQuery: "",
  sortBy: "newest",
  isLoading: false,
  error: null,

  availableTypes: [...DEFAULT_TYPES],
  availableRooms: [...DEFAULT_ROOMS],
  availablePropertyTypes: [...DEFAULT_PROPERTY_TYPES],

  selectedTypes: [...DEFAULT_TYPES],
  selectedRooms: [...DEFAULT_ROOMS],
  selectedPropertyTypes: [...DEFAULT_PROPERTY_TYPES],

  setPrice: (range) => set({ price: range }),
  setArea: (range) => set({ area: range }),

  toggleType: (type) =>
    set((state) => {
      const isSelected = state.types.includes(type);

      if (isSelected && state.types.length === 1) return state;

      const newSelectedTypes = isSelected
        ? state.types.filter((t) => t !== type)
        : [...state.types, type];

      return {
        types: newSelectedTypes,
      };
    }),

  toggleRoom: (room) =>
    set((state) => {
      const isSelected = state.rooms.includes(room);

      if (isSelected && state.rooms.length === 1) return state;

      const newSelectedRooms = isSelected
        ? state.rooms.filter((r) => r !== room)
        : [...state.rooms, room];

      return {
        rooms: newSelectedRooms,
      };
    }),

  togglePropertyType: (propertyType) =>
    set((state) => {
      const isSelected = state.propertyTypes.includes(propertyType);

      if (isSelected && state.propertyTypes.length === 1) return state;

      const newSelectedPropertyTypes = isSelected
        ? state.propertyTypes.filter((pt) => pt !== propertyType)
        : [...state.propertyTypes, propertyType];

      return {
        propertyTypes: newSelectedPropertyTypes,
      };
    }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),

  resetFilters: () => {
    const currentState = get();
    set({
      price: [0, currentState.price[1] || 0],
      area: [0, currentState.area[1] || 0],
      types: [...DEFAULT_TYPES],
      rooms: [...DEFAULT_ROOMS],
      searchQuery: "",
      sortBy: "newest",
    });
  },

  fetchFilters: async () => {
    set({ isLoading: true, error: null });
    try {
      const filterData = await fetchFilterData();
      set({
        price: filterData.price,
        area: filterData.area,
        types: filterData.types,
        rooms: filterData.rooms,
        propertyTypes: filterData.propertyTypes,
        isLoading: false,
        availableTypes: filterData.types,
        availableRooms: filterData.rooms,
        availablePropertyTypes: filterData.propertyTypes,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
}));
