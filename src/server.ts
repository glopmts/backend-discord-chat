import dotenv from "dotenv";
import { server } from './app';
import { setupSocket } from "./sockets/socket-friends";

dotenv.config();

setupSocket(server);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});