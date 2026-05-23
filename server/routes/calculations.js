const express = require('express');
const router = express.Router();
const Calculation = require('../db/models/Calculation');
const auth = require('../middleware/auth');

// @route   GET /api/history
// @desc    Get current user's calculation history
router.get('/history', auth, async (req, res) => {
    try {
        const history = await Calculation.find({ userId: req.user.id })
            .sort({ date: -1 })
            .lean();
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   POST /api/calculations
// @desc    Save a new calculation for the current user
router.post('/calculations', auth, async (req, res) => {
    try {
        const { totalKg, breakdown, formData, date } = req.body;

        // Simple validation
        if (!totalKg || !breakdown) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const calculation = new Calculation({
            userId: req.user.id,
            totalKg,
            breakdown,
            formData: formData || {},
            date: date || new Date()
        });

        const savedEntry = await calculation.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   DELETE /api/history
// @desc    Clear history for the current user
router.delete('/history', auth, async (req, res) => {
    try {
        await Calculation.deleteMany({ userId: req.user.id });
        res.json({ message: 'History cleared successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
