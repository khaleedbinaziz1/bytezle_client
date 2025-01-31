import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js'; // Import Fuse.js

// Helper function to normalize strings
const normalizeString = (str) => {
  return str
    .toLowerCase() // Convert to lowercase
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
};

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const inputRef = useRef(null); // Reference to input element
  const wrapperRef = useRef(null); // Reference to the whole search bar component
  const [fuse, setFuse] = useState(null); // State to hold the Fuse.js instance

  useEffect(() => {
    // Fetch product data from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:500/products');
        const data = await response.json();

        // Normalize product names for easier matching
        const normalizedProducts = data.map((product) => ({
          ...product,
          normalizedName: normalizeString(product.name),
        }));

        // Filter for products with showProduct set to "On"
        const filteredProducts = normalizedProducts.filter((product) => product.showProduct === "On");
        setProducts(filteredProducts);

        // Initialize Fuse.js with product data
        const fuseInstance = new Fuse(filteredProducts, {
          keys: ['normalizedName'], // Search against normalized names
          threshold: 0.2, // Lower threshold for stricter matches
          distance: 200, // Increase distance for long strings
          minMatchCharLength: 2, // Require at least 2 characters in a match
          shouldSort: true, // Sort results by match quality
        });
        setFuse(fuseInstance); // Store the Fuse.js instance in state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() && fuse) {
      // Normalize query for matching
      const normalizedQuery = normalizeString(value);
      const fuzzyResults = fuse.search(normalizedQuery);

      // Extract the matching items
      const filteredSuggestions = fuzzyResults.map((result) => result.item);
      setSuggestions(filteredSuggestions);

      // Navigate to the search results page in real-time
      router.push(`/pages/freshdeals?q=${encodeURIComponent(value.trim())}`);
    } else {
      setSuggestions([]);
      router.push(`/pages/freshdeals`); // Clear query if input is empty
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const firstTwoWords = suggestion.name.split(' ').slice(0, 2).join(' '); // Extract the first two words
    const encodedQuery = encodeURIComponent(firstTwoWords); // Encode the query
    setQuery(firstTwoWords); // Update the search bar with the first two words
    setSuggestions([]); // Clear suggestions
    router.push(`/pages/freshdeals?q=${encodedQuery}`); // Navigate with the extracted query
  };
  

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      router.push(`/pages/freshdeals?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
    {/* Search Input and Button */}
    <div className="flex items-center space-x-2">
      <input
        ref={inputRef}
        type="text"
        className="w-full px-4 py-3 text-sm font-medium text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
        placeholder="Search for products..."
        value={query}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        onClick={() => router.push(`/pages/freshdeals?q=${encodeURIComponent(query)}`)}
      >
        <FaSearch className="w-5 h-5" />
      </button>
    </div>
  
    {/* Suggestions Dropdown */}
    {suggestions.length > 0 && (
      <ul className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-[500px] overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="flex items-center space-x-4 p-3 cursor-pointer hover:bg-gray-100 transition duration-200"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {/* Product Image */}
            <img
              src={suggestion.images[0]} // Assuming the first image in the `images` array
              alt={suggestion.name}
              className="w-14 h-14 object-cover rounded-md"
              loading="lazy"
            />
            {/* Product Details */}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{suggestion.name}</p>
              <p className="text-xs text-gray-500">Price: {suggestion.price} BDT</p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
};

export default Searchbar;
