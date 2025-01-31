import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaShoppingCart, FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import shoppingcart from '../../../images/li_shopping-cart.svg';
import { useCart } from '../Shared/Cart/CartProvider';
import Cart from '../Shared/Cart/Cart';
import ProductDescription from '../productdescription/page';
import bannerImage from './BABY-BANNER.png';
import addToWishlist from '../Wishlist/addToWishlist'; 

const BabyiItem = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Added state for loading
  const [error, setError] = useState(null);
  const itemsPerPage = 10; // Number of items per page
  const router = useRouter();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const selectedProductId = searchParams.get('product');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get('https://bytezle-server.vercel.app/products');
        
        // Filter products to only include those in "Baby Care" category and with showProduct = "On"
        const categories = ['Baby Care'];
        const filteredProducts = response.data.filter(
          (product) => categories.includes(product.category) && product.showProduct === "On"
        );
        
        setProducts(filteredProducts);
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(`Error fetching products: ${error.message}`);
      } finally {
        setLoading(false); // End loading
      }
    };
  
    fetchProducts();
  }, []);
  

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId); // Call the function to add product to wishlist
  };

  const handleProductClick = (id) => {
    router.push(`pages/freshdeals/?product=${id}`, undefined, { shallow: true });
  };

  const handleBackClick = () => {
    router.push('/', undefined, { shallow: true });
  };

  const handleAddToCart = (product) => {
    // Pass a default quantity of 1
    addToCart(product, 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="mx-auto p-4 pt-5 mt-5 text-center rounded bg-white">
      <div className="text-left mb-5 flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold">Baby World</h1>
  </div>
  <button 
    className="bg-#FFD601-500 text-white font-bold text-lg py-2 px-4 rounded-lg hover:bg-#FFD601-600 transition duration-300 ease-in-out shadow-md"
    onClick={() => router.push('/pages/freshdeals?category=Baby%20Care')}
  >
    View All
  </button>
</div>

      
      {/* Banner Image */}
      <div className="mb-5">
        <Image 
          src={bannerImage} 
          alt="Banner" 
          className="w-full rounded-lg object-cover" // Added responsive styles
        />
      </div>

      <Cart />

      {selectedProductId ? (
        <>
          <button onClick={handleBackClick} className="btn btn-secondary mb-4">
            <FaArrowLeft />
          </button>
          <ProductDescription id={selectedProductId} />
        </>
      ) : (
        <>
          {error && <div className="text-red-500">{error}</div>}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6" style={{ marginTop: '40px' }}>
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="card skeleton bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer mb-6 sm:mb-0 relative">
                  <div className="h-48 bg-gray-300 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-300 animate-pulse mb-2"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-300 animate-pulse w-1/4"></div>
                      <div className="h-6 bg-gray-300 animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6" style={{ marginTop: '40px' }}>
              {products.slice(startIndex, endIndex).map(product => (
                <div key={product._id} className="card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer mb-6 sm:mb-0 items-between" onClick={() => handleProductClick(product._id)}>

              {product.images && product.images.length > 0 ? (
                      product.images[0] ? (
                        product.images[0].img ? (
                          <div className="w-40 h-32 overflow-hidden p-2 flex justify-center">
                            <Image 
                              src={`data:${product.images[0].contentType};base64,${product.images[0].img}`} 
                              alt={product.name} 
                              className='w-full h-40 object-contain flex justify-center' 
                              width='100' 
                              height='100' 
                            />
                          </div>
          ) : (
            <div className="w-full h-32 overflow-hidden p-2 flex justify-center">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                className='w-full h-full object-contain flex justify-center' 
                width='100' 
                height='100' 
              />
            </div>
          )
        ) : (
          'No Images'
        )
      ) : (
        'No Images'
      )}

                  <div className="p-4">
                    <p className="font-bold text-gray-900 mb-2 text-base truncate-multiline">
                      {product.name
                        .toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </p>
                    <span className="text-gray-500 text-sm font-extrabold block text-center">
                      EACH
                    </span>

                    {/* Price and Buttons */}
                    <div className="flex flex-col lg:flex-row justify-center items-center lg:justify-between mt-2">
                      <div className="flex justify-center items-center">
                        <h1 className="text-primary font-bold pt-2 lg:pt-0 lg:text-left" style={{ fontSize: '20px' }}>
                          ৳{product.price}
                        </h1>
                        <span className="text-gray-500 line-through ml-4 mr-0.5 text-sm">
                        ৳{product.storePrice}
                      </span>
                      </div>

                      {/* Buttons Positioned Below Price on Small Screens, Inline on Larger Screens */}
                      <div className="flex justify-center sm:justify-end mt-2 sm:mt-0 space-x-2">
                        <button
                            className="btn rounded-full py-1 px-4"
                            style={{ backgroundColor: '#50AA1B' }} // Custom background color for "Add to Cart"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                            }}>
                            <FaShoppingCart className="text-white text-xl" /> {/* Increased icon size */}
                        </button>
                        <button
                            className="btn rounded-full py-1 px-4"
                            style={{ backgroundColor: '#FFD700' }} // Custom background color for "Add to Wishlist"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToWishlist(product._id);
                            }}>
                            <FaHeart className="text-white text-xl" /> {/* Increased icon size */}
                        </button>
                    </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BabyiItem;
