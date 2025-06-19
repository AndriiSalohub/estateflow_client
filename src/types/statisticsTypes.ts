export interface TotalSalesData {
  totalSales: number;
  totalAmount: string;
}

export interface TopViewedProperty {
  id: string;
  title: string;
  price: string;
  address: string;
  view_count: number;
}

export interface NewUsersData {
  new_buyers: number;
  new_sellers: number;
  new_agencies: number;
}

export interface PropertyViewsData {
  propertyId: string;
  views: number;
}

export interface StatisticsState {
  totalSales: TotalSalesData | null;
  topViewedProperties: TopViewedProperty[];
  newUsers: NewUsersData | null;
  propertyViews: PropertyViewsData | null;
  loading: boolean;
  propertyViewsLoading: boolean;
  error: string;
  setTotalSales: (data: TotalSalesData | null) => void;
  setTopViewedProperties: (data: TopViewedProperty[]) => void;
  setNewUsers: (data: NewUsersData | null) => void;
  setPropertyViews: (data: PropertyViewsData | null) => void;
  setLoading: (loading: boolean) => void;
  setPropertyViewsLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  fetchTotalSales: (startDate: string, endDate: string) => Promise<void>;
  fetchTopViewedProperties: (
    startDate: string,
    endDate: string,
  ) => Promise<void>;
  fetchNewUsers: (startDate: string, endDate: string) => Promise<void>;
  fetchPropertyViews: (
    propertyId: string,
    startDate: string,
    endDate: string,
  ) => Promise<void>;
}
