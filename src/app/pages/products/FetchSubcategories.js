"use client";
import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";
import Image from "next/image";

const SubcategoriesContent = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `https://bytezle-server.vercel.app/subcategories/category/${encodeURIComponent(category)}`
        );
        setSubcategories(response.data);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setError("Error fetching subcategories");
      } finally {
        setLoading(false);
      }
    };
    if (category) {
      fetchSubcategories();
    }
  }, [category]);

  const getColorForCategory = (index) => {
    const colors = [
      "bg-blue-100",
      "bg-yellow-100",
      "bg-green-100",
      "bg-purple-100",
      "bg-pink-100",
      "bg-orange-100",
    ]; // Example colors, add more as needed
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-gray-50 rounded-lg shadow-md">
      {subcategories.map((subcategory, index) => (
        <Link
          key={subcategory.id}
          href={`/pages/products?subcategory=${encodeURIComponent(subcategory.name)}`}
          passHref
        >
          <div
            className={`relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out ${getColorForCategory(index)}`}
          >
            {/* Image */}
            <Image
              src={subcategory.img} // Assuming the field in your database is `img` for image URLs
              alt={subcategory.name}
              className="object-cover rounded-t-lg"
              width={40}
              height={40}
            />
            {/* Overlay Effect */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90">
              <h2 className="text-lg font-bold text-gray-800 text-center">
                {subcategory.name}
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

const Subcategories = () => {
  return (
    <>
      <Navbar />
      <div
        className="container mx-auto my-10 p-5 bg-white rounded-lg shadow-md"
        style={{ marginTop: "150px" }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Explore Subcategories
        </h1>
        {/* Subcategory Heading */}
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <SubcategoriesContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
};

export default Subcategories;