/**
 * Waste Emissions Calculation
 * Pure function to calculate carbon emissions from waste generation
 * 
 * Formula:
 * CO₂e (kg) = Waste Amount (tonnes) × Emission Factor (kg CO₂e / tonne)
 * Adjusted = CO₂e × (1 - Recycling Fraction) (for landfill/incinerator portion)
 * CO₂e (tonnes) = CO₂e (kg) / 1000
 */

/**
 * Calculates annual carbon emissions from waste generation
 * 
 * @param wasteTonnesPerYear - Annual waste generated in tonnes
 *        Must be a non-negative number
 *        1 tonne = 1000 kg
 *        Example: 0.5 (meaning 500 kg per year)
 * 
 * @param emissionFactorKgPerTonne - Emission factor in kg CO₂e per tonne
 *        Must be a non-negative number
 *        Includes landfill decomposition, incinerator emissions, transport
 *        Example: 1300 (kg CO₂e per tonne of mixed waste to landfill)
 * 
 * @param recyclingPercentage - Percentage of waste that is recycled (0-100)
 *        Recycled waste avoids landfill/incineration emissions
 *        Example: 30 (meaning 30% is recycled, 70% to landfill/incinerator)
 * 
 * @returns Annual carbon emissions in tonnes CO₂e
 *         Calculates only the portion of waste that goes to landfill/incinerator
 *         Converts kg result to tonnes (÷ 1000)
 * 
 * @throws Error if inputs are not valid numbers, negative, or recycling > 100
 * 
 * @example
 * // 0.5 tonnes waste/year, 1300 kg CO₂e/tonne, 30% recycled
 * calculateWasteEmissions(0.5, 1300, 30)
 * // Returns: 0.455 (tonnes CO₂e per year: 500 kg × 1300 × 0.7 ÷ 1,000,000)
 */
export function calculateWasteEmissions(
  wasteTonnesPerYear: number,
  emissionFactorKgPerTonne: number,
  recyclingPercentage: number = 0
): number {
  // ========================================================================
  // INPUT VALIDATION
  // ========================================================================
  
  // Ensure waste amount is a valid number
  if (typeof wasteTonnesPerYear !== "number" || isNaN(wasteTonnesPerYear)) {
    throw new Error(
      `Invalid waste amount: expected number, got ${typeof wasteTonnesPerYear}`
    );
  }
  
  // Ensure emission factor is a valid number
  if (typeof emissionFactorKgPerTonne !== "number" || isNaN(emissionFactorKgPerTonne)) {
    throw new Error(
      `Invalid waste emission factor: expected number, got ${typeof emissionFactorKgPerTonne}`
    );
  }
  
  // Ensure recycling percentage is a valid number
  if (typeof recyclingPercentage !== "number" || isNaN(recyclingPercentage)) {
    throw new Error(
      `Invalid recycling percentage: expected number, got ${typeof recyclingPercentage}`
    );
  }
  
  // Prevent negative waste amounts
  if (wasteTonnesPerYear < 0) {
    throw new Error(
      `Waste amount cannot be negative: ${wasteTonnesPerYear}`
    );
  }
  
  // Prevent negative emission factors
  if (emissionFactorKgPerTonne < 0) {
    throw new Error(
      `Waste emission factor cannot be negative: ${emissionFactorKgPerTonne}`
    );
  }
  
  // Prevent recycling percentage outside valid range (0-100)
  if (recyclingPercentage < 0 || recyclingPercentage > 100) {
    throw new Error(
      `Recycling percentage must be between 0 and 100: ${recyclingPercentage}`
    );
  }
  
  // ========================================================================
  // CALCULATION
  // ========================================================================
  
  // Step 1: Convert tonnes to kilograms
  // 1 tonne = 1000 kg
  const wasteKg = wasteTonnesPerYear * 1000;
  
  // Step 2: Calculate portion going to landfill/incinerator
  // If 30% is recycled, 70% goes to landfill/incinerator
  const recyclingFraction = recyclingPercentage / 100;
  const nonRecycledFraction = 1 - recyclingFraction;
  
  // Step 3: Calculate total CO₂e in kilograms for non-recycled portion
  // Formula: kg × (kg CO₂e / tonne) × non-recycled fraction = kg CO₂e
  // Note: emission factor is per tonne, so we need to account for that
  // wasteKg / 1000 gives us tonnes, then × factor × non-recycled fraction
  const emissionsKg = (wasteKg / 1000) * emissionFactorKgPerTonne * nonRecycledFraction;
  
  // Step 4: Convert kilograms to tonnes
  // 1 tonne = 1000 kg
  const emissionsTonnes = emissionsKg / 1000;
  
  // ========================================================================
  // RETURN RESULT
  // ========================================================================
  
  return emissionsTonnes;
}

/**
 * Converts kilograms to tonnes
 * 
 * @param kilograms - Waste amount in kilograms
 * @returns Waste amount in tonnes
 * 
 * @example
 * kilogramsToTonnes(500) // Returns: 0.5
 */
export function kilogramsToTonnes(kilograms: number): number {
  if (typeof kilograms !== "number" || isNaN(kilograms)) {
    throw new Error(`Invalid kilograms: expected number, got ${typeof kilograms}`);
  }
  
  if (kilograms < 0) {
    throw new Error(`Kilograms cannot be negative: ${kilograms}`);
  }
  
  // 1 tonne = 1000 kg
  return kilograms / 1000;
}

/**
 * Converts pounds to tonnes
 * 
 * @param pounds - Waste amount in pounds
 * @returns Waste amount in tonnes
 * 
 * @example
 * poundsToTonnes(1000) // Returns: 0.453592 (approximately)
 */
export function poundsToTonnes(pounds: number): number {
  if (typeof pounds !== "number" || isNaN(pounds)) {
    throw new Error(`Invalid pounds: expected number, got ${typeof pounds}`);
  }
  
  if (pounds < 0) {
    throw new Error(`Pounds cannot be negative: ${pounds}`);
  }
  
  // 1 pound = 0.000453592 tonnes (metric tonnes)
  return pounds * 0.000453592;
}
