const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const PORT = process.env.PORT || 5005;

// Crear servidor HTTP a partir de la app de Express
const server = http.createServer(app);

// Inicializar socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // o tu frontend: 'http://localhost:3000'
    methods: ["GET", "POST"],
  },
});

// Manejo de conexiones WebSocket
io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado:", socket.id);

  socket.on("location", (data) => {
    const userData = { ...data, id: socket.id };
    console.log("📡 Reenviando ubicación:", userData); // <-- Este log
    socket.broadcast.emit("location", userData);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado:", socket.id);
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
