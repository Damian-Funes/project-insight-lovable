
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

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

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    immer((set, get) => ({
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
      setSidebarOpen: (open) => set((state) => {
        state.sidebarOpen = open;
      }),
      
      setCurrentRoute: (route) => set((state) => {
        state.currentRoute = route;
      }),
      
      setSelectedProjects: (projects) => set((state) => {
        state.selectedProjects = projects;
      }),
      
      setSelectedAreas: (areas) => set((state) => {
        state.selectedAreas = areas;
      }),
      
      setDateRange: (range) => set((state) => {
        state.dateRange = range;
      }),
      
      setLoading: (key, loading) => set((state) => {
        state.loadingStates[key] = loading;
        state.isLoading = Object.values(state.loadingStates).some(Boolean);
      }),
      
      updateLastDataRefresh: () => set((state) => {
        state.lastDataRefresh = Date.now();
      }),
      
      resetFilters: () => set((state) => {
        state.selectedProjects = [];
        state.selectedAreas = [];
        state.dateRange = { start: null, end: null };
      }),
    }))
  )
);

// Selectors otimizados para evitar re-renders desnecessários
export const useSelectedProjects = () => useAppStore((state) => state.selectedProjects);
export const useSelectedAreas = () => useAppStore((state) => state.selectedAreas);
export const useDateRange = () => useAppStore((state) => state.dateRange);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
