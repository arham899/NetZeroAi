// Climate News Service using GDELT API
// GDELT (Global Database of Events, Language, and Tone) 
// https://gdeltproject.org/

export interface ClimateNewsArticle {
    url: string;
    title: string;
    date: string;
    source: string;
    country: string;
    image?: string;
}

const GDELT_API_URL = 'https://api.gdeltproject.org/api/v2/doc/doc';

/**
 * Fetch latest climate/CO2 news from GDELT API
 * GDELT monitors news from 100+ languages and 200+ countries
 */
export async function fetchClimateNews(limit: number = 10): Promise<ClimateNewsArticle[]> {
    try {
        const params = new URLSearchParams({
            query: 'CO2 climate carbon emissions',
            mode: 'artlist',
            format: 'json',
            maxrecords: limit.toString(),
        });

        const response = await fetch(`${GDELT_API_URL}?${params}`);

        if (!response.ok) {
            console.warn('GDELT API error, using fallback data');
            return FALLBACK_NEWS;
        }

        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            return FALLBACK_NEWS;
        }

        return data.articles.slice(0, limit).map((article: any) => ({
            url: article.url,
            title: article.title,
            date: formatGDELTDate(article.seendate),
            source: extractDomain(article.domain),
            country: article.sourcecountry || 'Unknown',
            image: article.socialimage || undefined,
        }));
    } catch (error) {
        console.warn('Failed to fetch climate news:', error);
        return FALLBACK_NEWS;
    }
}

// Format GDELT date (20251127T043000Z) to readable format
function formatGDELTDate(dateStr: string): string {
    if (!dateStr) return 'Recent';
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    return `${year}-${month}-${day}`;
}

// Extract source name from domain
function extractDomain(domain: string): string {
    if (!domain) return 'Unknown';
    // Clean up domain to get source name
    const parts = domain.split('.');
    if (parts.length >= 2) {
        const name = parts[parts.length - 2];
        // Capitalize first letter
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return domain;
}

// Fallback news for offline/error scenarios
const FALLBACK_NEWS: ClimateNewsArticle[] = [
    {
        url: 'https://www.iea.org/news/global-energy-related-co2-emissions-grew-in-2024',
        title: 'Global CO2 emissions reach record 37.8 Gt in 2024',
        date: '2025-01-08',
        source: 'IEA',
        country: 'France',
    },
    {
        url: 'https://www.noaa.gov/news-release/2024-was-earths-warmest-year-on-record',
        title: '2024 confirmed as Earth\'s warmest year on record',
        date: '2025-01-06',
        source: 'NOAA',
        country: 'United States',
    },
    {
        url: 'https://www.nasa.gov/earth/climate-change/',
        title: 'Arctic sea ice continues long-term decline',
        date: '2025-01-05',
        source: 'NASA',
        country: 'United States',
    },
    {
        url: 'https://unfccc.int/',
        title: 'UN Climate Change: Countries urged to strengthen 2035 targets',
        date: '2025-01-04',
        source: 'UNFCCC',
        country: 'Germany',
    },
];
