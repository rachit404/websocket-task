import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../socket";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const updateProduct = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, editValues);

      // Clear edit mode
      setEditingId(null);
      setEditValues({});
    } catch (error) {
      alert("Failed to update product");
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditValues({
      price: product.price,
      stock: product.stock,
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data));

    //! Socket Logic
    socket.on("productUpdated", (updatedProduct) => {
      console.log("Received product update:", updatedProduct);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p,
        ),
      );
    });

    socket.on("newProduct", (newProduct) => {
      console.log("Received new product:", newProduct);
      setProducts((prev) => {
        if (!prev.find((p) => p._id === newProduct._id)) {
          return [...prev, newProduct];
        }
        return prev;
      });
    });

    return () => {
      socket.off("productUpdated");
      socket.off("newProduct");
    };
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
            <div className="mt-3 bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    Price
                    <button
                      onClick={() => startEditing(p)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ✏️
                    </button>
                  </p>

                  {editingId === p._id ? (
                    <input
                      type="number"
                      className="border rounded p-1 w-full"
                      value={editValues.price}
                      onChange={(e) =>
                        setEditValues({ ...editValues, price: e.target.value })
                      }
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">₹{p.price}</p>
                  )}
                </div>

                <div>
                  <p className="text-gray-500 text-sm">City</p>
                  <p className="font-semibold text-gray-800">{p.city}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">MOQ</p>
                  <p className="font-semibold text-gray-800">{p.moq}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    Stock
                    <button
                      onClick={() => startEditing(p)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ✏️
                    </button>
                  </p>

                  {editingId === p._id ? (
                    <input
                      type="number"
                      className="border rounded p-1 w-full"
                      value={editValues.stock}
                      onChange={(e) =>
                        setEditValues({ ...editValues, stock: e.target.value })
                      }
                    />
                  ) : (
                    <p
                      className={`font-bold ${
                        p.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {p.stock}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {editingId === p._id && (
              <button
                onClick={() => updateProduct(p._id)}
                className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Update
              </button>
            )}

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
