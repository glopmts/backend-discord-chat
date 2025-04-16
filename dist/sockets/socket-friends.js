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
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const prisma_1 = require("../lib/prisma");
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    let activeConnections = 0;
    io.on('connection', (socket) => {
        activeConnections++;
        console.log('Novo cliente conectado:', socket.id);
        console.log('Conexões ativas:', activeConnections);
        socket.on('send_friend_message', (payload) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const newMessage = yield prisma_1.db.messageFriends.create({
                    data: {
                        content: payload.content,
                        sendId: payload.sendId,
                        receivesId: payload.receivesId
                    },
                    include: {
                        sendUser: true,
                        receivesFriends: true
                    }
                });
                io.to(payload.sendId).emit('new_friend_message', newMessage);
                io.to(payload.receivesId).emit('new_friend_message', newMessage);
                console.log(`Mensagem enviada de ${payload.sendId} para ${payload.receivesId}`);
            }
            catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                socket.emit('message_error', 'Erro ao enviar mensagem');
            }
        }));
        socket.on('delete_friend_message', (messageId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield prisma_1.db.messageFriends.delete({
                    where: { id: messageId }
                });
                io.emit('deleted_friend_message', messageId);
            }
            catch (error) {
                console.error('Erro ao deletar mensagem:', error);
                socket.emit('message_error', 'Erro ao deletar mensagem');
            }
        }));
        socket.on('join_user_room', (userId) => {
            socket.join(userId);
            console.log(`Usuário ${userId} entrou na sala`);
        });
        socket.on('disconnect', () => {
            activeConnections--;
            console.log('Cliente desconectado:', socket.id);
            console.log('Conexões ativas:', activeConnections);
            io.emit('connection_count', activeConnections);
        });
    });
};
exports.setupSocket = setupSocket;
