import { Server as SocketIO } from "socket.io";


let io;

const initializeSocket = (server) => {
  io = new SocketIO(server, {
    cors: {
        origin: "*", // Ajusta según tu necesidad
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Cliente WebSocket conectado.");
  
    // Escucha el evento que el cliente usa para unirse a la room
    socket.on("joinRoom", (userId) => {
      console.log(`Usuario con ID ${userId} se une a la room ${userId}.`);
      socket.join(userId);
    });
  
    socket.on("disconnect", () => {
      console.log("Cliente WebSocket desconectado.");
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export { initializeSocket, getIo };