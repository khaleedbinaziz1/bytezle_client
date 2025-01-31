import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaChevronRight, FaDotCircle } from 'react-icons/fa';
import Image from 'next/image';

const Sidebar = ({ toggleSidebar }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null); // Track expanded category
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoriesResponse = await axios.get('http://localhost:500/categories');
        setCategories(categoriesResponse.data);

        const subcategoriesPromises = categoriesResponse.data.map(category =>
          axios.get(`http://localhost:500/subcategories/category/${category._id}`)
        );
        const subcategoriesResponses = await Promise.all(subcategoriesPromises);

        const subcategoriesData = {};
        subcategoriesResponses.forEach((response, index) => {
          subcategoriesData[categoriesResponse.data[index]._id] = response.data;
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
    toggleSidebar();
  };

  return (
    <>
      <div className="fixed  inset-0  opacity-50 z-40" onClick={toggleSidebar}></div>
      <div className="sidebar p-2 fixed h-full top-0 left-0 z-50 w-48 shadow-lg overflow-y-auto bg-white">
        <h2 className="text-md font-semibold mb-4 mt-10 text-gray-800">Categories</h2>
        {error && <div className="text-red-500">{error}</div>}
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category._id} className="border-b border-gray-200 pb-1 relative">
              <div
                className="flex justify-between items-center cursor-pointer text-gray-700 hover:text-gray-900"
                onClick={() => handleCategoryClick(category._id)}
              >
                <span className="text-sm flex">
                <Image className='rounded-lg' src={category.img} width={30} height={30} alt={category.name}></Image>
                  {category.name}
               
                </span>
               

                <FaChevronRight
                  className={`w-4 h-4 transition-transform ${
                    expandedCategory === category._id ? 'rotate-90' : ''
                  }`}
                />
              </div>
              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  expandedCategory === category._id ? 'max-h-screen' : 'max-h-0'
                }`}
              >
                <ul className="ml-4 mt-1 space-y-1">
                  {subcategories[category._id] &&
                    subcategories[category._id].map((subcategory) => (
                      <li
                        key={subcategory._id}
                        className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
                        onClick={() => handleSubcategoryClick(subcategory.name)}
                      >
                        <FaDotCircle className="text-gray-400 mr-2" />
                        <span className="text-sm">{subcategory.name}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
