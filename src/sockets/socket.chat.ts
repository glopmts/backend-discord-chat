import { Server, Socket } from 'socket.io';
import { db } from '../lib/prisma';

interface SendMessagePayload {
  content: string;
  channelId: string;
  userId: string;
}

export const setupSocketChat = (server: any) => {

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let activeConnections = 0;

  io.on('connection', (socket: Socket) => {
    activeConnections++;
    console.log('Novo cliente conectado Chat:', socket.id);
    console.log('Conexões ativas Chat:', activeConnections);

    socket.on('send_chats_message', async (payload: SendMessagePayload, callback) => {
      try {
        const newMessage = await db.message.create({
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
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        if (callback) {
          callback({ error: 'Erro ao enviar mensagem' });
        }
      }
    });

    socket.on('delete_chat_message', async (messageId: string) => {
      try {
        await db.message.delete({
          where: { id: messageId }
        });

        io.emit('deleted_chat_message', messageId);
      } catch (error) {
        console.error('Erro ao deletar mensagem:', error);
        socket.emit('message_error', 'Erro ao deletar mensagem');
      }
    });

    socket.on('join_channel_room', (channelId: string) => {
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