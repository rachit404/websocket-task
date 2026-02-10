import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/db.js";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./src/routes/productRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL;

const io = new Server(server, {
  cors: { origin: CLIENT_URL },
});

app.use(
  cors({
    origin: CLIENT_URL,
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
connectDB(MONGO_URI, io);

app.use("/api/products", productRoutes(io));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
