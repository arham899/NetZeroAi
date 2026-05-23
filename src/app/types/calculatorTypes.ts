/**
 * Calculator Data Types
 * Defines TypeScript interfaces for all calculator steps and aggregated state
 */

// ============================================================================
// LOCATION STEP
// ============================================================================

export interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
}

// ============================================================================
// ELECTRICITY STEP
// ============================================================================

export interface ElectricityData {
  monthlyUsageKwh: string;
  renewablePercentage: string;
}

// ============================================================================
// FUEL STEP
// ============================================================================

export interface FuelData {
  naturalGasThermsPeYear: string;
  heatingOilGallonsPerYear: string;
  propaneGallonsPerYear: string;
}

// ============================================================================
// TRANSPORT STEP
// ============================================================================

export type VehicleType = "sedan" | "suv" | "truck" | "hybrid" | "electric" | "";

export interface Vehicle {
  id: string; // unique ID for React keys
  milesPerYear: string;
  type: VehicleType;
}

export interface TransportData {
  // Legacy/Single vehicle fields
  carMilesDrivenPerYear: string;
  vehicleType: VehicleType;

  // New multi-vehicle fields
  numberOfVehicles: string; // input string
  vehicles: Vehicle[];
  hasExcelUpload: boolean;
  excelUploaded: boolean; // flag to indicate if file processed

  // Standard fields
  flightHoursPerYear: string;
  publicTransitMilesDrivenPerYear: string;
}

// ============================================================================
// WATER & WASTE STEP
// ============================================================================

export interface WaterWasteData {
  waterUsageGallonsPerYear: string;
  wasteGeneratedLbsPerYear: string;
  recyclingPercentage: string;
}

// ============================================================================
// INDUSTRY (CONSUMPTION & DIET) STEP
// ============================================================================

export interface IndustryData {
  shoppingItemsPurchasedPerYear: string;
  meatServingsPerWeek: string;
  dairyServingsPerWeek: string;
}

// ============================================================================
// OFFSETS STEP
// ============================================================================

export interface OffsetsData {
  treesPlanted: string;
  greenEnergyPercentage: string;
  offsetPurchasesDollars: string;
}

// ============================================================================
// ENTITY TYPE STEP
// ============================================================================

export type EntityType = "individual" | "family" | "business" | "company" | "";

// ============================================================================
// AGGREGATED CALCULATOR STATE
// ============================================================================

export interface CalculatorFormData {
  entityType: EntityType;
  location: LocationData;
  electricity: ElectricityData;
  fuel: FuelData;
  transport: TransportData;
  waterWaste: WaterWasteData;
  industry: IndustryData;
  offsets: OffsetsData;
}

// ============================================================================
// DEFAULT/EMPTY STATE
// ============================================================================

export const EMPTY_LOCATION_DATA: LocationData = {
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  coordinates: {
    lat: null,
    lng: null,
  },
};

export const EMPTY_ELECTRICITY_DATA: ElectricityData = {
  monthlyUsageKwh: "",
  renewablePercentage: "",
};

export const EMPTY_FUEL_DATA: FuelData = {
  naturalGasThermsPeYear: "",
  heatingOilGallonsPerYear: "",
  propaneGallonsPerYear: "",
};

export const EMPTY_TRANSPORT_DATA: TransportData = {
  carMilesDrivenPerYear: "",
  vehicleType: "",
  numberOfVehicles: "1",
  vehicles: [], // Initially empty, will populate based on numberOfVehicles
  hasExcelUpload: false,
  excelUploaded: false,
  flightHoursPerYear: "",
  publicTransitMilesDrivenPerYear: "",
};

export const EMPTY_WATER_WASTE_DATA: WaterWasteData = {
  waterUsageGallonsPerYear: "",
  wasteGeneratedLbsPerYear: "",
  recyclingPercentage: "",
};

export const EMPTY_INDUSTRY_DATA: IndustryData = {
  shoppingItemsPurchasedPerYear: "",
  meatServingsPerWeek: "",
  dairyServingsPerWeek: "",
};

export const EMPTY_OFFSETS_DATA: OffsetsData = {
  treesPlanted: "",
  greenEnergyPercentage: "",
  offsetPurchasesDollars: "",
};

export const EMPTY_CALCULATOR_FORM_DATA: CalculatorFormData = {
  entityType: "",
  location: EMPTY_LOCATION_DATA,
  electricity: EMPTY_ELECTRICITY_DATA,
  fuel: EMPTY_FUEL_DATA,
  transport: EMPTY_TRANSPORT_DATA,
  waterWaste: EMPTY_WATER_WASTE_DATA,
  industry: EMPTY_INDUSTRY_DATA,
  offsets: EMPTY_OFFSETS_DATA,
};
// ============================================================================
// HISTORY & TRENDS
// ============================================================================

export interface HistoryEntry {
  id: string;
  date: string; // ISO string
  totalKg: number;
  breakdown: {
    transport: number;
    energy: number;
    consumption: number;
    waste: number;
  };
  isQuick: boolean; // True if from home page quick calculator
  formData?: CalculatorFormData; // Full form data for restoring state
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}
