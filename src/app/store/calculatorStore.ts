/**
 * Calculator Store
 * Centralized state management using React Context API
 * Holds all calculator form data and provides update functions
 */

import { createContext, useContext } from "react";
import {
  CalculatorFormData,
  LocationData,
  ElectricityData,
  FuelData,
  TransportData,
  WaterWasteData,
  IndustryData,
  OffsetsData,
  HistoryEntry,
  EntityType,
} from "../types/calculatorTypes";

// ============================================================================
// CONTEXT TYPE DEFINITION
// ============================================================================

export interface CalculatorContextType {
  formData: CalculatorFormData;
  history: HistoryEntry[];
  selectedHistoryId: string | null; // Currently selected history entry
  updateEntityType: (entityType: EntityType) => void;
  updateLocation: (data: Partial<LocationData>) => void;
  updateElectricity: (data: Partial<ElectricityData>) => void;
  updateFuel: (data: Partial<FuelData>) => void;
  updateTransport: (data: Partial<TransportData>) => void;
  updateWaterWaste: (data: Partial<WaterWasteData>) => void;
  updateIndustry: (data: Partial<IndustryData>) => void;
  updateOffsets: (data: Partial<OffsetsData>) => void;
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'date'>) => void;
  clearHistory: () => void;
  resetFormData: () => void;
  loadHistoryEntry: (entryId: string) => void; // Load a specific history entry
  clearSelectedHistory: () => void; // Clear selection and reset to current data
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

export const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

// ============================================================================
// CUSTOM HOOK TO USE CONTEXT
// ============================================================================

export const useCalculator = (): CalculatorContextType => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error(
      "useCalculator must be used within a CalculatorProvider"
    );
  }
  return context;
};
