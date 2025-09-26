import express from "express"
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth/auth.Routes.js";
import cookieParser from "cookie-parser";
import { PORT } from "./env.js";
import messagesRoutes from "./routes/message/messages.Routes.js";
import userRoutes from "./routes/user/user.Routes.js";

const app = express();

// Enable permissive CORS for development
app.use(cors({ origin: true, credentials: true }));
app.use(cors({
    origin: ["http://localhost:5173", "https://chat-app-yt.onrender.com"],
    credentials: true,
}));

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://chat-app-yt.onrender.com"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});


app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes)
app.use("/api/messages", messagesRoutes)
app.use("/api/me", userRoutes)

// Simple health check for connectivity testing
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`The Server is running in http://localhost:${PORT}`);
});

