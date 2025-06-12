
import { create } from 'zustand';

export interface AppState {
  // UI State
  sidebarOpen: boolean;
  currentRoute: string;
  
  // Filters State
  selectedProjects: string[];
  selectedAreas: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  
  // Performance State
  isLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Cache State
  lastDataRefresh: number;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setCurrentRoute: (route: string) => void;
  setSelectedProjects: (projects: string[]) => void;
  setSelectedAreas: (areas: string[]) => void;
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  setLoading: (key: string, loading: boolean) => void;
  updateLastDataRefresh: () => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  sidebarOpen: true,
  currentRoute: '/',
  selectedProjects: [],
  selectedAreas: [],
  dateRange: { start: null, end: null },
  isLoading: false,
  loadingStates: {},
  lastDataRefresh: Date.now(),
  
  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setCurrentRoute: (route) => set({ currentRoute: route }),
  
  setSelectedProjects: (projects) => set({ selectedProjects: projects }),
  
  setSelectedAreas: (areas) => set({ selectedAreas: areas }),
  
  setDateRange: (range) => set({ dateRange: range }),
  
  setLoading: (key, loading) => set((state) => {
    const newLoadingStates = { ...state.loadingStates, [key]: loading };
    return {
      loadingStates: newLoadingStates,
      isLoading: Object.values(newLoadingStates).some(Boolean)
    };
  }),
  
  updateLastDataRefresh: () => set({ lastDataRefresh: Date.now() }),
  
  resetFilters: () => set({
    selectedProjects: [],
    selectedAreas: [],
    dateRange: { start: null, end: null }
  }),
}));

// Selectors simples
export const useSelectedProjects = () => useAppStore((state) => state.selectedProjects);
export const useSelectedAreas = () => useAppStore((state) => state.selectedAreas);
export const useDateRange = () => useAppStore((state) => state.dateRange);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
