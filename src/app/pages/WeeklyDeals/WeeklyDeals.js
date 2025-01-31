import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FaChevronCircleLeft, FaChevronCircleRight, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../Shared/Cart/CartProvider';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import addToWishlist from '../Wishlist/addToWishlist';

// Countdown Timer Component
const CountdownTimer = ({ expirationDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expirationDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
      {Object.keys(timeLeft).map((interval, index) => (
        <div key={index} className="p-1 sm:p-2 bg-info rounded text-white">
          <span className="countdown text-md sm:text-md font-mono">{timeLeft[interval]}</span>
          <div className="text-xs">{interval}</div>
        </div>
      ))}
    </div>
  );
};

const WeeklyDeals = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://bytezle-server.vercel.app/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(`Error fetching products: ${error.message}`);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    window.location.href = `/pages/freshdeals?product=${id}`;
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId);
  };

  const nextSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const previousSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);

  const ButtonGroup = ({ next, previous }) => (
    <>
      <button
        onClick={previous}
        className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 z-10"
      >
        <FaChevronCircleLeft size={30} />
      </button>
      <button
        onClick={next}
        className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 z-10"
      >
        <FaChevronCircleRight size={30} />
      </button>
    </>
  );

  return (
    <div className="w-full pt-8 text-center sm:p-5 p-5 bg-white rounded mb-10">
      <div className="relative ">
        <div className="text-left mb-5">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Weekly Deals</h1>
              <div style={{ width: '100px', borderBottom: '#50AA1B 8px solid' }}></div>
              <div style={{ width: '50px', borderBottom: '#FF534D 8px solid' }}></div>
            </div>
            <CountdownTimer expirationDate={expirationDate} />
          </div>
          <hr className="border-t-1 border-gray-300 mt-2" />
        </div>
        <div className="mt-4 pt-4 relative">
          <Carousel
            ref={carouselRef}
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            customTransition="all .5s"
            containerClass="carousel-container"
            itemClass="carousel-item px-1 sm:px-2"
            arrows={false}
            renderButtonGroupOutside={true}
            customButtonGroup={<ButtonGroup />}
          >
            {products.map((product) => (
              <div
                key={product._id}
                className="card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 w-72 flex-shrink-0"
                onClick={() => handleProductClick(product._id)}
              >
                {/* Image */}
                {product.images && product.images.length > 0 ? (
                  product.images[0] ? (
                    product.images[0].img ? (
                      <div className="w-full h-48 overflow-hidden relative">
                        <Image
                          src={`data:${product.images[0].contentType};base64,${product.images[0].img}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          width={300}
                          height={300}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 overflow-hidden relative">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          width={300}
                          height={300}
                        />
                      </div>
                    )
                  ) : (
                    'No Images'
                  )
                ) : (
                  'No Images'
                )}


                {/* Product Info */}
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-lg line-clamp-2">
                    {product.name
                      .toLowerCase()
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </p>
                  <span className="text-gray-500 text-sm block mt-2">EACH</span>
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <h1 className="text-yellow-600 font-bold text-xl">৳{product.price}</h1>
                      <span className="text-gray-500 line-through text-sm">৳{product.storePrice}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white rounded-full p-2 shadow-md hover:bg-yellow-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        <FaShoppingCart className="text-xl" />
                      </button>
                      <button
                        className="bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(product._id);
                        }}
                      >
                        <FaHeart className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default WeeklyDeals;
