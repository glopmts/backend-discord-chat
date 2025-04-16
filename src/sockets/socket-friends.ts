import { Server, Socket } from 'socket.io';
import { db } from '../lib/prisma';

interface SendMessagePayload {
  content: string;
  sendId: string;
  receivesId: string;
}

export const setupSocket = (server: any) => {

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let activeConnections = 0;

  io.on('connection', (socket: Socket) => {
    activeConnections++;
    console.log('Novo cliente conectado:', socket.id);
    console.log('Conexões ativas:', activeConnections);

    socket.on('send_friend_message', async (payload: SendMessagePayload) => {
      try {
        const newMessage = await db.messageFriends.create({
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
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        socket.emit('message_error', 'Erro ao enviar mensagem');
      }
    });

    socket.on('delete_friend_message', async (messageId: string) => {
      try {
        await db.messageFriends.delete({
          where: { id: messageId }
        });

        io.emit('deleted_friend_message', messageId);
      } catch (error) {
        console.error('Erro ao deletar mensagem:', error);
        socket.emit('message_error', 'Erro ao deletar mensagem');
      }
    });

    socket.on('join_user_room', (userId: string) => {
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