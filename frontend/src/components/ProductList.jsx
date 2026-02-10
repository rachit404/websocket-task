import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../socket";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data));

    socket.on("productUpdated", (updatedProduct) => {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p,
        ),
      );
    });

    return () => socket.off("productUpdated");
  }, []);

  return (
    <div className="p-6  min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Live Inventory Dashboard
      </h2>

      {products.length === 0 && (
        <p className="text-gray-500">No products available yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold text-gray-700">
                {p.fabric}
              </h4>

              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  p.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {p.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="space-y-1 text-gray-600 text-sm">
              <p>
                <span className="font-medium">Price:</span> ₹{p.price}
              </p>

              <p>
                <span className="font-medium">MOQ:</span> {p.moq}
              </p>

              <p>
                <span className="font-medium">City:</span> {p.city}
              </p>

              <p className="text-base font-semibold text-blue-700">
                Stock: {p.stock}
              </p>
            </div>

            {p.image && (
              <img
                src={`http://localhost:5000/uploads/${p.image}`}
                alt="product"
                className="mt-4 w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
