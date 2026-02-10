import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
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
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect(MONGO_URI).then(() => console.log("MongoDB Connected"));

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established");

  const productCollection = mongoose.connection.collection("products");

  const changeStream = productCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "update") {
      console.log("Product updated:", change.documentKey._id);
      const updatedFields = change.updateDescription.updatedFields;

      // Emit event only if price OR stock changed
      if (updatedFields.price || updatedFields.stock) {
        io.emit("productUpdated", {
          _id: change.documentKey._id,
          ...updatedFields,
        });
      }
    }
  });
});

app.use("/api/products", productRoutes(io));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
