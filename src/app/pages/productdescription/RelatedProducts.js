"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaHeart } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../Shared/Cart/CartProvider";
import addToWishlist from "../Wishlist/addToWishlist";

const RelatedProducts = () => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { addToCart } = useCart();
  const searchParams = new URLSearchParams(window.location.search);
  const currentProductId = searchParams.get("product");
  const currentProductName = searchParams.get("name");
  const excludedProductId = currentProductId;
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!currentProductId) return;
    const fetchProductAndRelated = async () => {
      setLoading(true);
      try {
        const productResponse = await axios.get(
          `https://bytezle-server.vercel.app/products/${currentProductId}`
        );
        const product = productResponse.data;
        setCurrentProduct(product);

        if (product.subcategory) {
          const relatedResponse = await axios.get(
            `https://bytezle-server.vercel.app/products/subcategory/${encodeURIComponent(
              product.subcategory
            )}`
          );
          const related = relatedResponse.data.filter(
            (p) => p._id !== currentProductId && p.showProduct === "On"
          );

          const sortedRelated = related.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            const query = currentProductName.toLowerCase();
            if (nameA.includes(query) && !nameB.includes(query)) return -1;
            if (!nameA.includes(query) && nameB.includes(query)) return 1;
            return 0;
          });
          setRelatedProducts(sortedRelated);
        }
      } catch (error) {
        console.error("Error fetching product or related products:", error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [currentProductId, currentProductName]);

  const handleProductClick = (id) => {
    router.push(`?product=${id}&name=${currentProductName}`, undefined, { shallow: true });
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

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h1>

      {/* Left Arrow Button */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
      >
        <FaArrowLeft className="text-gray-700" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-6 px-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {relatedProducts
          .filter((product) => product._id !== excludedProductId)
          .map((product) => (
            <div
              key={product._id}
              className="card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex-none w-64 snap-start"
              onClick={() => handleProductClick(product._id)}
            >
              {/* Image */}
              <div className="w-full h-48 flex items-center justify-center p-4 bg-gray-50">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  width={200}
                  height={200}
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-primary">৳{product.price}</p>
                  <div className="flex space-x-2">
                    <button
                      className="p-2 rounded-full bg-primary hover:bg-green-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <FaShoppingCart className="text-white" />
                    </button>
                    <button
                      className="p-2 rounded-full bg-red-500 hover:bg-yellow-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(product._id);
                      }}
                    >
                      <FaHeart className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Right Arrow Button */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
      >
        <FaArrowRight className="text-gray-700" />
      </button>
    </div>
  );
};

export default RelatedProducts;