/**
 * Emissions Aggregator
 * Orchestrates the calculation of total carbon emissions from all categories
 * 
 * Flow:
 * 1. Accepts calculator form data from central store
 * 2. Calls each category-specific calculation function
 * 3. Aggregates results into a structured output with transparency details
 * 4. Returns complete emissions result with breakdown, detailed breakdown, and total
 */

import { CalculatorFormData } from "../../types/calculatorTypes";
import {
  calculateElectricityEmissions,
  calculateFuelEmissions,
  calculateTransportEmissions,
  calculateWaterWasteEmissions,
  calculateIndustryEmissions,
  calculateOffsetsReduction,
} from "./emissionCalculator";
import {
  EmissionsResult,
  EmissionsBreakdown,
  DetailedEmissionsBreakdown,
  CategoryCalculationDetails,
} from "./emissionsResult";

// ============================================================================
// HELPER FUNCTIONS FOR TRANSPARENCY
// ============================================================================

/**
 * Helper: Build detailed calculation information for electricity emissions
 * @param formData - Electricity form data
 * @param result - Resulting CO₂e in tonnes
 * @returns Detailed calculation breakdown
 */
function buildElectricityDetails(
  formData: CalculatorFormData["electricity"],
  result: number
): CategoryCalculationDetails {
  const monthlyKwh = parseFloat(formData.monthlyUsageKwh) || 0;
  const renewablePercent = parseFloat(formData.renewablePercentage) || 0;
  const gridFactor = 0.7208; // User-provided Grid Factor
  const renewableReduction = renewablePercent > 0 ? (1 - renewablePercent / 100) : 1;

  return {
    inputValue: monthlyKwh,
    inputUnit: "kWh/month",
    emissionFactor: gridFactor * renewableReduction,
    emissionFactorUnit: "kg CO₂e/kWh",
    formula: `(${monthlyKwh} kWh/month × 12 months × ${gridFactor} kg/kWh × ${renewableReduction.toFixed(2)}) ÷ 1000 = tonnes CO₂e`,
    factorDescription: `Grid Factor (${gridFactor} kg/kWh) based on user inputs`,
    resultingCO2e: result,
  };
}

/**
 * Helper: Build detailed calculation information for fuel emissions
 * @param formData - Fuel form data
 * @param result - Resulting CO₂e in tonnes
 * @returns Detailed calculation breakdown
 */
function buildFuelDetails(
  formData: CalculatorFormData["fuel"],
  result: number
): CategoryCalculationDetails {
  const naturalGas = parseFloat(formData.naturalGasThermsPeYear) || 0;
  const heatingOil = parseFloat(formData.heatingOilGallonsPerYear) || 0;
  const propane = parseFloat(formData.propaneGallonsPerYear) || 0;

  const inputs = `Natural Gas: ${naturalGas} therms, Heating Oil: ${heatingOil} gal, Propane: ${propane} gal`;

  return {
    inputValue: inputs,
    inputUnit: "mixed (therms/gallons)",
    emissionFactor: 0, // Complex multi-factor formula
    emissionFactorUnit: "Complex formula (see description)",
    formula: `Combined scientific formula using Density, NCV, and custom Emission Factors`,
    factorDescription: "Diesel/Heating Oil: Density 0.87, NCV 0.043 TJ/kg, EF 74.1 Tonnes/TJ. Propane: Density 0.493, NCV 4.7e-5",
    resultingCO2e: result,
  };
}

/**
 * Helper: Build detailed calculation information for transport emissions
 * @param formData - Transport form data
 * @param result - Resulting CO₂e in tonnes
 * @returns Detailed calculation breakdown
 */
