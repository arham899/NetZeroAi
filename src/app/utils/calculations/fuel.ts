/**
 * Stationary Fuel Emissions Calculation
 * Pure function to calculate carbon emissions from home heating fuels
 * 
 * Formula:
 * CO₂e (kg) = Fuel Amount (units) × Emission Factor (kg CO₂e / unit)
 * CO₂e (tonnes) = CO₂e (kg) / 1000
 */

/**
 * Calculates annual carbon emissions from stationary fuel consumption
 * 
 * @param annualFuelAmount - Annual fuel consumption in specified units
 *        Must be a non-negative number
 *        Units depend on fuel type (therms, gallons, cubic meters, etc.)
 *        Example: 400 (meaning 400 therms of natural gas per year)
 * 
 * @param emissionFactorKgPerUnit - Emission factor in kg CO₂e per unit of fuel
 *        Must be a non-negative number
 *        Different for each fuel type (natural gas, heating oil, propane)
 *        Example: 5.3 (kg CO₂e per therm of natural gas)
 * 
 * @param fuelType - Description of fuel type for error messages and clarity
 *        Example: "natural gas", "heating oil", "propane"
 * 
 * @returns Annual carbon emissions in tonnes CO₂e
 *         Converts kg result to tonnes (÷ 1000)
 * 
 * @throws Error if inputs are not valid numbers or are negative
 * 
 * @example
 * // Natural gas: 400 therms/year, 5.3 kg CO₂e/therm
 * calculateFuelEmissions(400, 5.3, "natural gas")
 * // Returns: 2.12 (tonnes CO₂e per year)
 * 
 * @example
 * // Heating oil: 500 gallons/year, 10.15 kg CO₂e/gallon
 * calculateFuelEmissions(500, 10.15, "heating oil")
 * // Returns: 5.075 (tonnes CO₂e per year)
 */
export function calculateFuelEmissions(
  annualFuelAmount: number,
  emissionFactorKgPerUnit: number,
  fuelType: string = "fuel"
): number {
  // ========================================================================
  // INPUT VALIDATION
  // ========================================================================
  
  // Ensure fuel amount is a valid number
  if (typeof annualFuelAmount !== "number" || isNaN(annualFuelAmount)) {
    throw new Error(
      `Invalid ${fuelType} amount: expected number, got ${typeof annualFuelAmount}`
    );
  }
  
  // Ensure emission factor is a valid number
  if (typeof emissionFactorKgPerUnit !== "number" || isNaN(emissionFactorKgPerUnit)) {
    throw new Error(
      `Invalid emission factor for ${fuelType}: expected number, got ${typeof emissionFactorKgPerUnit}`
    );
  }
  
  // Prevent negative fuel amounts
  if (annualFuelAmount < 0) {
    throw new Error(
      `Annual ${fuelType} amount cannot be negative: ${annualFuelAmount}`
    );
  }
  
  // Prevent negative emission factors
  if (emissionFactorKgPerUnit < 0) {
    throw new Error(
      `Emission factor for ${fuelType} cannot be negative: ${emissionFactorKgPerUnit}`
    );
  }
  
  // ========================================================================
  // CALCULATION
  // ========================================================================
  
  // Step 1: Calculate total CO₂e in kilograms
  // Formula: amount × (kg CO₂e / unit) = kg CO₂e
  // Units: therms/gallons/cubic meters × kg CO₂e per unit = kg CO₂e
  const emissionsKg = annualFuelAmount * emissionFactorKgPerUnit;
  
  // Step 2: Convert kilograms to tonnes
  // 1 tonne = 1000 kg
  const emissionsTonnes = emissionsKg / 1000;
  
  // ========================================================================
  // RETURN RESULT
  // ========================================================================
  
  return emissionsTonnes;
}
