import { Request, Response } from 'express';
import { db } from '../lib/prisma';

export async function createChannelMessage(req: Request, res: Response) {
  try {
    const { content, userId, channelId, image } = req.body;

    const newMessage = await db.message.create({
      data: { content, userId, channelId, image },
      include: { user: true },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating channel message:', error);
    res.status(500).json({ error: 'Error creating message' });
  }
}

export async function getChannelMessages(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const messages = await db.message.findMany({
      where: { channelId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching channel messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
}