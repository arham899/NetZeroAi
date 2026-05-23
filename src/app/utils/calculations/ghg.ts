/**
 * Other Greenhouse Gas (GHG) Emissions Calculator
 * Calculates carbon dioxide equivalent emissions from non-CO₂ greenhouse gases
 * 
 * Formula: Gas Mass (kg) × GWP (Global Warming Potential) = CO₂e (kg)
 * 
 * Global Warming Potential (GWP) is a relative measure of how much heat a
 * greenhouse gas traps in the atmosphere over a 100-year time period compared
 * to CO₂ (which has GWP = 1).
 * 
 * Generic function that accepts any GWP value for flexibility across different
 * greenhouse gases (methane, nitrous oxide, refrigerants, etc.)
 */

/**
 * Calculates carbon dioxide equivalent emissions from other greenhouse gases
 * Pure function - deterministic, auditable, no side effects
 * 
 * @param gasMassKg - Annual gas mass in kilograms
 * @param gwp - Global Warming Potential (100-year horizon, CO₂ = 1)
 * @param gasType - Optional: Type of gas for documentation
 * @returns Annual CO₂e emissions in tonnes
 * 
 * @example
 * // Methane: GWP = 28 (over 100 years)
 * // 100 kg of methane released
 * calculateGHGEmissions(100, 28, "CH4")
 * // Returns: 2.8 tonnes CO₂e
 * 
 * @example
 * // Nitrous Oxide: GWP = 265 (over 100 years)
 * // 10 kg of N₂O released
 * calculateGHGEmissions(10, 265, "N2O")
 * // Returns: 2.65 tonnes CO₂e
 */
export function calculateGHGEmissions(
  gasMassKg: number,
  gwp: number,
  gasType?: string
): number {
  // Input validation
  if (typeof gasMassKg !== "number" || typeof gwp !== "number") {
    console.error("Invalid input types for GHG emissions calculation");
    return 0;
  }

  // Reject negative or NaN values
  if (gasMassKg < 0 || gwp < 0 || isNaN(gasMassKg) || isNaN(gwp)) {
    console.error(
      "Gas mass and GWP must be positive numbers (GWP of 0 for CO₂ equivalent)"
    );
    return 0;
  }

  // GWP of 0 means pure CO₂, which would result in 0 additional emissions
  // This is valid but represents zero non-CO₂ greenhouse gas
  if (gwp === 0) {
    return 0;
  }

  // Calculate CO₂e: mass (kg) × GWP (ratio, unitless)
  const co2eKg = gasMassKg * gwp;

  // Convert kg to tonnes CO₂e
  const co2eTonnes = co2eKg / 1000;

  return co2eTonnes;
}

/**
 * Global Warming Potential (GWP) values for common greenhouse gases
 * 100-year time horizon (AR6, IPCC)
 * Source: IPCC Sixth Assessment Report (2021)
 * 
 * Note: GWPs vary based on:
 * - Time horizon (20-year vs 100-year)
 * - Radiative efficiency
 * - Atmospheric lifetime
 * - Climate feedback mechanisms
 * 
 * Using 100-year horizon for long-term climate impact assessment
 */
export const GWP_VALUES = {
  // Natural and common industrial GHGs
  CH4_methane: 28, // Methane (100-year GWP)
  N2O_nitrousoxide: 265, // Nitrous oxide (100-year GWP)
  SF6_sulfurhexafluoride: 23500, // Sulfur hexafluoride (100-year GWP)

  // Hydrofluorocarbons (HFCs) - being phased out by Kigali Amendment
  HFC_134a: 1300, // Common refrigerant
  HFC_125: 2800, // Used in blends
  HFC_143a: 4470, // Used in blends

  // Hydrofluoroolefins (HFOs) - next-gen refrigerants (lower GWP)
  HFO_1234yf: 4, // Low-GWP replacement for HFC-134a
  HFO_1234ze: 6, // Low-GWP blowing agent

  // Perfluorocarbons (PFCs) - extremely high GWP, being phased out
  CF4_carbontetrafluoride: 6630, // Industrial use
  C2F6_hexafluoroethane: 11100, // Semiconductor manufacturing

  // Nitrogen trifluoride and other special industrial gases
  NF3_nitrogentrifluoride: 16100, // Used in semiconductor manufacturing
} as const;

/**
 * Helper: Convert gas mass from tonnes to kilograms for calculation
 * @param tonnes - Mass in metric tonnes
 * @returns Mass in kilograms
 */
export function tonnesToKilograms(tonnes: number): number {
  // 1 tonne = 1000 kg
  return tonnes * 1000;
}

/**
 * Helper: Convert gas mass from pounds to kilograms
 * @param pounds - Mass in pounds (avoirdupois)
 * @returns Mass in kilograms
 */
export function poundsToKilograms(pounds: number): number {
  // 1 pound = 0.453592 kg
  return pounds * 0.453592;
}

/**
 * Helper: Convert gas mass from grams to kilograms
 * @param grams - Mass in grams
 * @returns Mass in kilograms
 */
export function gramsToKilograms(grams: number): number {
  // 1 kg = 1000 grams
  return grams / 1000;
}

/**
 * Calculate CO₂e from multiple GHG emissions and sum
 * Useful for scenarios with mixed gas releases
 * 
 * @param emissions - Array of {mass: number (kg), gwp: number}
 * @returns Total CO₂e in tonnes
 * 
 * @example
 * // Refrigerant leak: 2kg HFC-134a + 0.5kg HFC-125
 * const total = calculateMixedGHGEmissions([
 *   { mass: 2, gwp: GWP_VALUES.HFC_134a },
 *   { mass: 0.5, gwp: GWP_VALUES.HFC_125 }
 * ]);
 * // Returns: 2.2 tonnes CO₂e
 */
export function calculateMixedGHGEmissions(
  emissions: Array<{ mass: number; gwp: number }>
): number {
  if (!Array.isArray(emissions) || emissions.length === 0) {
    return 0;
  }

  let totalCo2eTonnes = 0;

  for (const emission of emissions) {
    if (emission && typeof emission.mass === "number" && typeof emission.gwp === "number") {
      totalCo2eTonnes += calculateGHGEmissions(emission.mass, emission.gwp);
    }
  }

  return totalCo2eTonnes;
}
