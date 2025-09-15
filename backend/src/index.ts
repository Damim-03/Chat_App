import express from "express"
import cors from "cors";
import productRoutes from "../routes/product/product.Routes.js";
import cookieParser from "cookie-parser";
import { PORT } from "./env.js";

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: [
    'http://localhost:8081', 
    'http://localhost:19006', 
    'http://localhost:19000',
    'http://10.241.112.70:8081',
    'http://10.241.112.70:19006',
    'http://10.241.112.70:19000',
    'http://10.0.2.2:8081',
    'http://10.0.2.2:19006',
    'http://10.0.2.2:19000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/product", productRoutes)

app.listen(PORT, () => {
    console.log(`The Server is running in http://localhost:${PORT}`);
});

