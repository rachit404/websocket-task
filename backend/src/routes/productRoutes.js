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
