"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.connectRedis = connectRedis;
const ioredis_1 = __importDefault(require("ioredis"));
exports.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
async function connectRedis() {
    try {
        await exports.redis.ping();
        console.log('✅ Redis connected successfully');
    }
    catch (error) {
        console.error('❌ Redis connection failed:', error);
        throw error;
    }
}
exports.redis.on('error', (error) => {
    console.error('Redis error:', error);
});
exports.default = exports.redis;
