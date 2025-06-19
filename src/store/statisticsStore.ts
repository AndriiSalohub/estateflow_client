import { create } from "zustand";
import axios from "axios";
import { $api, API_URL } from "@/api/BaseUrl";
import type { StatisticsState } from "@/types/statisticsTypes";

export const useStatisticsStore = create<StatisticsState>((set) => ({
  totalSales: null,
  topViewedProperties: [],
  newUsers: null,
  propertyViews: null,
  loading: false,
  propertyViewsLoading: false,
  error: "",
  setTotalSales: (data) => set({ totalSales: data }),
  setTopViewedProperties: (data) => set({ topViewedProperties: data }),
  setNewUsers: (data) => set({ newUsers: data }),
  setPropertyViews: (data) => set({ propertyViews: data }),
  setLoading: (loading) => set({ loading }),
  setPropertyViewsLoading: (loading) => set({ propertyViewsLoading: loading }),
  setError: (error) => set({ error }),
  fetchTotalSales: async (startDate, endDate) => {
    set({ loading: true, error: "" });
    try {
      const response = await $api.get(`${API_URL}/api/stats/total-sales`, {
        params: { startDate, endDate },
      });
      set({ totalSales: response.data });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.message
          : "Failed to fetch total sales",
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchTopViewedProperties: async (startDate, endDate) => {
    set({ loading: true, error: "" });
    try {
      const response = await $api.get(`${API_URL}/api/stats/top-viewed`, {
        params: { startDate, endDate, limit: 5 },
      });
      set({ topViewedProperties: response.data });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.message
          : "Failed to fetch top viewed properties",
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchNewUsers: async (startDate, endDate) => {
    set({ loading: true, error: "" });
    try {
      const response = await $api.get(`${API_URL}/api/stats/new-users`, {
        params: { startDate, endDate },
      });
      set({ newUsers: response.data });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.message
          : "Failed to fetch new users",
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchPropertyViews: async (propertyId, startDate, endDate) => {
    if (!propertyId) return;
    set({ propertyViewsLoading: true, error: "" });
    try {
      const response = await $api.get(
        `${API_URL}/api/stats/property-views/${propertyId}`,
        {
          params: { startDate, endDate },
        },
      );
      set({ propertyViews: response.data });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.message
          : "Failed to fetch property views",
      });
    } finally {
      set({ propertyViewsLoading: false });
    }
  },
}));
