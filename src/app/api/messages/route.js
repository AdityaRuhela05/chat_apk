import { Server } from "socket.io";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

let io;

export async function GET() {
  if (!io) {
    io = new Server(3001, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    const users = {};

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);

      socket.on("register_user", (username) => {
        users[username] = socket.id;
        console.log(`✅ User registered: ${username} -> ${socket.id}`);
      });

      socket.on("send_message", async ({ sender, receiver, text }) => {
        await connectDB();

        console.log(`📩 Message from ${sender} to ${receiver}: ${text}`);

        await Message.create({
          sender,
          receiver,
          text,
          timestamp: new Date(),
        });

        const receiverSocketId = users[receiver];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", { sender, text });
        }
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
      });
    });

    console.log("✅ Socket.io Server Running on port 3001");
  }

  return new Response("Socket.io Server Running", { status: 200 });
}
