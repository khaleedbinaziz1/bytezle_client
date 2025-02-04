import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import { useCart } from '../Shared/Cart/CartProvider';
import Cart from '../Shared/Cart/Cart';
import ProductDescription from '../productdescription/page';
import addToWishlist from '../Wishlist/addToWishlist';
import bannerImage from '../../../images/free_delivery.gif'

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { addToCart } = useCart();

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
    // Ensure productName is defined and is a string
    if (typeof productName === 'string') {
      // Extract the first word from the product name
      const firstWord = productName.split(' ')[0];
      // Pass both the product ID and the first word in the URL
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
  };

  const scrollLeft = () => {
    document.getElementById('scrollable-container').scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    document.getElementById('scrollable-container').scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  };

  return (
<div className="mx-auto p-4 pt-5 mt-5 text-center rounded bg-white">
  {/* Banner Image */}
  <div className="mb-5">
    <Image
      src={bannerImage}
      alt="Banner"
      className="w-full rounded-lg object-cover" // Added responsive styles
    />
  </div>
  <div className="text-left mb-5"></div>
  <Cart />
  {loading ? (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
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
        onClick={scrollRight}
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
            className="card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 w-48 flex-shrink-0"
            onClick={() => handleProductClick(product._id,product.name)}
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
                  <h1 className="text-yellow-600 font-bold text-lg">
                    ৳{product.price}
                  </h1>
                  <span className="text-gray-500 line-through text-xs">
                    ৳{product.storePrice}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    className="bg-yellow-500 text-white rounded-full p-1 shadow-md hover:bg-yellow-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <FaShoppingCart className="text-lg" />
                  </button>
                  <button
                    className="bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
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
        onClick={scrollLeft}
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