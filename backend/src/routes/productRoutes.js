import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
console.log("Product Routes Loaded");

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
    try {
      const { price, moq, fabric, city, stock } = req.body;

      // Check if similar product already exists
      const existingProduct = await Product.findOne({
        price,
        moq,
        fabric,
        city,
      });

      if (existingProduct) {
        return res.status(400).json({
          message: "Product already exists with same details",
        });
      }

      // Create new product otherswise
      const product = new Product({
        image: req.file.filename,
        price: req.body.price,
        moq: req.body.moq,
        fabric: req.body.fabric,
        city: req.body.city,
        stock: req.body.stock,
      });

      await product.save();
      io.emit("newProduct", product);
      res.json(product);
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  });

  // Get All Products
  router.get("/", async (req, res) => {
    const products = await Product.find();
    res.json(products);
  });

  router.put("/:id", async (req, res) => {
    try {
      const { stock, price } = req.body;
      const updateData = {};

      if (stock !== undefined) updateData.stock = stock;
      if (price !== undefined) updateData.price = price;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          message: "At least one field (price or stock) must be provided",
        });
      }

      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true },
      );
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
      io.emit("productUpdated", updated);

      res.json(updated);
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  });

  return router;
};
