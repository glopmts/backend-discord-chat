import { Request, Response } from 'express';
import { db } from '../lib/prisma';

export async function createFriendMessage(req: Request, res: Response) {
  try {
    const { content, sendId, receivesId, image } = req.body;

    const newMessage = await db.messageFriends.create({
      data: { content, sendId, receivesId, image },
      include: {
        sendUser: true,
        receivesFriends: true
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating friend message:', error);
    res.status(500).json({ error: 'Error creating message' });
  }
}