import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const loadProduct = async () => {
    const res = await api.get("/products/");
    const p = res.data.find((item) => item._id === id);
    setProduct(p);
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }

    const res = await api.post("/cart/add", {
      userId,
      productId: product._id,
    });

    const total = res.data.cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    localStorage.setItem("cartCount", total);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 h-72 md:h-96 bg-gray-50 rounded-xl flex items-center justify-center p-4">
          <img
            src={
              product.image ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
            }
            alt={product.title}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60";
            }}
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {product.category || "General"}
            </span>
            <h1 className="text-3xl font-bold mt-2 text-gray-900">{product.title}</h1>
            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
            <p className="text-2xl font-bold text-gray-900 mt-6">${product.price}</p>
            <p className="text-sm text-gray-500 mt-1">
              Status:{" "}
              <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </p>
          </div>

          <button
            onClick={addToCart}
            disabled={product.stock <= 0}
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}