const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-calculator';

        console.log('🔄 Connecting to MongoDB...');

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
        });

        console.log('✅ MongoDB Connected Successfully');

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        console.error('');
        console.error('📋 TROUBLESHOOTING:');
        console.error('   1. Check if your IP is whitelisted in MongoDB Atlas:');
        console.error('      https://cloud.mongodb.com → Network Access → Add IP Address');
        console.error('   2. Or add 0.0.0.0/0 to allow all IPs (dev only)');
        console.error('   3. Check your MONGODB_URI in .env file');
        console.error('');
        // Don't exit - let the server continue for debugging
        // process.exit(1);
    }
};

module.exports = connectDB;
