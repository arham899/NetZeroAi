/**
 * Electricity Emissions Calculation
 * Pure function to calculate carbon emissions from electricity usage
 * 
 * Formula:
 * CO₂e (kg) = Electricity (kWh) × Emission Factor (kg CO₂e / kWh)
 * CO₂e (tonnes) = CO₂e (kg) / 1000
 */

/**
 * Calculates annual carbon emissions from electricity consumption
 * 
 * @param monthlyUsageKwh - Monthly electricity usage in kilowatt-hours
 *        Must be a non-negative number
 *        Example: 500 (meaning 500 kWh per month)
 * 
 * @param emissionFactorKgPerKwh - Grid emission factor in kg CO₂e per kWh
 *        Must be a non-negative number
 *        Represents the carbon intensity of the electricity grid
 *        Example: 0.385 (US national average, varies by region)
 * 
 * @returns Annual carbon emissions in tonnes CO₂e
 *         Automatically annualizes monthly usage (monthly × 12 ÷ 1000)
 * 
 * @throws Error if inputs are not valid numbers or are negative
 * 
 * @example
 * // US user: 500 kWh/month, grid factor 0.385 kg CO₂e/kWh
 * calculateElectricityEmissions(500, 0.385)
 * // Returns: 2.31 (tonnes CO₂e per year)
 */
export function calculateElectricityEmissions(
  monthlyUsageKwh: number,
  emissionFactorKgPerKwh: number
): number {
  // ========================================================================
  // INPUT VALIDATION
  // ========================================================================
  
  // Ensure both inputs are valid numbers
  if (typeof monthlyUsageKwh !== "number" || isNaN(monthlyUsageKwh)) {
    throw new Error(
      `Invalid monthly usage: expected number, got ${typeof monthlyUsageKwh}`
    );
  }
  
  if (typeof emissionFactorKgPerKwh !== "number" || isNaN(emissionFactorKgPerKwh)) {
    throw new Error(
      `Invalid emission factor: expected number, got ${typeof emissionFactorKgPerKwh}`
    );
  }
  
  // Prevent negative or zero usage (cannot have negative electricity)
  if (monthlyUsageKwh < 0) {
    throw new Error(`Monthly usage cannot be negative: ${monthlyUsageKwh}`);
  }
  
  // Prevent negative emission factors (physical impossibility)
  if (emissionFactorKgPerKwh < 0) {
    throw new Error(`Emission factor cannot be negative: ${emissionFactorKgPerKwh}`);
  }
  
  // ========================================================================
  // CALCULATION
  // ========================================================================
  
  // Step 1: Annualize monthly usage (multiply by 12 months)
  const annualUsageKwh = monthlyUsageKwh * 12;
  
  // Step 2: Calculate total CO₂e in kilograms
  // Formula: kWh × (kg CO₂e / kWh) = kg CO₂e
  // Units cancel to leave only kg CO₂e
  const emissionsKg = annualUsageKwh * emissionFactorKgPerKwh;
  
  // Step 3: Convert kilograms to tonnes
  // 1 tonne = 1000 kg
  const emissionsTonnes = emissionsKg / 1000;
  
  // ========================================================================
  // RETURN RESULT
  // ========================================================================
  
  return emissionsTonnes;
}
