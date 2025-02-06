import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import img1 from '../../../images/banner-1.png';
import img2 from '../../../images/banner-2.png';
import img3 from '../../../images/banner-2.png';
import img4 from '../../../images/banner-1.png';

const Hero = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
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
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const handleSubcategoryClick = (subcategoryName) => {
    router.push(`/pages/freshdeals/?subcategory=${encodeURIComponent(subcategoryName)}`);
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg relative mt-[50px]  flex">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-md p-4">

        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category._id}
              className="cursor-pointer group relative"
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="flex items-center space-x-3 p-2 border-bottom-1px rounded-lg hover:bg-gray-100 transition-all duration-300">
                {category.img && (
                  <Image
                    src={category.img}
                    alt={category.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-cover rounded-full"
                  />
                )}
                <span className="text-gray-700 text-sm ">{category.name}</span>
              </div>

              {/* Subcategories Box on Hover */}
              {hoveredCategory === category._id && (
                <div className="absolute left-64 top-0 w-64 bg-white shadow-lg rounded-lg p-4 z-10">
                  <h4 className="text-md font-semibold mb-2">Subcategories</h4>
                  <ul className="space-y-2">
                    {subcategories[category._id]?.map((subcategory) => (
                      <li
                        key={subcategory._id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                        onClick={() => handleSubcategoryClick(subcategory.name)}
                      >
                        {subcategory.img && (
                          <Image
                            src={subcategory.img}
                            alt={subcategory.name}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-cover rounded-full"
                          />
                        )}
                        <span className="text-sm text-gray-600">{subcategory.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Carousel */}
          <div className="col-span-1 md:col-span-8">
            <Carousel
              showStatus={false}
              showThumbs={false}
              showIndicators={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={3000}
              className="w-full"
            >
              <div className="relative w-full h-[50vw] sm:h-[40vw] md:h-[30vw] lg:h-[25vw] xl:h-[30vw]">
                <Image src={img1} alt="Slide 1" layout="fit" objectFit="cover"  />
              </div>
              <div className="relative w-full h-[50vw] sm:h-[40vw] md:h-[30vw] lg:h-[25vw] xl:h-[30vw]">
                <Image src={img2} alt="Slide 2" layout="fit" objectFit="cover" />
              </div>
            </Carousel>
          </div>
          {/* Small Banners */}
          <div className="col-span-1 md:col-span-4 flex flex-row sm:flex-col gap-2 sm:gap-4">
            <div className="relative w-1/2 sm:w-full h-[30vw] sm:h-[25vw] md:h-[20vw] lg:h-[15vw] xl:h-[15vw]">
              <Image src={img3} alt="Banner 3" layout="fit" objectFit="cover" />
            </div>
            <div className="relative w-1/2 sm:w-full h-[30vw] sm:h-[25vw] md:h-[20vw] lg:h-[15vw] xl:h-[14vw]">
              <Image src={img4} alt="Banner 4" layout="fit" objectFit="cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageLayout = () => {
  return (
    <div className="w-full">
      <Hero />
    </div>
  );
};

export default PageLayout;