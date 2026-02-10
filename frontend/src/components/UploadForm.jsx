import axios from "axios";
import { useState, useRef } from "react";

export default function UploadForm() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    try {
      await axios.post("http://localhost:5000/api/products", data);

      setForm({});
      formRef.current.reset();

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      alert("Error uploading product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6  flex justify-center">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Add New Product
        </h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Image
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition cursor-pointer">
            <input
              type="file"
              className="hidden"
              id="imageUpload"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              required
            />

            <label htmlFor="imageUpload" className="cursor-pointer">
              <p className="text-gray-600">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
            </label>

            {form.image && (
              <div className="mt-4">
                <p className="text-sm text-green-600 font-medium">
                  Selected: {form.image.name}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            placeholder="Enter Price"
            className="w-full border rounded-lg p-2 focus:outline-blue-400"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">MOQ</label>
          <input
            type="number"
            placeholder="Minimum Order Quantity"
            className="w-full border rounded-lg p-2 focus:outline-blue-400"
            onChange={(e) => setForm({ ...form, moq: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fabric</label>
          <input
            placeholder="Fabric Type"
            className="w-full border rounded-lg p-2 focus:outline-blue-400"
            onChange={(e) => setForm({ ...form, fabric: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            placeholder="City Name"
            className="w-full border rounded-lg p-2 focus:outline-blue-400"
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            placeholder="Available Stock"
            className="w-full border rounded-lg p-2 focus:outline-blue-400"
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
        </div>
        {success && (
          <div className="flex items-center gap-2 text-green-700 bg-green-100 border border-green-300 p-2 rounded-lg">
            <span className="text-lg">✔</span>
            <span className="font-medium">Product uploaded successfully</span>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded-lg text-white font-semibold transition-all cursor-pointer ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
}
