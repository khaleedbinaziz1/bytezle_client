"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
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
  const searchParams = useSearchParams();
  const currentProductId = searchParams.get("product"); // Get product ID from URL
  const currentProductName = searchParams.get("name"); // Get product name from URL
  const excludedProductId = currentProductId;

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!currentProductId) return;

    const fetchProductAndRelated = async () => {
      setLoading(true);
      try {
        // Fetch the current product details
        const productResponse = await axios.get(
          `https://bytezle-server.vercel.app/products/${currentProductId}`
        );
        const product = productResponse.data;
        setCurrentProduct(product);

        // Fetch related products using the subcategory
        if (product.subcategory) {
          const relatedResponse = await axios.get(
            `https://better-server-test.vercel.app/products/subcategory/${encodeURIComponent(
              product.subcategory
            )}`
          );
          const related = relatedResponse.data.filter(
            (p) => p._id !== currentProductId && p.showProduct === "On"
          );

          // Filter related products based on the product name in the URL
          const filteredRelated = related.filter((product) =>
            product.name.toLowerCase().includes(currentProductName.toLowerCase())
          );

          // Sort the filtered related products based on the name
          filteredRelated.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });

          setRelatedProducts(filteredRelated);
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
  {/* Section Title */}
  <h2 className="text-xl font-bold mb-4">Related Products</h2>

  {/* Grid Layout for Related Products */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {relatedProducts
      .filter((product) => product._id !== excludedProductId)
      .map((product) => (
        <div
          key={product._id}
          className="card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer"
          onClick={() => handleProductClick(product._id)}
        >
          {/* Image */}
          <div className="w-full h-48 overflow-hidden flex justify-center items-center">
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
            <h3 className="font-bold text-gray-900 mb-2 truncate">
              {product.name}
            </h3>
            <div className="flex justify-between items-center">
              <h1 className="text-primary font-bold">৳{product.price}</h1>
              <div className="flex space-x-2">
                <button
                  className="btn rounded-full py-1 px-4 bg-green-500"
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
