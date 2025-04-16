"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChannelMessage = createChannelMessage;
exports.getChannelMessages = getChannelMessages;
const prisma_1 = require("../lib/prisma");
function createChannelMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { content, userId, channelId, image } = req.body;
            const newMessage = yield prisma_1.db.message.create({
                data: { content, userId, channelId, image },
                include: { user: true },
            });
            res.status(201).json(newMessage);
        }
        catch (error) {
            console.error('Error creating channel message:', error);
            res.status(500).json({ error: 'Error creating message' });
        }
    });
}
function getChannelMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { channelId } = req.params;
            const messages = yield prisma_1.db.message.findMany({
                where: { channelId },
                include: { user: true },
                orderBy: { createdAt: 'asc' },
            });
            res.status(200).json(messages);
        }
        catch (error) {
            console.error('Error fetching channel messages:', error);
            res.status(500).json({ error: 'Error fetching messages' });
        }
    });
}
