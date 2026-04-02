import e from "express";
import http from "http";
import dotenv from "dotenv";
import socketRouter from "./handlers/router.js";
import { setIO } from "./socket/socketManager.js";
import { initSocket } from "./socket/socket.js";
dotenv.config();

const app = e()
app.use(e.json())


const server = http.createServer(app)
const io = initSocket(server)
setIO(io)
app.use(socketRouter)


const PORT = process.env.PORT || 4005;
const test = ;
server.listen(PORT, () => {
  console.log(`🚀 Realtime service running on port ${PORT}`);
});

