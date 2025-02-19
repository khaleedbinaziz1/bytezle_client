import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js';
import Image from 'next/image';

// Helper function to normalize strings
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://bytezle-server.vercel.app/products');
        const data = await response.json();
        const normalizedProducts = data.map((product) => ({
          ...product,
          normalizedName: normalizeString(product.name),
        }));
        const filteredProducts = normalizedProducts.filter((product) => product.showProduct === "On");
        setProducts(filteredProducts);
        const fuseInstance = new Fuse(filteredProducts, {
          keys: ['normalizedName'],
          threshold: 0.2,
          distance: 200,
          minMatchCharLength: 2,
          shouldSort: true,
        });
        setFuse(fuseInstance);
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
      const normalizedQuery = normalizeString(value);
      const fuzzyResults = fuse.search(normalizedQuery);
      const filteredSuggestions = fuzzyResults.map((result) => result.item);
      setSuggestions(filteredSuggestions);
      router.push(`/pages/products?q=${encodeURIComponent(value.trim())}`);
    } else {
      setSuggestions([]);
      router.push(`/pages/products`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const firstTwoWords = suggestion.name.split(' ').slice(0, 2).join(' ');
    const encodedQuery = encodeURIComponent(firstTwoWords);
    setQuery(firstTwoWords);
    setSuggestions([]);
    router.push(`/pages/products?q=${encodedQuery}`);
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
      router.push(`/pages/products?q=${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  const handleSearchButtonClick = () => {
    router.push(`/pages/products?q=${encodeURIComponent(query)}`);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-full mx-auto" ref={wrapperRef}>
      <div className="flex items-center space-x-2 bg-white rounded-full shadow-sm border border-gray-200 p-1">
        <input
          ref={inputRef}
          type="text"
          className="flex-grow px-4 py-2 rounded-full focus:outline-none text-sm"
          placeholder="Search for products..."
          value={query}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <button
          className="p-2 bg-black text-white rounded-full hover:bg-blue-600 transition-colors"
          onClick={handleSearchButtonClick}
        >
          <FaSearch className="w-4 h-4" />
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-200 mt-2 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 flex items-center space-x-3 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Image
                src={suggestion.images[0]}
                alt={suggestion.name}
                className="object-cover rounded"
                width={40}
                height={40}
                loading="lazy"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{suggestion.name}</p>
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