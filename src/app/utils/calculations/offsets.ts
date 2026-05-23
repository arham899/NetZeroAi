/**
 * Carbon Offsets & Absorption Calculator
 * Calculates carbon dioxide reductions from environmental offset activities
 * 
 * Formula 1 (Tree-based): Number of Trees × Sequestration Factor (kg CO₂e/year/tree) = CO₂e offset
 * Formula 2 (Credit-based): Number of Credits × 1 tonne per credit = CO₂e offset
 * 
 * All results returned as NEGATIVE tonnes CO₂e to be subtracted from total emissions
 * Generic functions accept any sequestration factor or credit type for flexibility
 */

/**
 * Calculates carbon dioxide offset from tree planting and growth
 * Pure function - deterministic, auditable, no side effects
 * 
 * Trees sequester CO₂ through photosynthesis over their lifetime.
 * Returns negative value to subtract from total carbon footprint.
 * 
 * @param numTrees - Number of trees planted/maintained
 * @param sequestrationFactorKgPerYear - Annual CO₂e sequestration per tree (kg CO₂e/year)
 * @param treeType - Optional: Type of tree for documentation
 * @returns Annual CO₂e offset in tonnes (NEGATIVE value)
 * 
 * @example
 * // Oak tree: ~25 kg CO₂e sequestered per year
 * calculateTreeAbsorption(10, 25, "oak")
 * // Returns: -0.25 tonnes CO₂e (10 trees × 25 kg ÷ 1000)
 * 
 * @example
 * // Mixed deciduous: ~20 kg CO₂e sequestered per year
 * calculateTreeAbsorption(100, 20, "deciduous")
 * // Returns: -2.0 tonnes CO₂e (100 trees × 20 kg ÷ 1000)
 */
export function calculateTreeAbsorption(
  numTrees: number,
  sequestrationFactorKgPerYear: number
): number {
  // Input validation
  if (typeof numTrees !== "number" || typeof sequestrationFactorKgPerYear !== "number") {
    console.error("Invalid input types for tree absorption calculation");
    return 0;
  }

  // Reject negative or NaN values
  if (numTrees < 0 || sequestrationFactorKgPerYear < 0 || isNaN(numTrees) || isNaN(sequestrationFactorKgPerYear)) {
    console.error("Number of trees and sequestration factor must be non-negative numbers");
    return 0;
  }

  // Zero trees or zero sequestration = no offset
  if (numTrees === 0 || sequestrationFactorKgPerYear === 0) {
    return 0;
  }

  // Calculate annual offset: trees × sequestration factor (kg) = kg CO₂e
  const offsetKg = numTrees * sequestrationFactorKgPerYear;

  // Convert kg to tonnes CO₂e and return as negative (offset reduces net emissions)
  const offsetTonnes = offsetKg / 1000;
  return -offsetTonnes;
}

/**
 * Calculates carbon dioxide offset from carbon credit purchases
 * Pure function - deterministic, auditable, no side effects
 * 
 * Carbon credits represent verified emission reductions or removals from projects
 * (renewable energy, reforestation, methane capture, etc.).
 * One credit typically = one tonne of CO₂e equivalent.
 * Returns negative value to subtract from total carbon footprint.
 * 
 * @param numCredits - Number of carbon credits purchased/retired
 * @param tonnesPerCredit - Tonnes CO₂e equivalent per credit (typically 1.0)
 * @param creditType - Optional: Type of offset credit for documentation
 * @returns Total CO₂e offset in tonnes (NEGATIVE value)
 * 
 * @example
 * // Standard carbon credits: 1 tonne per credit
 * calculateCreditOffset(50, 1.0, "renewable-energy")
 * // Returns: -50 tonnes CO₂e (50 credits × 1 tonne)
 * 
 * @example
 * // Fractional credits from specific project
 * calculateCreditOffset(100, 0.9, "methane-capture")
 * // Returns: -90 tonnes CO₂e (100 credits × 0.9 tonne)
 */
