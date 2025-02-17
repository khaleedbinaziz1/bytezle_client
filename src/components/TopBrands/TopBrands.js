import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import axios from "axios"; // Import axios for making API requests

const TopBrands = () => {
    const [brands, setBrands] = useState([]); // State to store brands
    const router = useRouter(); // Initialize the router

    // Fetch brands from the API
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get("https://bytezle-server.vercel.app/brands");
                setBrands(response.data); // Set brands data from the API
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };
        fetchBrands();
    }, []);

    // Function to handle brand click
    const handleBrandClick = (brandName) => {
        router.push(`/pages/freshdeals?q=${brandName.toLowerCase()}`);
    };

    return (
        <div className="container mx-auto my-16 px-6">
            {/* Header */}
            <h2 className="text-3xl font-extrabold text-center text-gray-900 uppercase tracking-widest">
                Top Brands
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto my-3"></div>
            
            {/* Brands Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-8 mt-12">
                {brands.length > 0 ? (
                    brands.map((brand, index) => (
                        <div
                        key={index}
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => handleBrandClick(brand.name)} // Add onClick handler
                    >
                        <Image
                            src={brand.img} // Assuming `img` is a URL
                            alt={brand.name}
                            className="object-contain"
                            width={70} // Smaller width
                            height={70} // Smaller height
                        />
                    </div>
                    
                    ))
                ) : (
                    <div className="text-center text-gray-500">Loading brands...</div>
                )}
            </div>
        </div>
    );
};

export default TopBrands;
