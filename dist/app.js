"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.prisma = exports.app = void 0;
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_friends_1 = require("./sockets/socket-friends");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
const server = (0, http_1.createServer)(app);
exports.server = server;
(0, socket_friends_1.setupSocket)(server);
