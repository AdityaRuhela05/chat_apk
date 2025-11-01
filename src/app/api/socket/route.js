import { Server } from "socket.io";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

const users = {}; // { username: socket.id }
let io;

export async function GET() {
  if (io) {
    return new Response("Socket.io already running");
  }

  io = new Server(3001, {
    cors: { origin: "*" },
  });

  console.log("✅ Socket.io Server Running on port 3001");

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Register user
    socket.on("register_user", (username) => {
      users[username] = socket.id;
      console.log(`✅ User registered: ${username} -> ${socket.id}`);
    });

    // Handle private messages
    socket.on("send_message", async ({ sender, receiver, text }) => {
      console.log(`📩 Message from ${sender} to ${receiver}: ${text}`);

      await connectDB();
      await Message.create({
        sender,
        receiver,
        text,
        timestamp: new Date(),
      });

      const receiverSocketId = users[receiver];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", {
          sender,
          text,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
      for (let username in users) {
        if (users[username] === socket.id) {
          delete users[username];
        }
      }
    });
  });

  return new Response("Socket server started");
}
