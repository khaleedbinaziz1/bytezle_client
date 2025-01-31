

"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaShoppingCart, FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import { useCart } from '../Shared/Cart/CartProvider';
import Cart from '../Shared/Cart/Cart';
import ProductDescription from '../productdescription/page';
import addToWishlist from '../Wishlist/addToWishlist';
import FetchSubcategories from './FetchSubcategories';


const FreshDealsContent = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);
  const itemsPerPage = 10; // Matching Breakfast's items per page
  const router = useRouter();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const selectedProductId = searchParams.get('product');
  const query = searchParams.get('q');
  const subcategory = decodeURIComponent(searchParams.get('subcategory') || '');
  const category = decodeURIComponent(searchParams.get('category') || '');

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        let url = 'http://localhost:500/products';
  
        // Normalize query for consistent matching
        const normalizeQuery = (str) => {
          return str
            .toLowerCase() // Convert to lowercase
            .replace(/[()]/g, '') // Remove parentheses
            .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
            .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
            .trim(); // Trim leading and trailing spaces
        };
  
        if (subcategory) {
          url += `/subcategory/${encodeURIComponent(subcategory)}`;
        } else if (category) {
          url += `/category/${encodeURIComponent(category)}`;
        } else if (query) {
          // Apply normalization to the query
          const normalizedQuery = normalizeQuery(query);
          url += `?q=${encodeURIComponent(normalizedQuery)}`;
        }
  
        const response = await axios.get(url);
  
        // Filter for products with `showProduct` set to "On" and normalize their names
        const filteredProducts = response.data
          .filter((product) => product.showProduct === "On")
          .map((product) => ({
            ...product,
            normalizedName: normalizeQuery(product.name), // Add normalized name for matching
          }));
  
        setProducts(filteredProducts);
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
      } catch (error) {
        setError(`Error fetching products: ${error.message}`);
      } finally {
        setLoading(false); // End loading
      }
    };
  
    fetchProducts();
  }, [query, subcategory, category]); // Include all dependencies
  

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        if (!subcategory) {
          console.log("No subcategory provided in the URL.");

          return;
        }

        console.log("Fetching details for subcategory:", subcategory);

        // Fetch the category of the given subcategory
        const subcategoryResponse = await axios.get(`http://localhost:500/subcategoriesByName?name=${subcategory}`);
        console.log("Subcategory response:", subcategoryResponse.data);

        // Check if the response contains any subcategories
        if (subcategoryResponse.data.length === 0) {

          setError("Subcategory not found.");
          return;
        }

        // Assuming the first item in the response contains the categoryId
        const categoryId = subcategoryResponse.data[0]?.category; // The 'category' field holds the categoryId

        if (!categoryId) {

          setError("Category not found for the selected subcategory");
          return;
        }

        console.log("Category ID associated with the subcategory:", categoryId);

        // Fetch subcategories under the same category
        const subcategoriesResponse = await axios.get(`http://localhost:500/subcategories/category/${categoryId}`);
        console.log("Subcategories response for the category:", subcategoriesResponse.data);

        // Set the category name (assuming you have the category name in your response)
        setCategories([{ _id: categoryId, name: subcategoryResponse.data[0]?.categoryName }]);
        console.log("Updated categories state:", [{ _id: categoryId, name: subcategoryResponse.data[0]?.categoryName }]);

        // Since subcategoriesResponse.data is an array, set it directly
        setSubcategories(prevState => ({
          ...prevState,
          [categoryId]: subcategoriesResponse.data
        }));
        console.log("Updated subcategories state:", { [categoryId]: subcategoriesResponse.data });

      } catch (err) {

        setError("Error fetching categories or subcategories");
      }
    };
    fetchCategoriesAndSubcategories();

  })




  const handleProductClick = (id) => {
    router.push(`?product=${id}`, undefined, { shallow: true });
  };

  const handleBackClick = () => {
    router.push('/', undefined, { shallow: true });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId); // Call the function to add product to wishlist
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

  return (
    <div className="mx-auto p-1 pt-1 mt-0.25 text-center rounded bg-white border-gray-500">
      <div className="text-left flex justify-between items-center">
        <div className="breadcrumbs text-sm">
          <ul>
            <button onClick={handleBackClick} className="btn btn-secondary mb-1 mr-5"><FaArrowLeft /></button>
            <li className='font-extrabold text-lg'><a href="/">Home</a></li>
            {/* <li className='font-extrabold text-lg'><a href='/Pick'>All Products</a></li> */}


          </ul>
        </div>
      </div>


      <Cart />
      {selectedProductId ? (
        <>

          <ProductDescription id={selectedProductId} />
        </>
      ) : (
        <>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-5 ">
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer mb-6 sm:mb-0 relative">
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
              ))
            ) : (
              products.slice(startIndex, endIndex).map(product => (
                <div key={product._id} className="card  bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer mb-6 sm:mb-0 items-between"
                  onClick={() => handleProductClick(product._id)}>
                  {/* Image */}
                  {product.images && product.images.length > 0 ? (
                    product.images[0] ? (
                      product.images[0].img ? (
                        <div className="w-full h-32 overflow-hidden p-2 flex justify-center">
                          <Image
                            src={`data:${product.images[0].contentType};base64,${product.images[0].img}`}
                            alt={product.name}
                            className="w-full h-32 object-contain"
                            width="100"
                            height="100"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 overflow-hidden p-2 flex justify-center">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-32 object-contain"
                            width="100"
                            height="100"
                          />
                        </div>
                      )
                    ) : (
                      'No Images'
                    )
                  ) : (
                    'No Images'
                  )}


                  <div className="p-4 bottom-0 items-center">
                    <div className="items-center" style={{ width: "100%", height: "80px" }}>
                      <p className="font-bold text-gray-900 mb-2 text-base truncate-multiline">
                        {product.name
                          .toLowerCase()  // Convert everything to lowercase first
                          .split(' ')     // Split the name by spaces
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
                          .join(' ')}
                      </p>
                      <span className="text-gray-500 text-sm font-extrabold" style={{ display: 'block', textAlign: 'center' }}>
                        EACH
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <h1 className="text-primary font-bold pt-2" style={{ fontSize: '20px' }}>৳{product.price}</h1>
                      {/* Buttons (Centered in mobile view) */}
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
              ))
            )}
          </div>
          <div className="flex justify-center mt-4">
            <button className="btn btn-outline mr-2" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            <button className="btn btn-outline ml-2" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </>
      )}

      <div className="flex flex-wrap justify-center mt-4">
        {Object.keys(subcategories).map((categoryId) => (
          <div key={categoryId} className="mb-4">
            <h3 className="font-bold text-lg mb-2">{categories.find(cat => cat._id === categoryId)?.name || 'Explore More'}</h3>
            <div className="flex flex-wrap gap-2">
              {subcategories[categoryId]?.map((subcat) => (
                <button
                  key={subcat._id}
                  className="btn btn-secondary rounded-lg py-2 px-4"
                  onClick={() => router.push(`?subcategory=${encodeURIComponent(subcat.name)}`)}
                >
                  {subcat.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default FreshDealsContent;
