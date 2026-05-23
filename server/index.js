const dotenv = require('dotenv');
// Load environment variables FIRST — before any module that reads process.env
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// NOTE: These packages are incompatible with Express 5
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const connectDB = require('./db/database');
const calculationsRoutes = require('./routes/calculations');
const authRoutes = require('./routes/auth');
const treeRecommendationsRoutes = require('./routes/treeRecommendations');
const treeSpeciesRoutes = require('./routes/treeSpecies');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS - configure for production
const allowedOrigins = [
    'http://localhost:5173',    // Vite dev server
    'http://localhost:3000',    // Alternative dev port
    'http://127.0.0.1:5173',
    'http://192.168.100.52:5173', // LAN access
    process.env.FRONTEND_URL    // Production frontend URL from env
].filter(Boolean);

// CORS configuration - restrict to specific origins
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow any localhost or 127.0.0.1 origin (any port, for Vite dev)
        const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        if (isLocalhost || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    maxAge: 86400 // 24 hours - reduce preflight requests
};

// Security middleware - Helmet with enhanced configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", ...allowedOrigins, "http://localhost:*", "http://127.0.0.1:*"]
        }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    }
}));

// Apply CORS
app.use(cors(corsOptions));

// NOTE: Commented out due to Express 5 incompatibility
// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS attacks
// app.use(xss());

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false
});
app.use(limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Increased for development testing
    message: { message: 'Too many authentication attempts, please try again later.' },
    skipSuccessfulRequests: false
});
app.use('/api/auth', authLimiter);

// Response compression
app.use(compression());

// Request logging (use 'combined' for production, 'dev' for development)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Core middleware
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Debug middleware - log all API requests
app.use('/api', (req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.path} - Body:`, req.body);
    next();
});

// Routes
app.use('/api', calculationsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tree-recommendations', treeRecommendationsRoutes);
app.use('/api/tree-species', treeSpeciesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// CORS error handler
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'CORS policy violation' });
    }
    next(err);
});

// Error handler - don't expose error details in production
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong!'
            : err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(` CORS enabled for: ${allowedOrigins.join(', ')}`);
});
