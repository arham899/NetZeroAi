const express = require('express');
const Groq = require('groq-sdk');
const router = express.Router();

// Initialize Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @route   POST /api/tree-recommendations
// @desc    Get AI-powered tree recommendations based on location and carbon footprint
router.post('/', async (req, res) => {
    try {
        const { location, carbonFootprint } = req.body;

        if (!location || !carbonFootprint) {
            return res.status(400).json({
                message: 'Location and carbon footprint are required'
            });
        }

        if (!process.env.GROQ_API_KEY) {
            console.error('[TreeRec] Groq API key not configured');
            return res.status(500).json({
                message: 'AI service not configured'
            });
        }

        console.log('[TreeRec] API Key loaded:', process.env.GROQ_API_KEY ? `Yes (${process.env.GROQ_API_KEY.substring(0, 10)}...)` : 'No');
        console.log(`[TreeRec] Getting recommendations for: ${location}, ${carbonFootprint} kg CO2`);

        // Create the prompt
        const prompt = `You are an expert Environmental Scientist and Botanist. 

**CONTEXT:** A user on a Carbon Calculator website wants to plant trees to offset their specific carbon footprint. 

**USER INPUTS:**
* **Location:** ${location}
* **Calculated Carbon Footprint:** ${carbonFootprint} kg CO2 per year

**YOUR TASK:**
1. Analyze the climate, soil type, and weather conditions for the provided "Location".
2. Recommend exactly 3 specific tree species that are **native** or highly suitable for this specific location.
3. Ensure these trees are known for effective carbon sequestration (CO2 absorption).

**OUTPUT FORMAT:**
Provide the response in raw **JSON** format (do not use Markdown code blocks). Use exactly this structure:

{
  "summary_message": "A 1-sentence encouraging message about offsetting their specific footprint amount.",
  "trees": [
    {
      "name": "Common Name (Scientific Name)",
      "description": "A short, visual description of what the plant looks like (height, leaf type).",
      "suitability": "Why this specific tree grows well in the user's location (e.g., heat resistant, drought tolerant).",
      "benefits": "How this tree helps the environment and its estimated carbon absorption potential."
    }
  ]
}`;

        // Call Groq API
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.4,
        });
        const text = completion.choices[0].message.content;

        console.log('[TreeRec] Raw Groq response:', text.substring(0, 200) + '...');

        // Parse the JSON response
        let recommendations;
        try {
            // Clean the response - remove markdown code blocks if present
            let cleanedText = text.trim();
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }

            recommendations = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('[TreeRec] Failed to parse Groq response:', parseError.message);
            console.error('[TreeRec] Raw text:', text);
            return res.status(500).json({
                message: 'Failed to parse AI recommendations',
                rawResponse: text
            });
        }

        // Validate the response structure
        if (!recommendations.summary_message || !Array.isArray(recommendations.trees)) {
            console.error('[TreeRec] Invalid response structure:', recommendations);
            return res.status(500).json({
                message: 'Invalid AI response format'
            });
        }

        console.log(`[TreeRec] Successfully generated ${recommendations.trees.length} tree recommendations`);

        res.json(recommendations);

    } catch (err) {
        console.error('[TreeRec] Error:', err.message);
        console.error('[TreeRec] Full error:', err);
        console.error('[TreeRec] Error stack:', err.stack);

        // Handle specific Groq API errors
        if (err.message.includes('API key') || err.status === 401) {
            return res.status(500).json({ message: 'AI service authentication failed' });
        }
        if (err.message.includes('quota') || err.message.includes('rate') || err.status === 429) {
            return res.status(429).json({ message: 'AI service rate limit exceeded. Please try again later.' });
        }

        res.status(500).json({ message: 'Failed to generate tree recommendations', error: err.message });
    }
});

module.exports = router;
