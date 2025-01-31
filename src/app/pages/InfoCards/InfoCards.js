import React, { useEffect, useState } from 'react';
import { FaClock, FaMoneyBill, FaShoppingCart, FaTag, FaHeadset } from 'react-icons/fa';

const InfoCards = () => {
    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        const fetchProductCount = async () => {
            try {
                const response = await fetch('https://bytezle-server.vercel.app/products');
                const data = await response.json();
                setProductCount(data.length); // Assuming the API returns an array of products
            } catch (error) {
                console.error("Error fetching product count:", error);
            }
        };
        fetchProductCount();
    }, []);

    const cards = [
        {
            icon: <FaShoppingCart className="h-6 w-6 text-blue-500" />,
            title: `${productCount}+ Products Available`,
            description: "Wide variety of products to choose from.",
        },
        {
            icon: <FaMoneyBill className="h-6 w-6 text-yellow-500" />,
            title: "Pay 20% to Confirm Order",
            description: "Pay only 20% upfront, rest on delivery.",
        },
        {
            icon: <FaTag className="h-6 w-6 text-red-500" />,
            title: "Exclusive Offers & Discounts",
            description: "Save big with our amazing deals.",
        },
        {
            icon: <FaHeadset className="h-6 w-6 text-purple-500" />,
            title: "24/7 Customer Support",
            description: "We're here to help anytime you need.",
        },
    ];

    return (
        <div className="flex justify-center relative ">
            <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 p-4 text-center">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="card bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center space-y-4"
                    >
                        <div className="icon text-3xl">{card.icon}</div>
                        <div className="text-lg font-bold text-gray-800">{card.title}</div>
                        <div className="text-sm text-gray-600">{card.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoCards;