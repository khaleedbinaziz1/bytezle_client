import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import { useCart } from '../Shared/Cart/CartProvider';
import Cart from '../Shared/Cart/Cart';
import ProductDescription from '../productdescription/page';
import addToWishlist from '../Wishlist/addToWishlist';
import bannerImage from '../../../images/free_delivery.gif';
import { FaCheck } from "react-icons/fa"; // Import the check icon

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false); // State for toast visibility

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://bytezle-server.vercel.app/products');
        const dipsAndSpreads = response.data.filter((product) => product.Pick === 'On');
        setProducts(dipsAndSpreads);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(`Error fetching products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId);
  };

  const handleProductClick = (id, productName) => {
    if (typeof productName === 'string') {
      const firstWord = productName.split(' ')[0];
      router.push(`/pages/freshdeals?product=${id}&name=${encodeURIComponent(firstWord)}`, undefined, { shallow: true });
    } else {
      console.error('Product name is undefined or not a string:', productName);
    }
  };

  const handleBackClick = () => {
    router.push('/', undefined, { shallow: true });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setShowToast(true); // Show toast after adding product
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };

  // Scroll functionality
  const scrollLeft = () => {
    const scrollContainer = document.getElementById('scrollable-container');
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    const scrollContainer = document.getElementById('scrollable-container');
    if (scrollContainer) {
      scrollContainer.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // Auto-scroll the container every 3 seconds
    const interval = setInterval(() => {
      const scrollContainer = document.getElementById('scrollable-container');
      if (scrollContainer) {
        scrollContainer.scrollBy({
          left: 300, // Adjust the scroll distance as needed
          behavior: 'smooth',
        });
      }
    }, 1500); // Scroll every 3 seconds

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto   text-center rounded bg-white">
      {/* Banner Image */}
      <div className="mb-5">
        <Image
          src={bannerImage}
          alt="Banner"
          className="w-full rounded-lg object-cover"
        />
      </div>
      <div className="text-left mb-5"></div>
      <Cart />
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-10">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="card skeleton bg-gray-100 rounded-lg overflow-hidden shadow-md animate-pulse"
            >
              <div className="h-32 bg-gray-300"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-lg"
          >
            <FaArrowLeft />
          </button>

          {/* Scrollable Container */}
          <div
            id="scrollable-container"
            className="flex overflow-x-auto space-x-4 mt-10 scrollbar-hide p-5"
          >
            {products.map((product) => (
              <div
                key={product._id}
                className="card bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-300 w-40 sm:w-48 md:w-56 flex-shrink-0"
                onClick={() => handleProductClick(product._id, product.name)}
              >
                {/* Image */}
                {product.images && product.images.length > 0 ? (
                  product.images[0] ? (
                    product.images[0].img ? (
                      <div className="w-full h-32 overflow-hidden relative">
                        <Image
                          src={`data:${product.images[0].contentType};base64,${product.images[0].img}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          width={200}
                          height={200}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 overflow-hidden relative">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          width={200}
                          height={200}
                        />
                      </div>
                    )
                  ) : (
                    "No Images"
                  )
                ) : (
                  "No Images"
                )}

                {/* Product Info */}
                <div className="p-2">
                  <p className="font-semibold text-gray-900 text-md line-clamp-2">
                    {product.name
                      .toLowerCase()
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </p>
                  <span className="text-gray-500 text-xs block mt-1">EACH</span>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <h1 className="text-gray-900 font-bold text-lg">
                        ৳{product.price}
                      </h1>
                      <span className="text-gray-500 line-through text-xs">
                        ৳{product.storePrice}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {showToast && (
                        <div className="fixed inset-0 flex justify-center items-center z-1050">
                          <div className="bg-teal-500 text-white py-2 px-6 rounded-lg shadow-lg flex items-center">
                            <FaCheck className="mr-2 text-lg" /> {/* Tick mark icon */}
                            Product added to cart!
                          </div>
                        </div>
                      )}
                      <button
                        className="bg-gray-200 text-gray-600 rounded-full p-1 shadow-sm hover:bg-gray-300 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        <FaShoppingCart className="text-lg" />
                      </button>
                      <button
                        className="bg-gray-200 text-gray-600 rounded-full p-1 shadow-sm hover:bg-gray-300 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(product._id);
                        }}
                      >
                        <FaHeart className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-lg"
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
