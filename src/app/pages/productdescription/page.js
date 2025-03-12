"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../Shared/Cart/CartProvider";
import RelatedProducts from "./RelatedProducts";
import { FaCheck } from "react-icons/fa"; // Import the check icon
import { useRouter } from 'next/navigation';

const ProductDescription = ({ id }) => {
  const [product, setProduct] = useState(null);
  const [wholesaleQuantity, setQuantity] = useState(1);
  const [isWholesale, setIsWholesale] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [calculation, setCalculation] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showToast, setShowToast] = useState(false); // State for toast visibility
  const imageRef = useRef(null);
  const router = useRouter()

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://bytezle-server.vercel.app/products/${id}`);
        setProduct(response.data);
        setSelectedColor(response.data.color ? response.data.color[0] : null);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (isWholesale && product) {
      setQuantity(parseInt(product.wholesaleQuantity, 10));
    } else {
      setQuantity(1);
    }
  }, [isWholesale, product]);

  useEffect(() => {
    if (isWholesale && product) {
      const savings =
        (product.price - product.wholesalePrice) * wholesaleQuantity;
      setCalculation(savings);
    } else {
      setCalculation(0);
    }
  }, [wholesaleQuantity, isWholesale, product]);

  const handleQuantityChange = (type) => {
    const wholesaleQty = parseInt(product?.wholesaleQuantity, 10);
    setQuantity((prev) => {
      if (type === "increase") return prev + 1;
      if (type === "decrease") {
        if (isWholesale && prev > wholesaleQty) return prev - 1;
        if (!isWholesale && prev > 1) return prev - 1;
      }
      return prev;
    });
  };

  const handleAddToCart = () => {
    if (product && addToCart) {
      const productToAdd = {
        ...product,
        color: selectedColor,
        type: isWholesale ? "wholesale" : "retail",
        price: isWholesale ? product.wholesalePrice : product.price,
      };
      addToCart(productToAdd, wholesaleQuantity);
      // setShowToast(true); // Show toast after adding product
      // setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
    }
  };
  const handleBuyNow = () => {
    if (product && addToCart) {
      const productToAdd = {
        ...product,
        color: selectedColor,
        type: isWholesale ? "wholesale" : "retail",
        price: isWholesale ? product.wholesalePrice : product.price,
      };
      addToCart(productToAdd, wholesaleQuantity); // Add the product to the cart
      // Store cart items in localStorage or session
      localStorage.setItem('cartDetails', JSON.stringify({ items: [{...productToAdd, quantity: wholesaleQuantity}], total: (productToAdd.price * wholesaleQuantity).toFixed(0) }));
      // Navigate to checkout page
      router.push('/checkout');
    }
  };
  

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  if (!product) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 text-start">
      <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Image Section (Center Main Image) */}
        <div className="flex flex-col lg:flex-row items-center gap-6 justify-center">
          {/* Main Image */}
          <div className="relative w-full lg:w-2/5 flex justify-center">
            <Image
              ref={imageRef}
              src={product.images[selectedImageIndex]}
              alt={product.name}
              width={500}
              height={350}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Thumbnails Section */}
        <div className="flex flex-row space-x-3 overflow-x-auto mt-6 justify-center">
          {product.images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded-md overflow-hidden transition-all duration-200`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={60}
                height={60}
                className={`object-cover ${selectedImageIndex === index ? "border border-gray-500" : "border-transparent"}`}
              />
            </div>
          ))}
        </div>

        {/* Color Options */}
        {product.color?.length > 0 && (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm font-medium mb-2">Select color</p>
            <div className="flex space-x-4">
              {product.color.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorChange(color.code)}
                  className={`w-8 h-8 cursor-pointer rounded-full flex items-center justify-center transition-all duration-300 border ${selectedColor === color.code ? "border-gray-500" : "border-gray-300"}`}
                  style={{ backgroundColor: color.code }}
                >
                  {selectedColor === color.code && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price, Quantity, and Add to Cart */}
        <div className="flex flex-col items-center gap-6 mt-6 p-4 bg-white shadow-lg rounded-lg">
  <p className="text-xl font-semibold text-gray-900">
    Price: <span className="text-2xl font-bold text-green-600">tk.{product.price}</span>
  </p>
  
  <div className="flex gap-4 mt-4">
    <button
      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
      onClick={handleAddToCart}
    >
      <FaShoppingCart className="inline mr-2" /> Add To Cart
    </button>
    
    <button
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
      onClick={handleBuyNow}
    >
      <FaShoppingCart className="inline mr-2" /> Buy Now
    </button>
  </div>

  <div className="flex items-center space-x-4 mt-6">
    <button
      className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition"
      onClick={() => handleQuantityChange("decrease")}
    >
      <FaMinus className="text-lg" />
    </button>
    
    <span className="text-lg font-medium text-gray-800">{wholesaleQuantity}</span>
    
    <button
      className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition"
      onClick={() => handleQuantityChange("increase")}
    >
      <FaPlus className="text-lg" />
    </button>
  </div>
</div>


        {/* Toast Notification */}
        {showToast && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-gray-600 text-white py-3 px-6 rounded-lg shadow-sm flex items-center">
              <FaCheck className="mr-2 text-lg" />
              Product added to cart!
            </div>
          </div>
        )}

        {/* Product Info Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">{product.title}</h2>
          <div className="mt-4">
            <h3 className="text-x font-semibold">Product Overview</h3>
            <p className="text-sm text-gray-600">{product.productOverview}</p>
          </div>

          {/* Specifications Table */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Specifications</h3>
            <table className="w-full border-collapse border border-gray-200 mt-2">
              <tbody>
                {product.technicalSpecs.split("\n").map((info, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4 text-sm text-gray-600">{info}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Features Table */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Key Features</h3>
            <table className="w-full border-collapse border border-gray-200 mt-2">
              <tbody>
                {product.keyFeatures.split("\n").map((info, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4 text-sm text-gray-600">{info}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Additional Info Table */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Additional Info</h3>
            <table className="w-full border-collapse border border-gray-200 mt-2">
              <tbody>
                {product.additionalInfo.split("\n").map((info, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4 text-sm text-gray-600">{info}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Why Buy Section */}
          <div className="mt-6">
            <h1 className="text-xl font-semibold"><strong>{product.whyBuy.split('?')[0]}?</strong></h1>
            <p className="text-sm text-gray-600">{product.whyBuy.split('?').slice(1).join('?')}</p>
          </div>
        </div>
      </div>
      <RelatedProducts />
    </div>
  );
};

export default ProductDescription;