const express = require('express');
const Groq = require('groq-sdk');
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ============================================================================
// FALLBACK DATA (used if Gemini API fails)
// ============================================================================

const FALLBACK_TREES = [
    {
        name: 'White Oak',
        scientificName: 'Quercus alba',
        description: 'A long-lived hardwood reaching 20–30 m with a broad crown and lobed leaves. Exceptional carbon storage over its lifespan.',
        carbonImpactPercent: 92,
        co2PerYear: 37,
        growthRate: 'Moderate',
        hardinessZone: '3–9',
        droughtTolerant: true,
        sunlight: ['Full Sun'],
        image: null
    },
    {
        name: 'Moringa',
        scientificName: 'Moringa oleifera',
        description: 'A slender, fast-growing tree up to 12 m tall with feathery compound leaves. Ideal for tropical and subtropical regions.',
        carbonImpactPercent: 90,
        co2PerYear: 36,
        growthRate: 'High',
        hardinessZone: '9–11',
        droughtTolerant: true,
        sunlight: ['Full Sun'],
        image: null
    },
    {
        name: 'Silver Maple',
        scientificName: 'Acer saccharinum',
        description: 'A fast-growing deciduous tree reaching 15–25 m with silvery undersides on its leaves. Establishes quickly for early carbon impact.',
        carbonImpactPercent: 85,
        co2PerYear: 34,
        growthRate: 'High',
        hardinessZone: '3–9',
        droughtTolerant: false,
        sunlight: ['Full Sun', 'Partial Shade'],
        image: null
    }
];

// ============================================================================
// POST /api/tree-species
// ============================================================================

router.post('/', async (req, res) => {
    const { location, carbonFootprint } = req.body;

    if (!location) {
        return res.status(400).json({ message: 'Location is required' });
    }

    if (!process.env.GROQ_API_KEY) {
        console.error('[TreeSpecies] Groq API key not configured — using fallback');
        return sendFallback(res, location);
    }

    console.log(`[TreeSpecies] Generating AI recommendations for: ${location}, ${carbonFootprint} kg CO2`);

    const prompt = `You are an expert Environmental Scientist and Botanist.

CONTEXT: A user on a Carbon Calculator website wants to plant trees to offset their carbon footprint.

USER INPUTS:
- Location: ${location}
- Carbon Footprint: ${carbonFootprint || 'unknown'} kg CO2 per year

YOUR TASK:
1. Analyze the climate, soil type, and conditions for the given location.
2. Recommend exactly 3 tree species that are native or highly suitable for this specific location.
3. Prioritize trees known for high carbon sequestration (CO2 absorption).

OUTPUT FORMAT:
Return a raw JSON object (no markdown, no code blocks) with a "trees" key containing an array. Use exactly this structure:

{
  "trees": [
    {
      "name": "Common Name",
      "scientificName": "Scientific Name",
      "description": "A 1-2 sentence visual description (height, leaf type, appearance).",
      "carbonImpactPercent": 85,
      "co2PerYear": 34,
      "growthRate": "High",
      "hardinessZone": "5-9",
      "droughtTolerant": true,
      "sunlight": ["Full Sun"]
    }
  ]
}

Rules:
- "carbonImpactPercent" is a whole number between 60 and 99 representing this tree's carbon sequestration effectiveness relative to the best trees.
- "co2PerYear" is the estimated kg of CO2 absorbed per mature tree per year (realistic value between 10 and 50).
- "growthRate" must be exactly one of: "High", "Moderate", or "Low".
- "hardinessZone" is the USDA hardiness zone string (e.g. "6-9").
- "droughtTolerant" is a boolean.
- "sunlight" is an array of one or more of: "Full Sun", "Partial Shade", "Full Shade".`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.4,
        });
        const text = completion.choices[0].message.content;

        console.log('[TreeSpecies] Raw Groq response:', text.substring(0, 300));

        // Strip markdown code fences if present
        let cleaned = text.trim();
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        }

        // Parse JSON object and extract trees array
        const parsed = JSON.parse(cleaned);
        const trees = parsed.trees || parsed;

        if (!Array.isArray(trees) || trees.length === 0) {
            throw new Error('Empty or invalid tree array from Groq response');
        }

        const finalTrees = trees.slice(0, 3).map(t => ({
            name: t.name || 'Local Species',
            scientificName: t.scientificName || '',
            description: t.description || `Well suited for ${location}.`,
            carbonImpactPercent: Number(t.carbonImpactPercent) || 75,
            co2PerYear: Number(t.co2PerYear) || 25,
            growthRate: ['High', 'Moderate', 'Low'].includes(t.growthRate) ? t.growthRate : 'Moderate',
            hardinessZone: t.hardinessZone || null,
            droughtTolerant: typeof t.droughtTolerant === 'boolean' ? t.droughtTolerant : null,
            sunlight: Array.isArray(t.sunlight) ? t.sunlight : [],
            image: null
        }));

        console.log(`[TreeSpecies] Success — ${finalTrees.length} trees for ${location}`);

        return res.json({
            summary_message: `AI-selected trees native to ${location} that provide the highest carbon offset for your ${carbonFootprint ? carbonFootprint + ' kg CO2' : ''} footprint.`,
            trees: finalTrees,
            isFallback: false
        });

    } catch (err) {
        console.error('[TreeSpecies] Groq error:', err.message);

        if (err.message.includes('API key') || err.status === 401) {
            return res.status(500).json({ message: 'AI service authentication failed' });
        }
        if (err.message.includes('quota') || err.message.includes('rate') || err.status === 429) {
            return res.status(429).json({ message: 'AI service rate limit exceeded. Please try again later.' });
        }

        return sendFallback(res, location);
    }
});

function sendFallback(res, location) {
    console.log(`[TreeSpecies] Returning fallback trees for ${location}`);
    return res.json({
        summary_message: `Showing high-impact trees recommended for carbon offset in ${location}.`,
        trees: FALLBACK_TREES,
        isFallback: true
    });
}

module.exports = router;
