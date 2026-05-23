const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Ensure files exist
if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
}
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// ============================================================================
// CALCULATION HISTORY
// ============================================================================

const getHistory = (userId) => {
    try {
        const data = fs.readFileSync(HISTORY_FILE, 'utf8');
        const allHistory = JSON.parse(data);
        if (!userId) return allHistory;
        return allHistory.filter(entry => entry.userId === userId);
    } catch (err) {
        console.error('Error reading history file:', err);
        return [];
    }
};

const addEntry = (entry) => {
    try {
        const data = fs.readFileSync(HISTORY_FILE, 'utf8');
        const history = JSON.parse(data);
        history.unshift(entry); // Add to the beginning
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
        return entry;
    } catch (err) {
        console.error('Error writing to history file:', err);
        throw err;
    }
};

const clearHistory = (userId) => {
    try {
        if (!userId) {
            fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
            return true;
        }
        const data = fs.readFileSync(HISTORY_FILE, 'utf8');
        const history = JSON.parse(data);
        const filtered = history.filter(entry => entry.userId !== userId);
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(filtered, null, 2));
        return true;
    } catch (err) {
        console.error('Error clearing history file:', err);
        throw err;
    }
}

// ============================================================================
// USERS
// ============================================================================

const getUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading users file:', err);
        return [];
    }
};

const findUser = (email) => {
    const users = getUsers();
    return users.find(u => u.email === email);
};

const createUser = (userData) => {
    try {
        const users = getUsers();
        const newUser = {
            ...userData,
            id: require('crypto').randomUUID(),
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return newUser;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
};

module.exports = {
    getHistory,
    addEntry,
    clearHistory,
    getUsers,
    findUser,
    createUser
};
