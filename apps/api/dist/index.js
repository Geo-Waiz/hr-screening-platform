"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./lib/database");
const redis_1 = require("./lib/redis");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Test database connection
        const dbStatus = await testDatabaseConnection();
        const redisStatus = await testRedisConnection();
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            services: {
                database: dbStatus ? 'connected' : 'disconnected',
                redis: redisStatus ? 'connected' : 'disconnected'
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'ERROR',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'HR Screening API is running!',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth'
        }
    });
});
// Error handling
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
});
// Global error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});
async function testDatabaseConnection() {
    try {
        const { prisma } = await Promise.resolve().then(() => __importStar(require('./lib/database')));
        await prisma.$connect();
        return true;
    }
    catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
}
async function testRedisConnection() {
    try {
        const { redis } = await Promise.resolve().then(() => __importStar(require('./lib/redis')));
        await redis.ping();
        return true;
    }
    catch (error) {
        console.error('Redis connection test failed:', error);
        return false;
    }
}
async function startServer() {
    try {
        // Initialize connections
        await (0, database_1.connectDatabase)();
        await (0, redis_1.connectRedis)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
