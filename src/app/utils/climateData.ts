// CO2 Emissions Data - Authentic Sources
// EDGAR GHG 2025 Report, IEA Global Energy Review 2025
// https://edgar.jrc.ec.europa.eu/
// https://ourworldindata.org/co2-emissions

export interface CO2CountryData {
  country: string;
  percentage: number;
  emissions: string; // Gigatonnes CO2
  color: string;
}

export const CO2_BY_COUNTRY: CO2CountryData[] = [
  { country: 'China', percentage: 30.9, emissions: '11.7 Gt', color: '#ef4444' },
  { country: 'United States', percentage: 13.4, emissions: '5.1 Gt', color: '#3b82f6' },
  { country: 'India', percentage: 7.3, emissions: '2.8 Gt', color: '#f97316' },
  { country: 'European Union', percentage: 7.1, emissions: '2.7 Gt', color: '#8b5cf6' },
  { country: 'Russia', percentage: 4.7, emissions: '1.8 Gt', color: '#06b6d4' },
  { country: 'Japan', percentage: 2.9, emissions: '1.1 Gt', color: '#ec4899' },
  { country: 'Rest of World', percentage: 33.7, emissions: '12.8 Gt', color: '#6b7280' },
];

// Global totals from IEA Global Energy Review 2025
export const GLOBAL_CO2_DATA = {
  totalEmissions: 37.8, // Gigatonnes CO2 in 2024
  yearOverYearChange: 0.8, // % increase from 2023
  atmosphericCO2: 422.5, // ppm as of 2024
  recordYear: 2024,
  source: 'EDGAR GHG 2025 Report, IEA Global Energy Review 2025',
};

// Sector breakdown from IEA
export const CO2_BY_SECTOR = [
  { sector: 'Power Generation', percentage: 38.5, color: '#fbbf24' },
  { sector: 'Industry', percentage: 22.4, color: '#a855f7' },
  { sector: 'Transport', percentage: 21.5, color: '#22c55e' },
  { sector: 'Buildings', percentage: 10.2, color: '#f43f5e' },
  { sector: 'Other', percentage: 7.4, color: '#6b7280' },
];
