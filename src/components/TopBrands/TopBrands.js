import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import the useRouter hook

// Import brand logos


import XiaomiLogo from "../../images/Xiaomi-logo.png";
import HavitLogo from "../../images/Havit (1).webp";
import PhilipsLogo from "../../images/Philips-Logo.jpg";
import PanasonicLogo from "../../images/Panasonic-Logo.jpg";
import JoyroomLogo from "../../images/Joyroom-Logo.jpg";
import CasioLogo from "../../images/casio.jpg";
import BoyaLogo from "../../images/Boya-Logo.jpg";
import BaseusLogo from "../../images/baseus.webp";
import AnkerLogo from "../../images/Anker-Logo.jpg";
import Hoco from "../../images/hoco_logo.png";

const brands = [
    { name: "Xiaomi", image: XiaomiLogo },
    { name: "Havit", image: HavitLogo },
    { name: "Philips", image: PhilipsLogo },
    { name: "Panasonic", image: PanasonicLogo },
    { name: "Joyroom", image: JoyroomLogo },
    { name: "Casio", image: CasioLogo },
    { name: "Boya", image: BoyaLogo },
    { name: "Baseus", image: BaseusLogo },
    { name: "Anker", image: AnkerLogo },
    { name: "Hoco", image: Hoco },
];

const TopBrands = () => {
    const router = useRouter(); // Initialize the router

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
                {brands.map((brand, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-5 transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl cursor-pointer"
                        onClick={() => handleBrandClick(brand.name)} // Add onClick handler
                    >
                        <Image
                            src={brand.image}
                            alt={brand.name}
                            className="object-contain"
                            width={90}
                            height={90}
                        />
                   
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopBrands;