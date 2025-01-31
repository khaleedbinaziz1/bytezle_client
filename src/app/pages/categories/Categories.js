"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

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
                const response = await axios.get("http://localhost:500/categories", {
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

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 10,
            partialVisibilityGutter: 40,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 8,
            partialVisibilityGutter: 30,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
            partialVisibilityGutter: 20,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3,
            partialVisibilityGutter: 10,
        },
    };

    const ButtonGroup = ({ next, previous }) => (
        <>
            <button
                onClick={previous}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
                <FaChevronCircleLeft size={40} />
            </button>
            <button
                onClick={next}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
                <FaChevronCircleRight size={40} />
            </button>
        </>
    );

    return (
        <div className="relative p-2">
            <div className="text-left"></div>
            {error ? (
                <div className="flex justify-center items-center h-96">

                </div>
            ) : loading ? (
                <div className="flex space-x-4 overflow-hidden">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="animate-pulse cursor-pointer w-full">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-2"></div>
                            <div className="h-4 w-3/4 bg-gray-300 mx-auto rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={1000}
                    customTransition="all .5s ease-in-out"
                    itemClass="carousel-item"
                    containerClass="carousel-container"
                    arrows={false}
                    
                    renderButtonGroupOutside={true}
                    customButtonGroup={<ButtonGroup />}
                >
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className="cursor-pointer hover:shadow-2xl transition-shadow duration-300 bg-white rounded-lg p-4 text-center flex flex-col justify-between"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <div className="image-container mb-2">
                                {category.img && (
                                    <Image
                                        src={category.img}
                                        alt={category.name}
                                        width={600}
                                        height={600}
                                        className="rounded-lg object-fit"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </Carousel>
            )}
        </div>
    );
};

export default Categories;