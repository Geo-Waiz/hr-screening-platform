"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const client_1 = require("@prisma/client");
exports.prisma = globalThis.__prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = exports.prisma;
}
async function connectDatabase() {
    try {
        await exports.prisma.$connect();
        console.log('✅ Database connected successfully');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
}
async function disconnectDatabase() {
    await exports.prisma.$disconnect();
}
