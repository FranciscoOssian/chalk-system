import express from "express";
import httpServer from "http";
import { Server as SocketIOServer } from "socket.io";

export const http = express();
export const server = httpServer.createServer(http);
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: [""],
    credentials: true,
  },
  maxHttpBufferSize: 1e8,
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Servidor HTTP e WebSocket estão ouvindo na porta ${port}`);
});