export function calculateCreditOffset(
  numCredits: number,
  tonnesPerCredit: number
): number {
  // Input validation
  if (typeof numCredits !== "number" || typeof tonnesPerCredit !== "number") {
    console.error("Invalid input types for credit offset calculation");
    return 0;
  }

  // Reject negative or NaN values
  if (numCredits < 0 || tonnesPerCredit < 0 || isNaN(numCredits) || isNaN(tonnesPerCredit)) {
    console.error("Number of credits and tonnes per credit must be non-negative numbers");
    return 0;
  }

  // Zero credits or zero value = no offset
  if (numCredits === 0 || tonnesPerCredit === 0) {
    return 0;
  }

  // Calculate total offset: credits × tonnes per credit = tonnes CO₂e
  const offsetTonnes = numCredits * tonnesPerCredit;

  // Return as negative value (offset reduces net emissions)
  return -offsetTonnes;
}

/**
 * Calculates combined carbon offset from multiple tree types
 * Useful for mixed forest or agroforestry scenarios
 * 
 * @param trees - Array of {count: number, sequestrationFactor: number (kg/year)}
 * @returns Total CO₂e offset in tonnes (NEGATIVE value)
 * 
 * @example
 * // Mixed forest: 50 oak trees + 30 pine trees
 * const total = calculateMixedTreeAbsorption([
 *   { count: 50, sequestrationFactor: 25 },  // oak: 25 kg/year
 *   { count: 30, sequestrationFactor: 18 }   // pine: 18 kg/year
 * ]);
 * // Returns: -2.29 tonnes CO₂e
 */
export function calculateMixedTreeAbsorption(
  trees: Array<{ count: number; sequestrationFactor: number }>
): number {
  if (!Array.isArray(trees) || trees.length === 0) {
    return 0;
  }

  let totalOffsetTonnes = 0;

  for (const tree of trees) {
    if (tree && typeof tree.count === "number" && typeof tree.sequestrationFactor === "number") {
      totalOffsetTonnes += calculateTreeAbsorption(tree.count, tree.sequestrationFactor);
    }
  }

  return totalOffsetTonnes;
}

/**
 * Calculates combined carbon offset from multiple credit types
 * Useful for mixed offset portfolios
 * 
 * @param credits - Array of {count: number, tonnesPerCredit: number}
 * @returns Total CO₂e offset in tonnes (NEGATIVE value)
 * 
 * @example
 * // Mixed offset portfolio: 100 renewable energy + 50 forest conservation credits
 * const total = calculateMixedCreditOffset([
 *   { count: 100, tonnesPerCredit: 1.0 },   // renewable: 1 tonne/credit
 *   { count: 50, tonnesPerCredit: 1.2 }     // forest conservation: 1.2 tonnes/credit
 * ]);
 * // Returns: -160 tonnes CO₂e
 */
export function calculateMixedCreditOffset(
  credits: Array<{ count: number; tonnesPerCredit: number }>
): number {
  if (!Array.isArray(credits) || credits.length === 0) {
    return 0;
  }

  let totalOffsetTonnes = 0;

  for (const credit of credits) {
    if (credit && typeof credit.count === "number" && typeof credit.tonnesPerCredit === "number") {
      totalOffsetTonnes += calculateCreditOffset(credit.count, credit.tonnesPerCredit);
    }
  }

  return totalOffsetTonnes;
}

/**
 * Tree sequestration rates by species (kg CO₂e per year)
 * Average annual net sequestration over tree lifetime
 * 
 * Factors from: USDA Forest Service, Arbor Day Foundation, EPA Carbon Management
 * Note: Actual sequestration varies by:
 * - Tree age (fastest growth: years 5-30)
 * - Geographic location (climate, soil, precipitation)
 * - Tree health and maintenance
 * - Hardwood vs softwood classification
 * - Whether tree is harvested (affects net sequestration)
 * 
 * Values shown are conservative estimates for mature trees
 */
