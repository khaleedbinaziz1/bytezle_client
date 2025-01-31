"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaHeart } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../Shared/Cart/CartProvider";
import Cart from "../Shared/Cart/Cart";
import addToWishlist from "../Wishlist/addToWishlist";

const RelatedProducts = () => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const currentProductId = searchParams.get("product"); // Get product ID from URL
  const excludedProductId = searchParams.get("product");

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!currentProductId) return;

    const fetchProductAndRelated = async () => {
      setLoading(true);
      try {
        // Fetch the current product details
        const productResponse = await axios.get(
          `http://localhost:500/products/${currentProductId}`
        );
        const product = productResponse.data;
        setCurrentProduct(product);

        // Fetch related products using the subcategory
        if (product.subcategory) {
          const relatedResponse = await axios.get(
            `http://localhost:500/products/subcategory/${encodeURIComponent(
              product.subcategory
            )}`
          );
          const related = relatedResponse.data.filter(
            (p) => p._id !== currentProductId && p.showProduct === "On"
          );
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product or related products:", error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [currentProductId]);

  const handleProductClick = (id) => {
    router.push(`?product=${id}`, undefined, { shallow: true });
  };

  const handleBackClick = () => {
    router.push("/");
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId);
  };

  // Scroll functions for arrows
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">Related Products</h2>
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
      >
        <FaArrowLeft className="text-gray-700 text-xl" />
      </button>
      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
      >
        <FaArrowRight className="text-gray-700 text-xl" />
      </button>
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-4 px-2"
      >
        {relatedProducts
          .filter((product) => product._id !== excludedProductId)
          .map((product) => (
            <div
              key={product._id}
              className="card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer flex-none w-64"
              onClick={() => handleProductClick(product._id)}
            >
              {/* Image */}
              <div className="w-full h-32 overflow-hidden p-2 flex justify-center">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-32 object-contain"
                  width={100}
                  height={100}
                />
              </div>
              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {product.shortDescription}
                </p>
                <div className="flex justify-between items-center">
                  <h1 className="text-primary font-bold">৳{product.price}</h1>
                  <div className="flex space-x-2">
                    <button
                      className="btn rounded-full py-1 px-4 bg-#FFD601-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <FaShoppingCart className="text-white text-xl" />
                    </button>
                    <button
                      className="btn rounded-full py-1 px-4 bg-yellow-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product._id);
                      }}
                    >
                      <FaHeart className="text-white text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RelatedProducts;