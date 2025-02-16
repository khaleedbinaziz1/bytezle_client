"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "../Shared/Cart/CartProvider";
import Cart from "../Shared/Cart/Cart";
import ProductDescription from "../productdescription/page";
import addToWishlist from "../Wishlist/addToWishlist";
import bannerImage from "../../../images/all_product_bytezle.gif";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("price-low-to-high");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const itemsPerPage = 20;
  const router = useRouter();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const selectedProductId = searchParams.get("product");
  const query = searchParams.get("q");
  const subcategory = decodeURIComponent(searchParams.get("subcategory") || "");
  const category = decodeURIComponent(searchParams.get("category") || "");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "https://bytezle-server.vercel.app/products";
        const normalizeQuery = (str) => {
          return str
            .toLowerCase()
            .replace(/[()]/g, "")
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .replace(/\s+/g, " ")
            .trim();
        };

        if (subcategory) {
          url += `/subcategory/${encodeURIComponent(subcategory)}`;
        } else if (category) {
          url += `/category/${encodeURIComponent(category)}`;
        } else if (query) {
          const normalizedQuery = normalizeQuery(query);
          url += `?q=${encodeURIComponent(normalizedQuery)}`;
        }

        const response = await axios.get(url);

        const filteredProducts = response.data
          .filter((product) => product.showProduct === "On")
          .map((product) => ({
            ...product,
            normalizedName: normalizeQuery(product.name),
          }));

        // Apply sorting
        if (sortOption === "price-low-to-high") {
          filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-high-to-low") {
          filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortOption === "latest") {
          filteredProducts.sort(
            (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
          );
        }

        setProducts(filteredProducts);
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
      } catch (error) {
        setError(`Error fetching products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, subcategory, category, sortOption]);

  const handleProductClick = (id, productName) => {
    if (typeof productName === "string") {
      const firstWord = productName.split(" ")[0];
      router.push(
        `/pages/freshdeals?product=${id}&name=${encodeURIComponent(firstWord)}`,
        undefined,
        { shallow: true }
      );
    } else {
      console.error("Product name is undefined or not a string:", productName);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setDropdownVisible(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mx-auto mt-5 text-center rounded bg-white">
      {bannerImage && (
        <div className="mb-4">
          <Image
            src={bannerImage}
            alt="Banner"
            className="w-full rounded-lg object-cover"
            width={1200}
            height={300}
          />
        </div>
      )}
      <Cart />

      {/* Sorting Dropdown */}
      <div className="flex justify-between items-center p-4">
        <div className="relative">
          <button
            onClick={() => setDropdownVisible(!dropdownVisible)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            Sort By
          </button>
          {dropdownVisible && (
            <div
              className="absolute   mt-1 w-40 bg-white shadow-lg rounded-md "
              style={{ zIndex: 10000 }}
            >
              <ul className="space-y-1">
                <li
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    sortOption === "price-low-to-high" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleSortChange("price-low-to-high")}
                >
                  Sort by price: low to high
                </li>
                <li
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    sortOption === "price-high-to-low" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleSortChange("price-high-to-low")}
                >
                  Sort by price: high to low
                </li>
                <li
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    sortOption === "latest" ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleSortChange("latest")}
                >
                  Sort by latest
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {selectedProductId ? (
        <ProductDescription id={selectedProductId} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-3">
                    <div className="h-6 bg-gray-300 mb-2"></div>
                    <div className="h-4 bg-gray-300"></div>
                  </div>
                </div>
              ))
            ) : (
              products.slice(startIndex, endIndex).map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-all duration-200"
                  onClick={() => handleProductClick(product._id, product.name)}
                >
                  {product.images && product.images.length > 0 && product.images[0] ? (
                    <div className="w-full h-48 overflow-hidden relative">
                      <Image
                        src={
                          product.images[0].img
                            ? `data:${product.images[0].contentType};base64,${product.images[0].img}`
                            : product.images[0]
                        }
                        alt={product.name}
                        className="w-full h-60 object-cover"
                        width={200}
                        height={200}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span>No Images</span>
                    </div>
                  )}

                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-md line-clamp-2 mb-1">
                      {product.name
                        .toLowerCase()
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-yellow-600 font-bold text-lg">
                          ৳{product.price}
                        </h1>
                        {product.storePrice && (
                          <span className="text-gray-500 line-through text-xs">
                            ৳{product.storePrice}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          className="bg-yellow-500 text-white rounded-full p-1 shadow-sm hover:bg-yellow-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <FaShoppingCart className="text-lg" />
                        </button>
                        <button
                          className="bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
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
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              className="btn btn-outline mr-2"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageClick(index + 1)}
                  className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className="btn btn-outline ml-2"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllProducts;
