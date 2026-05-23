/**
 * Calculator Provider Component
 * Wraps the calculator wizard and provides centralized state to all child components
 */

import { ReactNode, useState, useEffect, useRef } from "react";
import {
  CalculatorContext,
  CalculatorContextType,
} from "./calculatorStore";
import {
  CalculatorFormData,
  LocationData,
  ElectricityData,
  FuelData,
  TransportData,
  WaterWasteData,
  IndustryData,
  OffsetsData,
  EMPTY_CALCULATOR_FORM_DATA,
  HistoryEntry,
  EntityType,
} from "../types/calculatorTypes";
import { apiService } from "../services/apiService";
import { useAuth } from "./AuthContext";

interface CalculatorProviderProps {
  children: ReactNode;
}

export function CalculatorProvider({ children }: CalculatorProviderProps) {
  const { isAuthenticated } = useAuth();

  // Initialize form data from sessionStorage (persists during session, clears on browser close)
  const [formData, setFormData] = useState<CalculatorFormData>(() => {
    const saved = sessionStorage.getItem("calculator_form_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return EMPTY_CALCULATOR_FORM_DATA;
      }
    }
    return EMPTY_CALCULATOR_FORM_DATA;
  });

  /* 
    INITIALIZE HISTORY STATE
    Load from localStorage immediately to avoid empty state flash.
    This serves as the "Guest Mode" storage and "Offline Cache" for logged-in users.
  */
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem("calculator_history");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to parse local history during init", err);
      return [];
    }
  });

  // Track previous auth state to detect logout
  const prevAuthRef = useRef(isAuthenticated);

  // LOGOUT HANDLER: Detect transition from Authenticated -> Guest
  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      // User just logged out, reset current form data
      setFormData(EMPTY_CALCULATOR_FORM_DATA);
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("calculator_form_data", JSON.stringify(formData));
  }, [formData]);

  /*
    AUTO-PERSIST HISTORY
    Whenever history state changes, mirror it to localStorage.
    This ensures we never lose data, whether added individually or fetched from backend.
  */
  useEffect(() => {
    localStorage.setItem("calculator_history", JSON.stringify(history));
  }, [history]);

  // 2. Sync History from Backend whenever Auth state changes
  useEffect(() => {
    const syncHistory = async () => {
      // If we are NOT authenticated, we rely on the state we already loaded from localStorage (in useState).
      if (isAuthenticated) {
        try {
          const backendHistory = await apiService.getHistory();
          setHistory(backendHistory);
        } catch (err) {
          console.warn("Backend sync failed, using local fallback.", err);
        }
      }
    };

    syncHistory();
  }, [isAuthenticated]);

  // ========================================================================
  // HISTORY FUNCTIONS
  // ========================================================================

  const addToHistory = async (entry: Omit<HistoryEntry, 'id' | 'date'>) => {
    // Generate IDs (Use Date + Random fallback for max compatibility)
    const tempId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const tempDate = new Date().toISOString();
    const optimisticEntry: HistoryEntry = { ...entry, id: tempId, date: tempDate };

    // 1. UPDATE STATE IMMEDIATELY - This triggers localStorage update via useEffect
    setHistory((prev) => [optimisticEntry, ...prev]);

    // 2. IF AUTHENTICATED, SYNC TO BACKEND
    if (isAuthenticated) {
      try {
        const savedEntry = await apiService.addCalculation(entry);
        // Replace optimistic entry with real backend entry (valid ID)
        setHistory((prev) => prev.map(e => e.id === tempId ? savedEntry : e));
      } catch (err) {
        console.error("Failed to save to backend, keeping local copy.", err);
        // No rollback needed, we keep the local version.
      }
    }
  };

  const clearHistory = async () => {
    // Optimistic Update
    const oldHistory = [...history];
    setHistory([]);

    try {
      await apiService.clearHistory();
      localStorage.removeItem("calculator_history");
    } catch (err) {
      console.error("Failed to clear backend history", err);
      setHistory(oldHistory); // Rollback
      alert("Failed to clear history on server. Please try again.");
    }
  };

  // ========================================================================
  // UPDATE FUNCTIONS - One per category
  // ========================================================================

  const updateEntityType = (entityType: EntityType) => {
    setFormData((prev) => ({
      ...prev,
      entityType,
    }));
  };

  const updateLocation = (data: Partial<LocationData>) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, ...data },
    }));
  };

  const updateElectricity = (data: Partial<ElectricityData>) => {
    setFormData((prev) => ({
      ...prev,
      electricity: { ...prev.electricity, ...data },
    }));
  };

  const updateFuel = (data: Partial<FuelData>) => {
    setFormData((prev) => ({
      ...prev,
      fuel: { ...prev.fuel, ...data },
    }));
  };

  const updateTransport = (data: Partial<TransportData>) => {
    setFormData((prev) => ({
      ...prev,
      transport: { ...prev.transport, ...data },
    }));
  };

  const updateWaterWaste = (data: Partial<WaterWasteData>) => {
    setFormData((prev) => ({
      ...prev,
      waterWaste: { ...prev.waterWaste, ...data },
    }));
  };

  const updateIndustry = (data: Partial<IndustryData>) => {
    setFormData((prev) => ({
      ...prev,
      industry: { ...prev.industry, ...data },
    }));
  };

  const updateOffsets = (data: Partial<OffsetsData>) => {
    setFormData((prev) => ({
      ...prev,
      offsets: { ...prev.offsets, ...data },
    }));
  };

  // ========================================================================
  // RESET FUNCTION
  // ========================================================================

  const resetFormData = () => {
    setFormData(EMPTY_CALCULATOR_FORM_DATA);
    setSelectedHistoryId(null);
  };

  // ========================================================================
  // HISTORY SELECTION FUNCTIONS
  // ========================================================================

  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const loadHistoryEntry = (entryId: string) => {
    const entry = history.find(h => h.id === entryId);
    if (entry) {
      setSelectedHistoryId(entryId);
      // If the entry has formData, restore it
      if (entry.formData) {
        setFormData(entry.formData);
      }
    }
  };

  const clearSelectedHistory = () => {
    setSelectedHistoryId(null);
    // Don't reset form data - just clear the selection
  };

  // ========================================================================
  // CONTEXT VALUE
  // ========================================================================

  const value: CalculatorContextType = {
    formData,
    history,
    selectedHistoryId,
    updateEntityType,
    updateLocation,
    updateElectricity,
    updateFuel,
    updateTransport,
    updateWaterWaste,
    updateIndustry,
    updateOffsets,
    addToHistory,
    clearHistory,
    resetFormData,
    loadHistoryEntry,
    clearSelectedHistory,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}
