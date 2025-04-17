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
exports.setupSocketChat = void 0;
const socket_io_1 = require("socket.io");
const prisma_1 = require("../lib/prisma");
const setupSocketChat = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    let activeConnections = 0;
    io.on('connection', (socket) => {
        activeConnections++;
        console.log('Novo cliente conectado Chat:', socket.id);
        console.log('Conexões ativas Chat:', activeConnections);
        socket.on('send_chats_message', (payload, callback) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const newMessage = yield prisma_1.db.message.create({
                    data: {
                        content: payload.content,
                        userId: payload.userId,
                        channelId: payload.channelId
                    },
                    include: {
                        user: true
                    }
                });
                io.to(payload.channelId).emit('new_chat_message', newMessage);
                if (callback) {
                    callback(newMessage);
                }
            }
            catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                if (callback) {
                    callback({ error: 'Erro ao enviar mensagem' });
                }
            }
        }));
        socket.on('delete_chat_message', (messageId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield prisma_1.db.message.delete({
                    where: { id: messageId }
                });
                io.emit('deleted_chat_message', messageId);
            }
            catch (error) {
                console.error('Erro ao deletar mensagem:', error);
                socket.emit('message_error', 'Erro ao deletar mensagem');
            }
        }));
        socket.on('join_channel_room', (channelId) => {
            socket.join(channelId);
            console.log(`Usuário entrou no canal ${channelId}`);
        });
        socket.on('disconnect', () => {
            activeConnections--;
            console.log('Cliente desconectado:', socket.id);
            console.log('Conexões ativas:', activeConnections);
            io.emit('connection_count', activeConnections);
        });
    });
};
exports.setupSocketChat = setupSocketChat;
