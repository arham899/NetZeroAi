/**
 * Emissions Result Types
 * Defines the structure of calculated emissions data
 */

// ============================================================================
// DETAILED CATEGORY BREAKDOWN
// ============================================================================

/**
 * Detailed breakdown for each emission category
 * Includes input values, emission factors, formulas, and results
 * Used for transparency and auditability of calculations
 */
export interface CategoryCalculationDetails {
  // Input data used in calculation
  inputValue: string | number; // Raw input from form
  inputUnit: string; // Unit of measurement (kWh, miles, kg, etc.)

  // Calculation methodology
  emissionFactor: number; // Factor used (kg CO₂e/unit or similar)
  emissionFactorUnit: string; // Unit of emission factor

  // Documentation
  formula: string; // Human-readable formula description
  factorDescription: string; // Source/explanation of emission factor

  // Result
  resultingCO2e: number; // Final result in tonnes CO₂e
}

// ============================================================================
// EMISSIONS BREAKDOWN (SIMPLE)
// ============================================================================

export interface EmissionsBreakdown {
  electricity: number;
  fuel: number;
  transport: number;
  waterWaste: number;
  industry: number;
  offsets: number;
}

// ============================================================================
// DETAILED EMISSIONS BREAKDOWN
// ============================================================================

/**
 * Extended breakdown with calculation details for each category
 * Provides full transparency: inputs, factors, formulas, results
 */
export interface DetailedEmissionsBreakdown {
  electricity: CategoryCalculationDetails;
  fuel: CategoryCalculationDetails;
  transport: CategoryCalculationDetails;
  waterWaste: CategoryCalculationDetails;
  industry: CategoryCalculationDetails;
  offsets: CategoryCalculationDetails;
}

// ============================================================================
// EMISSIONS RESULT

// ============================================================================

export interface EmissionsResult {
  // Individual category emissions/offsets breakdown (in tonnes CO₂e)
  breakdown: EmissionsBreakdown;

  // Detailed breakdown with calculation transparency
  // Includes: input values, factors, formulas, results
  detailedBreakdown: DetailedEmissionsBreakdown;

  // Aggregated totals from all emission categories
  // Preserved with full numeric precision (no rounding)
  totalEmissions: number; // tonnes CO₂e from all sources (positive)
  totalOffsets: number; // tonnes CO₂e offset/absorbed (positive)
  netCO2e: number; // Final footprint after offsets (totalEmissions - totalOffsets)

  // Legacy field for backward compatibility
  total: number; // Alias for netCO2e

  // Timestamp when calculation was performed
  calculatedAt: Date;
}
