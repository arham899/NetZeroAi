/**
 * Calculation Engine Exports
 * Central hub for all emission calculation functions and aggregation
 */

export {
  calculateElectricityEmissions,
  calculateFuelEmissions,
  calculateTransportEmissions,
  calculateWaterWasteEmissions,
  calculateIndustryEmissions,
  calculateOffsetsReduction,
  calculateTotalEmissions,
} from "./emissionCalculator";

export { aggregateEmissions } from "./aggregator";

export type { EmissionsResult, EmissionsBreakdown } from "./emissionsResult";
