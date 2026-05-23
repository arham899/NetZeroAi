/**
 * Transportation Emissions Calculation
 * Pure function to calculate carbon emissions from distance-based travel
 * 
 * Formula:
 * CO₂e (kg) = Distance (km) × Emission Factor (kg CO₂e / km)
 * CO₂e (tonnes) = CO₂e (kg) / 1000
 */

/**
 * Calculates annual carbon emissions from distance-based transportation
 * 
 * @param distanceKm - Annual distance traveled in kilometers
 *        Must be a non-negative number
 *        Example: 12000 (meaning 12,000 km per year)
 * 
 * @param emissionFactorKgPerKm - Emission factor in kg CO₂e per kilometer
 *        Must be a non-negative number
 *        Varies by vehicle type, transportation mode, or region
 *        Example: 0.192 (kg CO₂e/km for average sedan)
 * 
 * @param transportType - Description of transport type for error messages and clarity
 *        Example: "car", "bus", "train", "flight"
 * 
 * @returns Annual carbon emissions in tonnes CO₂e
 *         Converts kg result to tonnes (÷ 1000)
 * 
 * @throws Error if inputs are not valid numbers or are negative
 * 
 * @example
 * // Car: 12,000 km/year, sedan at 0.192 kg CO₂e/km
 * calculateTransportEmissions(12000, 0.192, "car")
 * // Returns: 2.304 (tonnes CO₂e per year)
 * 
 * @example
 * // Public transit: 5,000 km/year, bus at 0.089 kg CO₂e/km
 * calculateTransportEmissions(5000, 0.089, "public transit")
 * // Returns: 0.445 (tonnes CO₂e per year)
 */
export function calculateTransportEmissions(
  distanceKm: number,
  emissionFactorKgPerKm: number,
  transportType: string = "transportation"
): number {
  // ========================================================================
  // INPUT VALIDATION
  // ========================================================================
  
  // Ensure distance is a valid number
  if (typeof distanceKm !== "number" || isNaN(distanceKm)) {
    throw new Error(
      `Invalid ${transportType} distance: expected number, got ${typeof distanceKm}`
    );
  }
  
  // Ensure emission factor is a valid number
  if (typeof emissionFactorKgPerKm !== "number" || isNaN(emissionFactorKgPerKm)) {
    throw new Error(
      `Invalid emission factor for ${transportType}: expected number, got ${typeof emissionFactorKgPerKm}`
    );
  }
  
  // Prevent negative distances
  if (distanceKm < 0) {
    throw new Error(
      `${transportType} distance cannot be negative: ${distanceKm}`
    );
  }
  
  // Prevent negative emission factors
  if (emissionFactorKgPerKm < 0) {
    throw new Error(
      `Emission factor for ${transportType} cannot be negative: ${emissionFactorKgPerKm}`
    );
  }
  
  // ========================================================================
  // CALCULATION
  // ========================================================================
  
  // Step 1: Calculate total CO₂e in kilograms
  // Formula: km × (kg CO₂e / km) = kg CO₂e
  // Units: distance × factor = kg CO₂e
  const emissionsKg = distanceKm * emissionFactorKgPerKm;
  
  // Step 2: Convert kilograms to tonnes
  // 1 tonne = 1000 kg
  const emissionsTonnes = emissionsKg / 1000;
  
  // ========================================================================
  // RETURN RESULT
  // ========================================================================
  
  return emissionsTonnes;
}

/**
 * Converts distance from miles to kilometers
 * 
 * @param miles - Distance in miles
 * @returns Distance in kilometers
 * 
 * @example
 * milesToKilometers(1) // Returns: 1.60934
 */
export function milesToKilometers(miles: number): number {
  if (typeof miles !== "number" || isNaN(miles)) {
    throw new Error(`Invalid miles: expected number, got ${typeof miles}`);
  }
  
  if (miles < 0) {
    throw new Error(`Miles cannot be negative: ${miles}`);
  }
  
  return miles * 1.60934;
}

/**
 * Converts flight hours to approximate distance in kilometers
 * Assumes average cruising speed of 800 km/h
 * 
 * @param hours - Flight duration in hours
 * @returns Approximate distance in kilometers
 * 
 * @example
 * flightHoursToKilometers(5) // Returns: 4000 (approximate)
 */
export function flightHoursToKilometers(hours: number): number {
  if (typeof hours !== "number" || isNaN(hours)) {
    throw new Error(`Invalid flight hours: expected number, got ${typeof hours}`);
  }
  
  if (hours < 0) {
    throw new Error(`Flight hours cannot be negative: ${hours}`);
  }
  
  // Average commercial aircraft cruising speed: ~800 km/h
  // Includes taxiing and takeoff/landing time (actual flight time ~90-95% of total)
  const AVERAGE_FLIGHT_SPEED_KM_PER_HOUR = 800;
  
  return hours * AVERAGE_FLIGHT_SPEED_KM_PER_HOUR;
}
