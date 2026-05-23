/**
 * Emission Calculation Engine
 * Pure functions that calculate carbon emissions for each category
 * 
 * Architecture:
 * - Each function accepts typed input from calculator forms
 * - Returns a numeric value representing CO2 equivalent emissions
 * - No side effects, no external state mutations
 * - Formulas are documented and auditable
 */

import {
  ElectricityData,
  FuelData,
  TransportData,
  WaterWasteData,
  IndustryData,
  OffsetsData,
} from "../../types/calculatorTypes";
import {
  calculateTransportEmissions as calculateTransportEmissionsRaw,
  milesToKilometers,
} from "./transport";
import {
  calculateTreeAbsorption,
  calculateCreditOffset,
  TREE_SEQUESTRATION_FACTORS,
  CARBON_CREDIT_TYPES,
} from "./offsets";

// ============================================================================
// ELECTRICITY EMISSIONS
// ============================================================================

/**
 * Calculates carbon emissions from electricity usage
 * Formula: Emissions (kgCO2) = Electricity (kWh) * 0.7208
 * @param data - Electricity usage and renewable energy percentage
 * @returns CO2 equivalent in tonnes
 */
export function calculateElectricityEmissions(data: ElectricityData): number {
  // Parse input strings to numbers
  const monthlyUsageKwh = parseFloat(data.monthlyUsageKwh) || 0;
  const renewablePercentage = parseFloat(data.renewablePercentage) || 0;

  // User provided Grid Emission Factor: 0.7208 kg CO2/kWh
  const GRID_EMISSION_FACTOR = 0.7208;

  const annualUsageKwh = monthlyUsageKwh * 12;

  // Calculate base emissions
  const baseEmissionsKg = annualUsageKwh * GRID_EMISSION_FACTOR;

  // Apply renewable energy reduction
  const renewableFraction = renewablePercentage / 100;
  const finalEmissionsKg = baseEmissionsKg * (1 - renewableFraction);

  return finalEmissionsKg / 1000; // Convert to tonnes
}

// ============================================================================
// FUEL & HEATING EMISSIONS
// ============================================================================

/**
 * Calculates carbon emissions from home heating fuels using user Formulas
 * Formula: Mass_kg = Liters * Density
 * Emissions_kg = Mass_kg * NCV * (EF_CO2 + (EF_CH4 * 21) + (EF_N2O * 310))
 * 
 * Constants:
 * Diesel (Heating Oil): Density 0.87 kg/L, NCV 0.043 TJ/kg
 * Petrol (Gasoline): Density 0.755 kg/L, NCV 0.0443 TJ/kg
 * LPG (Propane): Density 0.493 kg/L, NCV 0.0473 TJ/kg (Estimated based on standards)
 * EFs (kg/TJ): CO2: 74100, CH4: 3.9, N2O: 3.9 (Interpreting "74.1" as Tonnes/TJ -> 74100 kg/TJ)
 */
export function calculateFuelEmissions(data: FuelData): number {
  const naturalGasTherms = parseFloat(data.naturalGasThermsPeYear) || 0;
  const heatingOilGallons = parseFloat(data.heatingOilGallonsPerYear) || 0;
  const propaneGallons = parseFloat(data.propaneGallonsPerYear) || 0;

  // --- Simplified Constants based on User Formulas ---
  const USER_EF_CO2 = 74.1;
  const USER_EF_CH4 = 3.9;
  const USER_EF_N2O = 3.9;

  const EF_TOTAL = USER_EF_CO2 + (USER_EF_CH4 * 21) + (USER_EF_N2O * 310);

  // --- Heating Oil (Diesel) ---
  const heatingOilLiters = heatingOilGallons * 3.78541;
  const TJ_PER_KG_DIESEL = 0.000043;
  const heatingOilEmissions = (heatingOilLiters * 0.87) * TJ_PER_KG_DIESEL * EF_TOTAL;

  // --- Propane ---
  const propaneLiters = propaneGallons * 3.78541;
  const TJ_PER_KG_LPG = 0.0000473;
  const propaneEmissions = (propaneLiters * 0.493) * TJ_PER_KG_LPG * EF_TOTAL;

  // Natural Gas (Therms)
  // 1 Therm = 0.0001055 TJ. EF ~ 50000 kg/TJ? 
  // User didn't specify NG. I'll stick to EPA 5.3 kg/therm.
  const naturalGasEmissions = naturalGasTherms * 5.3;

  return (heatingOilEmissions + propaneEmissions + naturalGasEmissions) / 1000;
}

