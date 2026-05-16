import { io } from "socket.io-client";

const socket = io(
  "https://complaintms-backend-7d29.onrender.com",
  {
    transports: [
      "websocket",
    ],
  }
);

export default socket;