import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaChevronRight, FaSearch } from 'react-icons/fa';
import Image from 'next/image';

const Sidebar = ({ toggleSidebar }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoriesResponse = await axios.get('https://bytezle-server.vercel.app/categories');
        setCategories(categoriesResponse.data);

        const subcategoriesPromises = categoriesResponse.data.map(category =>
          axios.get(`https://bytezle-server.vercel.app/subcategories/category/${category._id}`)
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
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  useEffect(() => {
    // Automatically expand categories when a subcategory matches the search query
    if (searchQuery) {
      const matchingCategory = categories.find(category =>
        subcategories[category._id]?.some(subcategory =>
          subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      if (matchingCategory) {
        setExpandedCategory(matchingCategory._id);
      }
    } else {
      setExpandedCategory(null); // Collapse all categories when search query is cleared
    }
  }, [searchQuery, categories, subcategories]);

  const handleCategoryClick = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSubcategoryClick = (subcategoryName) => {
    router.push(`/pages/freshdeals/?subcategory=${encodeURIComponent(subcategoryName)}`);
    toggleSidebar();
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (subcategories[category._id] && subcategories[category._id].some(subcategory =>
      subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  return (
    <>
      <div className="opacity-50 bg-black z-40 fixed inset-0" onClick={toggleSidebar}></div>
      <div className="sidebar fixed h-full pt-16 top-0 left-0 z-50 w-full bg-[#FFFFFF] text-[#000000] shadow-lg overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-8 rounded-md bg-[#F5F5F5] text-sm text-[#4D4D4D] focus:outline-none focus:ring-1 focus:ring-[#FFD200]"
            />
            <FaSearch className="absolute left-2 top-2.5 text-[#4D4D4D] text-sm" />
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-sm text-[#4D4D4D]">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-sm text-[#FF534D] text-center">{error}</div>
          ) : (
            <ul className="space-y-2">
              {filteredCategories.map((category) => (
                <li key={category._id} className="relative group">
                  <div
                    className="flex justify-between items-center cursor-pointer hover:bg-[#F5F5F5] p-1.5 rounded-md transition-all"
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    <div className="flex items-center">
                      <Image className='rounded-md' src={category.img} width={24} height={24} alt={category.name} />
                      <span className="ml-2 text-sm font-medium">{category.name}</span>
                    </div>
                    <FaChevronRight
                      className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                        expandedCategory === category._id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedCategory === category._id ? 'max-h-screen' : 'max-h-0'
                    }`}
                  >
                    <ul className="mt-1 space-y-1">
                      {subcategories[category._id] &&
                        subcategories[category._id].map((subcategory) => (
                          <li
                            key={subcategory._id}
                            className="flex items-center cursor-pointer hover:bg-[#F5F5F5] p-1.5 rounded-md transition-all"
                            onClick={() => handleSubcategoryClick(subcategory.name)}
                          >
                            <Image className='rounded-md' src={subcategory.img} width={24} height={24} alt={subcategory.name} />
                            <span className="ml-2 text-sm">{subcategory.name}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;