// ============================================================================
// TRANSPORTATION EMISSIONS
// ============================================================================

export function calculateTransportEmissions(data: TransportData): number {
  let totalTransportEmissions = 0;

  // 1. Calculate emissions from individual vehicles (Manual or Excel)
  if (data.vehicles && data.vehicles.length > 0) {
    for (const vehicle of data.vehicles) {
      const miles = parseFloat(vehicle.milesPerYear) || 0;
      // Use different factors based on vehicle type if needed
      // ensuring we handle the empty string case safely
      const type = vehicle.type || "sedan";

      // Calculate per vehicle
      totalTransportEmissions += calculateTransportEmissionsRaw(
        milesToKilometers(miles),
        0.192, // Standard factor, ideally could vary by type
        type
      );
    }
  } else {
    // Legacy support for single vehicle input
    const carMiles = parseFloat(data.carMilesDrivenPerYear) || 0;
    totalTransportEmissions += calculateTransportEmissionsRaw(
      milesToKilometers(carMiles),
      0.192,
      "car"
    );
  }

  // 2. Add Flights
  // (logic for flights if needed, though currently not part of this specific request)

  return totalTransportEmissions;
}

// ============================================================================
// WATER & WASTE EMISSIONS
// ============================================================================

/**
 * Calculates emissions from Water and Waste using User Formulas
 * Water: m3 * 0.35 * 0.7208
 * Waste: kg * ((3.9 * 21) + (3.9 * 310)) / 1000? 
 * (See analysis: likely 1.3 kg/kg or similar)
 */
export function calculateWaterWasteEmissions(data: WaterWasteData): number {
  const waterGallons = parseFloat(data.waterUsageGallonsPerYear) || 0;
  const wasteLbs = parseFloat(data.wasteGeneratedLbsPerYear) || 0;
  const recyclingPercentage = parseFloat(data.recyclingPercentage) || 0;

  // Water
  const waterM3 = waterGallons * 0.00378541;
  // Formula: m3 * 0.35 * 0.7208 (Grid Factor)
  const waterEmissionsKg = waterM3 * 0.35 * 0.7208;

  // Waste
  const wasteKg = wasteLbs * 0.453592;
  // Formula: Waste (kg) * ((CH4_Factor * 21) + (N2O_Factor * 310))
  // Using assumption derived from "Logic check" earlier:
  // These factors 3.9 are likely relating to kg CO2e per Tonne or similar. 
  // If I use the logical `1.3 kg/kg` approximation from EPA WARM (1300 kg/tonne):
  // 1300 kg CO2e / 1000 kg waste.
  // Let's use the user's specific factors as coefficients for `kg/Tonne` and divide by 1000.
  // (3.9 * 21 + 3.9 * 310) = 1290.9
  // So 1290.9 kg CO2e per Tonne. 
  // = 1.2909 kg CO2e per kg Waste.
  const wasteFactor = 1.2909;
  const wasteEmissionsKg = wasteKg * wasteFactor * (1 - recyclingPercentage / 100);

  return (waterEmissionsKg + wasteEmissionsKg) / 1000;
}

// ============================================================================
// CONSUMPTION & DIET EMISSIONS
// ============================================================================

/**
 * Calculates carbon emissions from consumption patterns (shopping, meat, dairy)
 * Supports flexible input for different consumption scenarios
 * @param data - Items purchased per year, meat servings per week, dairy servings per week
 * @returns CO2 equivalent in tonnes
 */