export const TREE_SEQUESTRATION_FACTORS = {
  // Deciduous trees (broad-leaved, typically faster growing)
  oak: 25, // kg CO₂e/year (red oak, white oak, etc.)
  maple: 20, // kg CO₂e/year (sugar maple, red maple)
  elm: 22, // kg CO₂e/year (American elm)
  ash: 23, // kg CO₂e/year (white ash, green ash)
  birch: 18, // kg CO₂e/year (paper birch, yellow birch)
  willow: 28, // kg CO₂e/year (fast-growing, water-loving)
  poplar: 30, // kg CO₂e/year (fast-growing pioneer species)
  walnut: 21, // kg CO₂e/year (black walnut, butternut)

  // Coniferous trees (evergreens, needle-leaved)
  pine: 18, // kg CO₂e/year (white pine, loblolly pine, ponderosa)
  spruce: 16, // kg CO₂e/year (black spruce, Norway spruce)
  fir: 17, // kg CO₂e/year (Douglas fir, balsam fir)
  hemlock: 15, // kg CO₂e/year (eastern, western hemlock)
  cedar: 14, // kg CO₂e/year (eastern red cedar, western redcedar)
  larch: 22, // kg CO₂e/year (tamarack, European larch)

  // Tropical/subtropical trees (high-growth regions)
  teak: 35, // kg CO₂e/year (tropical hardwood, fast-growing)
  mahogany: 28, // kg CO₂e/year (tropical hardwood)
  palm: 20, // kg CO₂e/year (coconut, oil palm, etc.)
  bamboo: 50, // kg CO₂e/year (technically a grass, very fast-growing)

  generic: 1.0, // 1 credit = 1 tonne CO₂e
  deciduous_average: 25, // kg CO₂e/year (updated to realistic mature average)
  coniferous_average: 18, // kg CO₂e/year (mixed softwoods)
  mixed_forest: 25, // kg CO₂e/year (Optimistic average for mature trees)
  native_species: 20, // kg CO₂e/year (region-native average)
} as const;

/**
 * Carbon credit types and their typical values
 * Different offset projects generate credits with varying impact
 * 
 * Standard: 1 credit = 1 tonne CO₂e equivalent
 * But some credits may have multipliers based on additionality, permanence, or co-benefits
 * 
 * Source: Voluntary Carbon Markets, Gold Standard, Verified Carbon Standard (VCS)
 */
export const CARBON_CREDIT_TYPES = {
  // Renewable energy projects (1:1 ratio)
  renewable_energy: 1.0, // 1 credit = 1 tonne CO₂e avoided

  // Forest conservation (baseline additionality variations)
  forest_conservation: 1.2, // 1.2 tonnes CO₂e per credit (co-benefits premium)
  reforestation: 1.1, // 1.1 tonnes CO₂e per credit (permanence discount)

  // Methane capture and other industrial
  methane_capture: 1.0, // 1 credit = 1 tonne CO₂e
  coal_mine_methane: 1.0, // Direct equivalence
  landfill_gas: 0.95, // Slight uncertainty discount

  // Cookstove and household energy
  improved_cookstoves: 0.8, // Conservative estimate of actual impact

  // Agricultural soil carbon
  soil_carbon: 0.9, // 0.9 tonnes CO₂e per credit (verification challenges)

  // Energy efficiency programs
  energy_efficiency: 1.05, // 1.05 tonnes CO₂e per credit (co-benefits included)

  // Direct air capture (emerging technology)
  direct_air_capture: 1.0, // 1 tonne CO₂e removed from atmosphere

  // Verified standard generic (when type unknown)
  generic: 1.0, // 1 credit = 1 tonne CO₂e
} as const;

/**
 * Helper: Convert dollar amount to carbon credits
 * Useful for calculating offset from carbon offset service purchases
 * 
 * @param dollarAmount - Amount spent on carbon offsets
 * @param pricePerTonne - Price per tonne CO₂e (typical: $10-$30)
 * @returns Equivalent carbon credits (tonnes)
 * 
 * @example
 * // Offset service costs $20 per tonne
 * dollarToCarbonCredit(500, 20)
 * // Returns: 25 (credits/tonnes)
 */
export function dollarToCarbonCredit(dollarAmount: number, pricePerTonne: number): number {
  if (pricePerTonne <= 0) {
    console.error("Price per tonne must be positive");
    return 0;
  }
  return dollarAmount / pricePerTonne;
}

/**
 * Helper: Convert carbon credit equivalence from one type to another
 * @param numCredits - Number of credits to convert
 * @param fromType - Source credit type
 * @param toType - Target credit type
 * @returns Equivalent credits in target type
 * 
 * @example
 * // Convert 100 renewable energy credits to forest conservation equivalent
 * convertCreditType(100, "renewable_energy", "forest_conservation")
 * // Returns: 83.33 (100 × 1.0 ÷ 1.2)
 */
export function convertCreditType(
  numCredits: number,
  fromType: keyof typeof CARBON_CREDIT_TYPES,
  toType: keyof typeof CARBON_CREDIT_TYPES
): number {
  const fromValue = CARBON_CREDIT_TYPES[fromType] ?? 1.0;
  const toValue = CARBON_CREDIT_TYPES[toType] ?? 1.0;
  return (numCredits * fromValue) / toValue;
}
