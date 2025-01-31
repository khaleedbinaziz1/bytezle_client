"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../Shared/Cart/CartProvider";
import RelatedProducts from "./RelatedProducts";

const ProductDescription = ({ id }) => {
  const [product, setProduct] = useState(null);
  const [wholesaleQuantity, setQuantity] = useState(1);
  const [isWholesale, setIsWholesale] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [calculation, setCalculation] = useState(0);
  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:500/products/${id}`);
        setProduct(response.data);
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
        type: isWholesale ? "wholesale" : "retail",
        price: isWholesale ? product.wholesalePrice : product.price,
      };
      addToCart(productToAdd, wholesaleQuantity);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setCursorPosition({ x, y });
    setMagnifierPosition({ x: e.pageX - left, y: e.pageY - top });
  };

  if (!product) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 text-start">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-inner p-8">
        {/* Mobile View Layout */}
        <div className="lg:hidden">
          {/* Main Image */}
          <div
            className="w-full relative mb-4"
            onMouseEnter={() => setIsMagnifierVisible(true)}
            onMouseLeave={() => setIsMagnifierVisible(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              ref={imageRef}
              src={product.images[selectedImageIndex]}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-auto"
            />
            {isMagnifierVisible && (
              <div
                className="absolute border-2 border-gray-300 bg-white"
                style={{
                  left: `${magnifierPosition.x - 50}px`,
                  top: `${magnifierPosition.y - 50}px`,
                  width: "100px",
                  height: "100px",
                  backgroundImage: `url(${product.images[selectedImageIndex]})`,
                  backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                  backgroundSize: `${imageRef.current?.width * 2}px ${imageRef.current?.height * 2}px`,
                  zIndex: 10,
                }}
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex overflow-x-auto space-x-4 mb-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-lg overflow-hidden"
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className={`object-cover border-2 ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Add to Cart Section */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <button
              className="px-8 py-3 bg-primary text-white rounded-lg w-full"
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="inline mr-2" /> Add To Cart
            </button>
            <div className="flex items-center space-x-4 w-full justify-center">
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
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isWholesale}
                  onChange={() => setIsWholesale(!isWholesale)}
                />
                <h1 className="text-2xl text-green-600 font-bold">Buy in Wholesale Quantity</h1>
              </label>
            </div>
            {isWholesale && (
              <p className="text-green-600">
                You save tk.{calculation.toFixed(0)} by buying wholesale!
              </p>
            )}
          </div>
        </div>

        {/* Desktop View Layout */}
        <div className="hidden lg:flex flex-row gap-8">
          {/* Left: Thumbnails */}
          <div className="w-1/5 flex flex-col space-y-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-lg overflow-hidden"
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className={`object-cover border-2 ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Middle: Main Image */}
          <div
            className="w-2/5 relative"
            onMouseEnter={() => setIsMagnifierVisible(true)}
            onMouseLeave={() => setIsMagnifierVisible(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              ref={imageRef}
              src={product.images[selectedImageIndex]}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-auto"
            />
            {isMagnifierVisible && (
              <div
                className="absolute border-2 border-gray-300 bg-white"
                style={{
                  left: `${magnifierPosition.x - 50}px`,
                  top: `${magnifierPosition.y - 50}px`,
                  width: "100px",
                  height: "100px",
                  backgroundImage: `url(${product.images[selectedImageIndex]})`,
                  backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                  backgroundSize: `${imageRef.current?.width * 2}px ${imageRef.current?.height * 2}px`,
                  zIndex: 10,
                }}
              />
            )}
          </div>

          {/* Right: Name & Key Features Table */}
          <div className="w-2/5">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                {product.keyFeatures.split("\n").map((feature, index) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="p-2">{feature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buttons Section (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col items-center gap-4 mt-6">
          <button
            className="px-8 py-3 bg-primary text-white rounded-lg"
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="inline mr-2" /> Add To Cart
          </button>
          <div className="flex items-center space-x-4">
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
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isWholesale}
                onChange={() => setIsWholesale(!isWholesale)}
              />
              <h1 className="text-2xl text-green-600 font-bold">Buy in Wholesale Quantity</h1>
            </label>
          </div>
          {isWholesale && (
            <p className="text-green-600">
              You save tk.{calculation.toFixed(0)} by buying wholesale!
            </p>
          )}
        </div>

        {/* Additional Info Section */}
        <h2 className="text-xl font-bold mt-10">{product.title}</h2>
        <div className="mt-6">
          <h2 className="text-xl font-bold">Product Overview</h2>
          <p>{product.productOverview}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold">Specifications</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <tbody>
              {product.technicalSpecs.split("\n").map((info, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-2">{info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold">Key Features</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <tbody>
              {product.keyFeatures.split("\n").map((info, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-2">{info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold">Additional Info</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <tbody>
              {product.additionalInfo.split("\n").map((info, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-2">{info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <p><strong>{product.whyBuy.split('?')[0]}?</strong></p>
          <p>{product.whyBuy.split('?').slice(1).join('?')}</p>
        </div>
      </div>
      <RelatedProducts />
    </div>
  );
};

export default ProductDescription;