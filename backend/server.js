import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import path, { dirname } from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { ACTIONS } from "./actions.js";
import connectDB from "./database/mdb.js";
import roomRoute from "./routes/room.route.js";
import userRoute from "./routes/user.route.js";

dotenv.config();

const options = {
  origin: ["https://voice-room.vercel.app"],
  credentials: true,
};
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://voice-room.vercel.app",
    methods: ["GET", "POST"],
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use("/storage", express.static(path.join(__dirname, "storage")));
app.use(morgan("dev"));
app.use(cors(options));

await connectDB();

app.use("/api/user", userRoute);
app.use("/api/room", roomRoute);

app.all("/", (req, res) => {
  res.json("Hello from voice room!");
});

app.get("*", (req, res) => {
  res.json("We are having trouble to find the route!");
});

const socketUserMap = {};

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMap[socket.id] = user;
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMap[clientId],
      });
    });
    socket.join(roomId);
  });

  //handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  //handle relay sdp (session description)
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  //handle mute & unmute
  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.UNMUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  //leaving the room
  const leaveRoom = ({ roomId }) => {
    const { rooms } = socket;

    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMap[socket.id]?.id,
        });
        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMap[clientId]?.id,
        });
      });
      socket.leave(roomId);
    });
    delete socketUserMap[socket.id];
  };
  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on("disconnecting", leaveRoom);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