function buildTransportDetails(
  formData: CalculatorFormData["transport"],
  result: number
): CategoryCalculationDetails {
  const carMiles = parseFloat(formData.carMilesDrivenPerYear) || 0;
  const vehicleType = formData.vehicleType || "sedan";
  const flightHours = parseFloat(formData.flightHoursPerYear) || 0;
  const transitMiles = parseFloat(formData.publicTransitMilesDrivenPerYear) || 0;

  const vehicleFactors: Record<string, number> = {
    sedan: 0.192,
    suv: 0.268,
    truck: 0.285,
    hybrid: 0.108,
    electric: 0.05,
  };
  const factor = vehicleFactors[vehicleType] || 0.192;

  const inputs = `Car: ${carMiles} miles (${vehicleType}), Flight: ${flightHours} hours, Transit: ${transitMiles} miles`;

  return {
    inputValue: inputs,
    inputUnit: "mixed (miles/hours)",
    emissionFactor: factor,
    emissionFactorUnit: "kg CO₂e/km",
    formula: `(${carMiles} mi × 1.609 × ${factor} kg/km) + (${flightHours} hrs × 800 km × 0.255) + (${transitMiles} mi × 1.609 × 0.089) ÷ 1000 = tonnes CO₂e`,
    factorDescription: `Vehicle factors (EPA): Sedan 0.192, SUV 0.268, Truck 0.285, Hybrid 0.108, Electric 0.05 kg CO₂e/km`,
    resultingCO2e: result,
  };
}

/**
 * Helper: Build detailed calculation information for water & waste emissions
 * @param formData - Water & waste form data
 * @param result - Resulting CO₂e in tonnes
 * @returns Detailed calculation breakdown
 */
function buildWaterWasteDetails(
  formData: CalculatorFormData["waterWaste"],
  result: number
): CategoryCalculationDetails {
  const waterGallons = parseFloat(formData.waterUsageGallonsPerYear) || 0;
  const wasteLbs = parseFloat(formData.wasteGeneratedLbsPerYear) || 0;
  const recyclingPercent = parseFloat(formData.recyclingPercentage) || 0;

  const inputs = `Water: ${waterGallons} gal/year, Waste: ${wasteLbs} lbs/year (${recyclingPercent}% recycled)`;

  return {
    inputValue: inputs,
    inputUnit: "mixed (gallons/pounds)",
    emissionFactor: 0, // Complex calculation
    emissionFactorUnit: "Calculated per user formula",
    formula: `Water: m³ × 0.252 | Waste: kg × 1.29 (approx)`,
    factorDescription: "Water: 0.35 * 0.7208 factor. Waste: Custom CH4/N2O factors applied to mass.",
    resultingCO2e: result,
  };
}

/**
 * Helper: Build detailed calculation information for industry/diet emissions
 * @param formData - Industry form data
 * @param result - Resulting CO₂e in tonnes
 * @returns Detailed calculation breakdown
 */
function buildIndustryDetails(
  formData: CalculatorFormData["industry"],
  result: number
): CategoryCalculationDetails {
  const shoppingItems = parseFloat(formData.shoppingItemsPurchasedPerYear) || 0;
  const meatServings = parseFloat(formData.meatServingsPerWeek) || 0;
  const dairyServings = parseFloat(formData.dairyServingsPerWeek) || 0;

  const inputs = `Shopping: ${shoppingItems} items/year, Meat: ${meatServings} servings/week, Dairy: ${dairyServings} servings/week`;

  return {
    inputValue: inputs,
    inputUnit: "mixed (items/servings)",
    emissionFactor: (50 + 15 + 2) / 3, // Average of three consumption types
    emissionFactorUnit: "kg CO₂e/unit",
    formula: `(${shoppingItems} × 50) + (${meatServings} × 52 × 15) + (${dairyServings} × 52 × 2) ÷ 1000 = tonnes CO₂e`,
    factorDescription: "Consumption: Shopping 50 kg CO₂e/item, Meat 15 kg CO₂e/serving, Dairy 2 kg CO₂e/serving (cradle-to-grave)",
    resultingCO2e: result,
  };
}

/**
 * Helper: Build detailed calculation information for carbon offsets
 * @param formData - Offsets form data
 * @param result - Resulting CO₂e offset in tonnes (negative value)
 * @returns Detailed calculation breakdown
 */
