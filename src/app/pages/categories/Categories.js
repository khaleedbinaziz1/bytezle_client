"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaExclamationCircle } from "react-icons/fa";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token =
                    process.env.NEXT_PUBLIC_JWT_TOKEN ||
                    "a0aac42de4f5c299faec7fad1971c62730011fcbd449973eb250b4ae088a6684";
                const response = await axios.get("https://bytezle-server.vercel.app/categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response) {
                    console.error("Response data:", err.response.data);
                    console.error("Response status:", err.response.status);
                }
                setError("Failed to fetch categories");
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        router.push(`/pages/subcategories/?category=${encodeURIComponent(category._id)}`);
    };

    return (
        <div className="p-4 bg-gray-50">
            <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Explore Categories</h1>
            {error ? (
                <div className="flex flex-col items-center justify-center h-48">
                    <FaExclamationCircle className="text-4xl text-red-500 mb-2" />
                    <p className="text-lg text-gray-700">Failed to load categories. Please try again later.</p>
                </div>
            ) : loading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="animate-pulse cursor-pointer">
                            <div className="w-full h-20 bg-gray-200 rounded-lg mb-2"></div>
                            <div className="h-3 w-3/4 bg-gray-200 mx-auto rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className="cursor-pointer group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <div className="relative w-full h-20">
                                {category.img && (
                                    <Image
                                        src={category.img}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-2 text-center">
                                <p className="text-sm font-medium text-gray-700 truncate">{category.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;