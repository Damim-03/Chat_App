import express from "express"
import dotenv from "dotenv"
import authRoutes from "../routes/auth.Routes.js";
import messageRoutes from "../routes/message.Routes.js";

const app = express();
dotenv.config();

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

