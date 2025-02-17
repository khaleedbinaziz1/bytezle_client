"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../Shared/Cart/CartProvider";
import RelatedProducts from "./RelatedProducts";
import { FaCheck } from "react-icons/fa"; // Import the check icon

const ProductDescription = ({ id }) => {
  const [product, setProduct] = useState(null);
  const [wholesaleQuantity, setQuantity] = useState(1);
  const [isWholesale, setIsWholesale] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [calculation, setCalculation] = useState(0);
  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState(null);
  const [showToast, setShowToast] = useState(false); // State for toast visibility
  const imageRef = useRef(null);

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

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;  // Adjust the 100 to control zoom level
    const y = ((e.pageY - top) / height) * 100;
    setCursorPosition({ x, y });
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
          <div
            className="relative w-full lg:w-2/5 flex justify-center"
            onMouseEnter={() => setIsMagnifierVisible(true)}
            onMouseLeave={() => setIsMagnifierVisible(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              ref={imageRef}
              src={product.images[selectedImageIndex]}
              alt={product.name}
              width={500}
              height={350}
              className="w-full h-auto rounded-lg"
            />
            {isMagnifierVisible && (
              <div
                className="absolute border-2 border-gray-400 bg-white bg-opacity-50 pointer-events-none rounded-full"
                style={{
                  left: `${cursorPosition.x}%`,
                  top: `${cursorPosition.y}%`,
                  width: "20%",
                  height: "20%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>

          {/* Magnified Image Box (Visible on desktop) */}
          {isMagnifierVisible && (
            <div className="lg:w-2/5 w-full flex justify-center">
              <div
                className="w-full h-[350px] border-2 border-gray-200 overflow-hidden rounded-lg"
                style={{
                  backgroundImage: `url(${product.images[selectedImageIndex]})`,
                  backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                  backgroundSize: `${imageRef.current?.width * 2}px ${imageRef.current?.height * 2}px`,
                }}
              />
            </div>
          )}
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
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-xl font-medium text-gray-800">
            Price: <span className="text-lg font-semibold text-gray-800">tk.{product.price}</span>
          </p>
          <button
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-600 transition duration-300"
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="inline mr-2" /> Add To Cart
          </button>
          <div className="flex items-center space-x-3 mt-4">
            <button
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition"
              onClick={() => handleQuantityChange("decrease")}
            >
              <FaMinus />
            </button>
            <span className="text-sm font-medium">{wholesaleQuantity}</span>
            <button
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition"
              onClick={() => handleQuantityChange("increase")}
            >
              <FaPlus />
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
