/**
 * Water Emissions Calculation
 * Pure function to calculate carbon emissions from water usage
 * 
 * Formula:
 * CO₂e (kg) = Water Volume (m³) × Emission Factor (kg CO₂e / m³)
 * CO₂e (tonnes) = CO₂e (kg) / 1000
 */

/**
 * Calculates annual carbon emissions from water consumption
 * 
 * @param volumeCubicMetersPerYear - Annual water usage in cubic meters
 *        Must be a non-negative number
 *        1 cubic meter = 1000 liters
 *        Example: 150 (meaning 150 m³ per year)
 * 
 * @param emissionFactorKgPerCubicMeter - Emission factor in kg CO₂e per m³
 *        Must be a non-negative number
 *        Includes water treatment, heating, distribution emissions
 *        Example: 0.344 (kg CO₂e per m³, US average)
 * 
 * @returns Annual carbon emissions in tonnes CO₂e
 *         Converts kg result to tonnes (÷ 1000)
 * 
 * @throws Error if inputs are not valid numbers or are negative
 * 
 * @example
 * // US user: 150 m³/year, 0.344 kg CO₂e/m³
 * calculateWaterEmissions(150, 0.344)
 * // Returns: 0.0516 (tonnes CO₂e per year)
 */
export function calculateWaterEmissions(
  volumeCubicMetersPerYear: number,
  emissionFactorKgPerCubicMeter: number
): number {
  // ========================================================================
  // INPUT VALIDATION
  // ========================================================================
  
  // Ensure volume is a valid number
  if (typeof volumeCubicMetersPerYear !== "number" || isNaN(volumeCubicMetersPerYear)) {
    throw new Error(
      `Invalid water volume: expected number, got ${typeof volumeCubicMetersPerYear}`
    );
  }
  
  // Ensure emission factor is a valid number
  if (typeof emissionFactorKgPerCubicMeter !== "number" || isNaN(emissionFactorKgPerCubicMeter)) {
    throw new Error(
      `Invalid water emission factor: expected number, got ${typeof emissionFactorKgPerCubicMeter}`
    );
  }
  
  // Prevent negative water volumes
  if (volumeCubicMetersPerYear < 0) {
    throw new Error(
      `Water volume cannot be negative: ${volumeCubicMetersPerYear}`
    );
  }
  
  // Prevent negative emission factors
  if (emissionFactorKgPerCubicMeter < 0) {
    throw new Error(
      `Water emission factor cannot be negative: ${emissionFactorKgPerCubicMeter}`
    );
  }
  
  // ========================================================================
  // CALCULATION
  // ========================================================================
  
  // Step 1: Calculate total CO₂e in kilograms
  // Formula: m³ × (kg CO₂e / m³) = kg CO₂e
  // Includes water treatment, heating, and distribution emissions
  const emissionsKg = volumeCubicMetersPerYear * emissionFactorKgPerCubicMeter;
  
  // Step 2: Convert kilograms to tonnes
  // 1 tonne = 1000 kg
  const emissionsTonnes = emissionsKg / 1000;
  
  // ========================================================================
  // RETURN RESULT
  // ========================================================================
  
  return emissionsTonnes;
}

/**
 * Converts gallons to cubic meters
 * 
 * @param gallons - Water volume in US gallons
 * @returns Volume in cubic meters
 * 
 * @example
 * gallonsToCubicMeters(1000) // Returns: 3.78541 (approximately)
 */
export function gallonsToCubicMeters(gallons: number): number {
  if (typeof gallons !== "number" || isNaN(gallons)) {
    throw new Error(`Invalid gallons: expected number, got ${typeof gallons}`);
  }
  
  if (gallons < 0) {
    throw new Error(`Gallons cannot be negative: ${gallons}`);
  }
  
  // 1 cubic meter = 264.172 gallons, so 1 gallon = 0.00378541 m³
  return gallons * 0.00378541;
}

/**
 * Converts liters to cubic meters
 * 
 * @param liters - Water volume in liters
 * @returns Volume in cubic meters
 * 
 * @example
 * litersToCubicMeters(1000) // Returns: 1
 */
export function litersToCubicMeters(liters: number): number {
  if (typeof liters !== "number" || isNaN(liters)) {
    throw new Error(`Invalid liters: expected number, got ${typeof liters}`);
  }
  
  if (liters < 0) {
    throw new Error(`Liters cannot be negative: ${liters}`);
  }
  
  // 1 cubic meter = 1000 liters
  return liters / 1000;
}
