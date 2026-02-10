import mongoose from "mongoose";

export default function connectDB(MONGO_URI, io) {
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
}
