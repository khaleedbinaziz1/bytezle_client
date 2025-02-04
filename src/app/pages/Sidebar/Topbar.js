import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';

const Topbar = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoriesResponse = await axios.get('https://bytezle-server.vercel.app/categories');
        setCategories(categoriesResponse.data);

        const subcategoriesPromises = categoriesResponse.data.map((category) =>
          axios.get(`https://bytezle-server.vercel.app/subcategories/category/${category._id}`)
        );
        const subcategoriesResponses = await Promise.all(subcategoriesPromises);

        const subcategoriesData = {};
        subcategoriesResponses.forEach((response, index) => {
          const sortedSubcategories = response.data.sort((a, b) => a.name.localeCompare(b.name));
          subcategoriesData[categoriesResponse.data[index]._id] = sortedSubcategories;
        });
        setSubcategories(subcategoriesData);
      } catch (err) {
        console.error('Error fetching categories or subcategories:', err);
        setError('Error fetching categories or subcategories');
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSubcategoryClick = (subcategoryName) => {
    router.push(`/pages/freshdeals/?subcategory=${encodeURIComponent(subcategoryName)}`);
  };

  return (
    <div className="navbar bg-secondary text-white shadow-lg fixed top-[-50px] left-0 w-full hidden md:block z-1">
      <div className="navbar-center flex justify-center py-4">
        <ul className="flex space-x-1">
          {categories.map((category) => (
            <li
              key={category._id}
              className="relative group"
              onMouseEnter={() => setExpandedCategory(category._id)}
              onMouseLeave={() => setExpandedCategory(null)}
            >
              <div
                className="flex items-center cursor-pointer text-white hover:text-primary transition-colors duration-300"
                onClick={() => handleCategoryClick(category._id)}
              >
                <small className="text-sm font-bold">{category.name}</small>
                <FaChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedCategory === category._id ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {expandedCategory === category._id && (
                <div
                  className="absolute top-full left-0 w-80 bg-white shadow-xl rounded-lg overflow-hidden opacity-100 pointer-events-auto transition-all duration-300"
                >
                  <div className="flex items-center px-4 py-3 bg-gray-100 border-b">
                    <Image
                      src={category.img}
                      alt={category.name}
                      width={50}
                      height={50}
                      className="object-cover rounded-md"
                    />
                    <span className="ml-3 text-gray-800 font-semibold text-lg">{category.name}</span>
                  </div>

                  <ul className="py-2">
                    {subcategories[category._id] &&
                      subcategories[category._id].map((subcategory) => (
                        <li
                          key={subcategory._id}
                          className="px-4 py-2 text-gray-700 hover:bg-primary hover:text-black transition-colors cursor-pointer"
                          onClick={() => handleSubcategoryClick(subcategory.name)}
                        >
                          {subcategory.name}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Topbar;
