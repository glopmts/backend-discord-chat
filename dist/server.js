"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const socket_friends_1 = require("./sockets/socket-friends");
dotenv_1.default.config();
(0, socket_friends_1.setupSocket)(app_1.server);
const PORT = process.env.PORT || 5001;
app_1.server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
