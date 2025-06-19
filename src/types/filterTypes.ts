export interface FilterState {
  price: [number, number];
  area: [number, number];
  types: string[];
  rooms: number[];
  propertyTypes: string[];
  searchQuery: string;
  sortBy: string;
  isLoading: boolean;
  error: string | null;

  availableTypes: string[];
  availableRooms: number[];
  availablePropertyTypes: string[];

  setPrice: (range: [number, number]) => void;
  setArea: (range: [number, number]) => void;
  toggleType: (type: string) => void;
  toggleRoom: (room: number) => void;
  setSearchQuery: (query: string) => void;
  togglePropertyType: (propertyType: string) => void;
  setSortBy: (sortBy: string) => void;
  resetFilters: () => void;
  fetchFilters: () => Promise<void>;
}
