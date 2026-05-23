/**
 * Industrial Process Emissions Calculator
 * Calculates carbon emissions from industrial production processes
 * 
 * Formula: Industrial Output (tonnes) × Emission Factor (kg CO₂e/tonne) = CO₂e
 * 
 * Generic function that accepts any emission factor for flexibility across
 * different industrial processes (steel, cement, chemicals, etc.)
 */

/**
 * Calculates carbon emissions from industrial production
 * Pure function - deterministic, auditable, no side effects
 * 
 * @param industrialOutputTonnes - Annual industrial output in tonnes
 * @param emissionFactorKgPerTonne - Process-specific emission factor (kg CO₂e per tonne of output)
 * @param processType - Optional: Type of industrial process for documentation
 * @returns Annual CO₂e emissions in tonnes
 * 
 * @example
 * // Steel production: ~2.5 tonnes CO₂e per tonne of steel
 * calculateIndustrialEmissions(100, 2500, "steel")
 * // Returns: 250 tonnes CO₂e
 * 
 * @example
 * // Cement production: ~0.9 tonnes CO₂e per tonne of cement
 * calculateIndustrialEmissions(50, 900, "cement")
 * // Returns: 45 tonnes CO₂e
 */
export function calculateIndustrialEmissions(
  industrialOutputTonnes: number,
  emissionFactorKgPerTonne: number,
  processType?: string
): number {
  // Input validation
  if (
    typeof industrialOutputTonnes !== "number" ||
    typeof emissionFactorKgPerTonne !== "number"
  ) {
    console.error("Invalid input types for industrial emissions calculation");
    return 0;
  }

  // Reject negative or NaN values
  if (
    industrialOutputTonnes < 0 ||
    emissionFactorKgPerTonne < 0 ||
    isNaN(industrialOutputTonnes) ||
    isNaN(emissionFactorKgPerTonne)
  ) {
    console.error(
      "Industrial output and emission factor must be positive numbers"
    );
    return 0;
  }

  // Calculate emissions: output (tonnes) × factor (kg/tonne) = kg CO₂e
  const emissionsKg = industrialOutputTonnes * emissionFactorKgPerTonne;

  // Convert kg to tonnes CO₂e
  const emissionsTonnes = emissionsKg / 1000;

  return emissionsTonnes;
}

/**
 * Common industrial process emission factors (kg CO₂e per tonne output)
 * Source: IPCC AR6, EPA, Ecoinvent database
 * 
 * Note: These are typical values; actual factors vary by:
 * - Technology efficiency
 * - Energy source (grid mix, renewable, etc.)
 * - Regional variations
 * - Process-specific improvements
 */
export const INDUSTRIAL_EMISSION_FACTORS = {
  steel: 2500, // kg CO₂e/tonne steel (integrated plant, blast furnace)
  cement: 900, // kg CO₂e/tonne cement (includes calcination)
  aluminum: 12000, // kg CO₂e/tonne aluminum (primary production, smelting)
  chemicals: 1500, // kg CO₂e/tonne chemicals (average across processes)
  plastics: 3000, // kg CO₂e/tonne plastic resin (virgin plastic)
  paper: 1200, // kg CO₂e/tonne paper (kraft pulping)
  glass: 800, // kg CO₂e/tonne glass (container glass)
  textiles: 6000, // kg CO₂e/tonne synthetic textiles
  food_processing: 300, // kg CO₂e/tonne food products (average)
} as const;

/**
 * Helper: Convert industrial output from pounds to tonnes
 * @param pounds - Mass in pounds
 * @returns Mass in tonnes (metric tons)
 */
export function poundsToTonnes(pounds: number): number {
  // 1 tonne = 2204.62 pounds
  return pounds / 2204.62;
}

/**
 * Helper: Convert industrial output from kilograms to tonnes
 * @param kilograms - Mass in kilograms
 * @returns Mass in tonnes
 */
export function kilogramsToTonnes(kilograms: number): number {
  // 1 tonne = 1000 kg
  return kilograms / 1000;
}

/**
 * Helper: Convert industrial output from short tons (US tons) to metric tonnes
 * @param shortTons - Mass in short tons (US tons)
 * @returns Mass in metric tonnes
 */
export function shortTonnsToMetricTonnes(shortTons: number): number {
  // 1 short ton = 0.907185 metric tonnes
  return shortTons * 0.907185;
}
