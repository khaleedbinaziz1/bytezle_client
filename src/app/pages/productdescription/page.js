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
    const x = ((e.pageX - left) / width) * 100;
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
    <div className="container mx-auto p-4 text-start">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">

        {/* Image Section (Responsive Layout) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex lg:flex-col space-x-3 lg:space-y-3 overflow-x-auto mb-3 lg:w-1/5">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-md overflow-hidden"
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={60}
                  height={60}
                  className={`object-cover border-2 transition-all duration-200 ${selectedImageIndex === index ? "border-primary" : "border-transparent"}`}
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div
            className="relative lg:w-2/5 w-full"
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
              className="w-full h-auto"
            />
            {isMagnifierVisible && (
              <div
                className="absolute border-2 border-gray-400 bg-white bg-opacity-50 pointer-events-none"
                style={{
                  left: `${cursorPosition.x - 10}%`,
                  top: `${cursorPosition.y - 10}%`,
                  width: "20%",
                  height: "20%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>

          {/* Magnified Image Box (Visible on desktop) */}
          {isMagnifierVisible && (
            <div className="lg:w-2/5 w-full">
              <div
                className="w-full h-[350px] border-2 border-gray-300 overflow-hidden"
                style={{
                  backgroundImage: `url(${product.images[selectedImageIndex]})`,
                  backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                  backgroundSize: `${imageRef.current?.width * 2}px ${imageRef.current?.height * 2}px`,
                }}
              />
            </div>
          )}
        </div>

        {/* Color Options (Responsive) */}
        {product.color?.length > 0 && (
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-4 mt-2 max-w-screen-lg p-4 bg-white rounded-xl shadow-lg">
              <p className="mt-2 text-lg font-medium">Select color</p>
              {product.color.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorChange(color.code)}
                  className={`w-12 h-12 cursor-pointer rounded-full flex items-center justify-center transition-all duration-300 relative border-2`}
                  style={{
                    backgroundColor: color.code,
                    borderColor: selectedColor === color.code ? "#4CAF50" : "#D1D5DB",
                  }}
                >
                  {selectedColor === color.code && (
                    <span className="text-green-800 text-xl font-bold">√</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price, Quantity, and Add to Cart */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <p className="text-lg font-semibold text-gray-800">
            Price:
            <span className="text-xl font-bold text-teal-500 ml-1">tk.{product.price}</span>
          </p>
          <button
            className="px-6 py-2 bg-secondary text-white font-semibold border border-gray-300 shadow-sm hover:bg-secondary-dark transition duration-300"
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="inline mr-2" /> Add To Cart
          </button>

          <div className="flex items-center space-x-3 w-full justify-center">
            <button
              className="btn-circle btn bg-gray-300"
              onClick={() => handleQuantityChange("decrease")}
            >
              <FaMinus />
            </button>
            <span className="text-lg">{wholesaleQuantity}</span>
            <button
              className="btn-circle btn bg-gray-300"
              onClick={() => handleQuantityChange("increase")}
            >
              <FaPlus />
            </button>
          </div>

        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-teal-500 text-white py-2 px-6 rounded-lg shadow-lg flex items-center">
              <FaCheck className="mr-2 text-lg" /> {/* Tick mark icon */}
              Product added to cart!
            </div>
          </div>
        )}

        {/* Additional Info Section */}
        <h2 className="text-lg font-bold mt-6">{product.title}</h2>
        <div className="mt-4">
          <h2 className="text-lg font-bold">Product Overview</h2>
          <p className="text-sm">{product.productOverview}</p>
        </div>
        {/* Rest of the additional info tables */}
        <div className="mt-4">
          <h2 className="text-lg font-bold">Specifications</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <tbody>
              {product.technicalSpecs.split("\n").map((info, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-1 text-sm">{info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-bold">Key Features</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <tbody>
              {product.keyFeatures.split("\n").map((info, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-1 text-sm">{info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-bold">Additional Info</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <tbody>
              {product.additionalInfo.split("\n").map((info, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-1 text-sm">{info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <p className="text-sm"><strong>{product.whyBuy.split('?')[0]}?</strong></p>
          <p className="text-sm">{product.whyBuy.split('?').slice(1).join('?')}</p>
        </div>
      </div>

      <RelatedProducts />
    </div>
  );
};

export default ProductDescription;
