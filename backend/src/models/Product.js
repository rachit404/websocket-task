import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  image: String,
  price: Number,
  moq: Number,
  fabric: String,
  city: String,
  stock: Number,
});

export default mongoose.model("Product", productSchema);
