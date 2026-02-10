import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import UploadForm from "./components/UploadForm";
import ProductList from "./components/ProductList";
function Home() {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Triexpot Live Inventory Dashboard
        </h1>

        <p className="mt-3 text-gray-600">
          Manage your products, track stock and prices in real-time with instant
          updates powered by WebSockets.
        </p>
      </div>
    </div>
  );
}
function App() {
  return (
    <div className="min-h-screen bg-slate-300">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
