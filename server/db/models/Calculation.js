const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    totalKg: {
        type: Number,
        required: [true, 'Total kg is required']
    },
    breakdown: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Breakdown is required']
    },
    formData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries by userId and date
calculationSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Calculation', calculationSchema);