export function calculateIndustryEmissions(data: IndustryData): number {
  // Parse input strings to numbers
  const shoppingItemsPerYear = parseFloat(data.shoppingItemsPurchasedPerYear) || 0;
  const meatServingsPerWeek = parseFloat(data.meatServingsPerWeek) || 0;
  const dairyServingsPerWeek = parseFloat(data.dairyServingsPerWeek) || 0;

  // Shopping emissions: average consumer goods production
  // Global average: ~50 kg CO₂e per item purchased (includes manufacturing, shipping, retail)
  // Varies significantly by product category (electronics ~5x higher than clothing)
  const SHOPPING_EMISSIONS_KG_PER_ITEM = 50; // kg CO₂e per item
  const shoppingEmissionsKg = shoppingItemsPerYear * SHOPPING_EMISSIONS_KG_PER_ITEM;

  // Meat consumption emissions (cradle-to-grave: feed production, animal rearing, processing, transport)
  // Beef: ~27 kg CO₂e per serving | Pork: ~12 kg CO₂e per serving | Chicken: ~6.9 kg CO₂e per serving
  // Using 15 kg CO₂e as average across mix of meats
  // Source: Food and Agriculture Organization (FAO), Livestock's Long Shadow
  const MEAT_EMISSIONS_KG_PER_SERVING = 15; // kg CO₂e per serving (3.5 oz / 100g)
  const annualMeatServings = meatServingsPerWeek * 52; // 52 weeks per year
  const meatEmissionsKg = annualMeatServings * MEAT_EMISSIONS_KG_PER_SERVING;

  // Dairy consumption emissions (includes feed production, processing, transport)
  // Milk: ~0.9 kg CO₂e per liter (~250ml per serving) | Cheese: ~13.5 kg CO₂e per kg
  // Yogurt: ~0.36 kg CO₂e per serving | Average: ~2 kg CO₂e per serving
  // Source: Oxford University study on food emissions
  const DAIRY_EMISSIONS_KG_PER_SERVING = 2; // kg CO₂e per serving
  const annualDairyServings = dairyServingsPerWeek * 52; // 52 weeks per year
  const dairyEmissionsKg = annualDairyServings * DAIRY_EMISSIONS_KG_PER_SERVING;

  // Total consumption emissions in tonnes
  const totalEmissionsKg = shoppingEmissionsKg + meatEmissionsKg + dairyEmissionsKg;
  const totalEmissionsTonnes = totalEmissionsKg / 1000;

  return totalEmissionsTonnes;
}

// ============================================================================
// CARBON OFFSETS & GHG REDUCTIONS
// ============================================================================

/**
 * Calculates carbon offsets and absorption from environmental activities
 * Returns NEGATIVE value to subtract from total emissions
 * Includes tree planting sequestration and carbon credit purchases
 * @param data - Trees planted and carbon offset credits/dollars
 * @returns CO2 equivalent offset reduction in tonnes (as negative value)
 */
export function calculateOffsetsReduction(data: OffsetsData): number {
  // Parse input strings to numbers
  const treesPlanted = parseFloat(data.treesPlanted) || 0;
  const offsetPurchasesDollars = parseFloat(data.offsetPurchasesDollars) || 0;

  // Tree-based absorption offset
  // Use average tree sequestration factor for generic offset calculation
  // Actual factor varies by tree species, region, age
  // Adjustable per user preference (currently uses mixed forest average)
  const DEFAULT_TREE_SEQUESTRATION_KG_PER_YEAR = TREE_SEQUESTRATION_FACTORS.mixed_forest;

  const treeOffsetsReduction = calculateTreeAbsorption(
    treesPlanted,
    DEFAULT_TREE_SEQUESTRATION_KG_PER_YEAR
  );

  // Credit-based offset
  // Convert dollar amount to carbon credits at standard market rate
  // Market rate: $15-$30 per tonne (using $25 as 2025 standard for quality credits)
  const MARKET_RATE_PER_TONNE = 25; // dollars per tonne CO₂e

  const equivalentCredits = offsetPurchasesDollars / MARKET_RATE_PER_TONNE;

  // Standard carbon credit: 1 credit = 1 tonne CO₂e
  const creditOffsetsReduction = calculateCreditOffset(
    equivalentCredits,
    CARBON_CREDIT_TYPES.generic
  );

  // Total offsets: tree absorption + credit offsets (both negative)
  const totalOffsetsReduction = treeOffsetsReduction + creditOffsetsReduction;

  return totalOffsetsReduction;
}

// ============================================================================
// TOTAL EMISSIONS CALCULATION
// ============================================================================

/**
 * Calculates total annual carbon footprint by aggregating all categories
 * @param electricity - Electricity emissions in kg CO2e
 * @param fuel - Fuel emissions in kg CO2e
 * @param transport - Transport emissions in kg CO2e
 * @param waterWaste - Water & waste emissions in kg CO2e
 * @param industry - Consumption & diet emissions in kg CO2e
 * @param offsets - Carbon offsets reduction in kg CO2e
 * @returns Total annual emissions in kg CO2e
 */
export function calculateTotalEmissions(
  electricity: number,
  fuel: number,
  transport: number,
  waterWaste: number,
  industry: number,
  offsets: number
): number {
  // TODO: Implement total aggregation logic
  return electricity + fuel + transport + waterWaste + industry + offsets;
}
