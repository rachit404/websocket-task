import express from "express";
import multer from "multer";
console.log("Product Routes Loaded");
import Product from "../models/Product.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

export default (io) => {
  // Create Product
  router.post("/", upload.single("image"), async (req, res) => {
    const product = new Product({
      image: req.file.filename,
      price: req.body.price,
      moq: req.body.moq,
      fabric: req.body.fabric,
      city: req.body.city,
      stock: req.body.stock,
    });

    await product.save();

    res.json(product);
  });

  // Get All Products
  router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
  });

  // Update Stock
  router.put("/stock/:id", async (req, res) => {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: req.body.stock },
      { new: true },
    );

    // 🔥 EMIT SOCKET EVENT
    io.emit("productUpdated", updated);

    res.json(updated);
  });

  return router;
};
