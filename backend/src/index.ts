import express from "express"
import cors from "cors";
import productRoutes from "./routes/product/product.Routes.js";
import salesRoutes from "./routes/sales/sales.Routes.js"
import cookieParser from "cookie-parser";
import { PORT } from "./env.js";

const app = express();

// Enable permissive CORS for development
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/product", productRoutes)
app.use("/api/sales", salesRoutes);

// Simple health check for connectivity testing
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`The Server is running in http://localhost:${PORT}`);
});

