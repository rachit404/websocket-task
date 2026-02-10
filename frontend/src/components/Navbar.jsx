import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-600/50 text-white p-4 flex gap-6 justify-center sticky top-0 z-50 backdrop-blur-sm">
      <Link className="font-semibold hover:underline" to="/">
        Home
      </Link>

      <Link className="font-semibold hover:underline" to="/upload">
        Upload Product
      </Link>

      <Link className="font-semibold hover:underline" to="/products">
        Products
      </Link>
    </nav>
  );
}
