const express = require("express");

const dotenv = require("dotenv");

const cors = require("cors");

const morgan = require("morgan");

const path = require("path");

const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();


// HTTP Server
const server =
  http.createServer(app);


// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",

  "https://online-complaint-management-system-nine.vercel.app",

  "https://online-complaint-management-system-ed6710kws.vercel.app",
];
// Socket.io
const io = new Server(server, {
  cors: {
    origin:
      allowedOrigins,

    methods: [
      "GET",
      "POST",
    ],

    credentials: true,
  },
});


// Store connected users
global.onlineUsers = {};


// Socket Connection
io.on("connection", (socket) => {
  console.log(
    "User Connected:",
    socket.id
  );

  // Join User
  socket.on(
    "join",
    (userId) => {
      global.onlineUsers[
        userId
      ] = socket.id;

      console.log(
        "Online Users:",
        global.onlineUsers
      );
    }
  );

  // Realtime Typing
  socket.on(
    "typing",
    (data) => {
      socket.broadcast.emit(
        "typing",
        data
      );
    }
  );

  // Stop Typing
  socket.on(
    "stopTyping",
    (data) => {
      socket.broadcast.emit(
        "stopTyping",
        data
      );
    }
  );

  // Disconnect
  socket.on(
    "disconnect",
    () => {
      for (const userId in global.onlineUsers) {
        if (
          global.onlineUsers[
            userId
          ] === socket.id
        ) {
          delete global
            .onlineUsers[
            userId
          ];
        }
      }

      console.log(
        "User Disconnected"
      );
    }
  );
});


// Middleware
app.use(
  cors({
    origin:
      allowedOrigins,

    credentials: true,
  })
);

app.use(express.json());

app.use(morgan("dev"));


// Static Upload Folder
app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);


// Make io globally available
global.io = io;


// Routes
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/users",
  require("./routes/userRoutes")
);

app.use(
  "/api/complaints",
  require("./routes/complaintRoutes")
);


// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});


const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});