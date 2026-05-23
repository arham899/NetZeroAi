/**
 * Migration Script: JSON to MongoDB
 * 
 * Run this once to migrate existing users and history from JSON files to MongoDB.
 * Usage: node migrate.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('./models/User');
const Calculation = require('./models/Calculation');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

async function migrate() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-calculator';

        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // Migrate Users
        if (fs.existsSync(USERS_FILE)) {
            console.log('\n📦 Migrating users...');
            const usersData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

            // Create a mapping of old IDs to new MongoDB ObjectIds
            const userIdMap = new Map();

            for (const userData of usersData) {
                const existingUser = await User.findOne({ email: userData.email });
                if (existingUser) {
                    console.log(`  ⏭️  Skipping existing user: ${userData.email}`);
                    userIdMap.set(userData.id, existingUser._id);
                    continue;
                }

                const newUser = new User({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password, // Already hashed
                    createdAt: userData.createdAt || new Date()
                });

                await newUser.save();
                userIdMap.set(userData.id, newUser._id);
                console.log(`  ✅ Migrated user: ${userData.email}`);
            }
            console.log(`📊 Users migration complete: ${usersData.length} processed`);

            // Migrate Calculations (History)
            if (fs.existsSync(HISTORY_FILE)) {
                console.log('\n📦 Migrating calculation history...');
                const historyData = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));

                let migrated = 0;
                let skipped = 0;

                for (const entry of historyData) {
                    // Map old userId to new MongoDB ObjectId
                    const newUserId = userIdMap.get(entry.userId);

                    if (!newUserId) {
                        console.log(`  ⚠️  Skipping entry - user not found: ${entry.userId}`);
                        skipped++;
                        continue;
                    }

                    const calculation = new Calculation({
                        userId: newUserId,
                        totalKg: entry.totalKg,
                        breakdown: entry.breakdown,
                        date: entry.date || new Date()
                    });

                    await calculation.save();
                    migrated++;
                }

                console.log(`📊 History migration complete: ${migrated} migrated, ${skipped} skipped`);
            }
        } else {
            console.log('ℹ️  No existing data files found. Fresh start!');
        }

        console.log('\n🎉 Migration completed successfully!');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

migrate();
