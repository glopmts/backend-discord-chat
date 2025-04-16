import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from "dotenv";
import express from 'express';
import { createServer } from "http";
import { setupSocket } from './sockets/socket-friends';

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const server = createServer(app);

setupSocket(server);

export { app, prisma, server };