function buildOffsetsDetails(
  formData: CalculatorFormData["offsets"],
  result: number
): CategoryCalculationDetails {
  const treesPlanted = parseFloat(formData.treesPlanted) || 0;
  const offsetDollars = parseFloat(formData.offsetPurchasesDollars) || 0;

  const inputs = `Trees: ${treesPlanted}, Offset Purchase: $${offsetDollars}`;

  return {
    inputValue: inputs,
    inputUnit: "mixed (trees/dollars)",
    emissionFactor: 25, // kg CO₂e/year per tree (updated)
    emissionFactorUnit: "kg CO₂e/year/tree (+ $25/tonne credits)",
    formula: `(${treesPlanted} trees × 25 kg/year) + (${offsetDollars} ÷ $25 per tonne × 1000) = offset in kg, ÷ 1000 = negative tonnes CO₂e`,
    factorDescription: "Tree sequestration (Mature Average: 25 kg CO₂e/year) + High Quality Carbon Credits ($25/tonne market rate)",
    resultingCO2e: result, // Will be negative
  };
}

// ============================================================================
// AGGREGATION FUNCTION
// ============================================================================

/**
 * Aggregates all calculator inputs and produces complete emissions report
 * 
 * Flow:
 * 1. Calls each category-specific calculation function
 * 2. Builds detailed breakdown with transparency information
 * 3. Separates emissions (positive) from offsets (negative)
 * 4. Calculates totals with full numeric precision
 * 5. Returns structured result: totals + detailed breakdown
 * 
 * @param formData - Complete form data from calculator store
 * @returns Structured emissions result with breakdown, detailed breakdown, and net footprint
 */
export function aggregateEmissions(formData: CalculatorFormData): EmissionsResult {
  // ====== STEP 1: Calculate emissions for each category ======
  const electricityEmissions = calculateElectricityEmissions(formData.electricity);
  const fuelEmissions = calculateFuelEmissions(formData.fuel);
  const transportEmissions = calculateTransportEmissions(formData.transport);
  const waterWasteEmissions = calculateWaterWasteEmissions(formData.waterWaste);
  const industryEmissions = calculateIndustryEmissions(formData.industry);
  const offsetsReduction = calculateOffsetsReduction(formData.offsets);

  // ====== STEP 2: Build simple breakdown object ======
  const breakdown: EmissionsBreakdown = {
    electricity: electricityEmissions,
    fuel: fuelEmissions,
    transport: transportEmissions,
    waterWaste: waterWasteEmissions,
    industry: industryEmissions,
    offsets: offsetsReduction, // negative value
  };

  // ====== STEP 2B: Build detailed breakdown with transparency ======
  const detailedBreakdown: DetailedEmissionsBreakdown = {
    electricity: buildElectricityDetails(formData.electricity, electricityEmissions),
    fuel: buildFuelDetails(formData.fuel, fuelEmissions),
    transport: buildTransportDetails(formData.transport, transportEmissions),
    waterWaste: buildWaterWasteDetails(formData.waterWaste, waterWasteEmissions),
    industry: buildIndustryDetails(formData.industry, industryEmissions),
    offsets: buildOffsetsDetails(formData.offsets, offsetsReduction),
  };

  // ====== STEP 3: Separate emissions and offsets ======
  // Emission categories (all positive values in tonnes CO₂e)
  const emissionCategories = [
    electricityEmissions,
    fuelEmissions,
    transportEmissions,
    waterWasteEmissions,
    industryEmissions,
  ];

  // Calculate total emissions by summing all positive emission sources
  // Preserved with full numeric precision (no rounding)
  const totalEmissions = emissionCategories.reduce((sum, emission) => sum + emission, 0);

  // Offsets are returned as negative values, so isolate them
  const totalOffsets = Math.abs(offsetsReduction); // Convert to positive for reporting

  // ====== STEP 4: Calculate net footprint ======
  // Net CO₂e = Total Emissions + Offsets (where offsets are already negative)
  const netCO2e = totalEmissions + offsetsReduction;

  // ====== STEP 5: Return structured result ======
  // Full precision maintained throughout - no rounding shortcuts
  return {
    breakdown, // All individual category values
    detailedBreakdown, // Detailed info: inputs, factors, formulas
    totalEmissions, // Sum of all emission sources (positive)
    totalOffsets, // Sum of all offsets (positive, but applied as negative in net)
    netCO2e, // Final footprint after offsets: totalEmissions - totalOffsets
    total: netCO2e, // Backward compatibility alias
    calculatedAt: new Date(),
  };
}
