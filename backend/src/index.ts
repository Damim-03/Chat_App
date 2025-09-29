import express from "express"
import cors from "cors";
import authRoutes from "./routes/auth/auth.Routes.js";
import cookieParser from "cookie-parser";
import { PORT } from "./env.js";
import messagesRoutes from "./routes/message/messages.Routes.js";
import userRoutes from "./routes/user/user.Routes.js";
import path from "node:path";

const app = express();

const __dirname = path.resolve();

// Enable permissive CORS for development
app.use(cors({ origin: true, credentials: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})


app.use("/api/auth", authRoutes)
app.use("/api/messages", messagesRoutes)
app.use("/api/me", userRoutes)

// Simple health check for connectivity testing
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

if (process.env.NODE_ENV !== "development") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`The Server is running in http://localhost:${PORT}`);
});

