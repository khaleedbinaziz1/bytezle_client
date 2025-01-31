"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

const FetchSubcategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        setLoading(true); // Start loading

        const subcategory = searchParams.get("subcategory");
        if (!subcategory) {
          setError("Subcategory is missing from the URL.");
          setLoading(false);
          return;
        }

        console.log("Fetching details for subcategory:", subcategory);

        // Fetch the category ID using the subcategory name
        const subcategoryResponse = await axios.get(
          `https://bytezle-server.vercel.app/subcategoriesByName?name=${encodeURIComponent(subcategory)}`
        );
        console.log("Subcategory response:", subcategoryResponse.data);

        if (!subcategoryResponse.data || subcategoryResponse.data.length === 0) {
          setError("Subcategory not found.");
          setLoading(false);
          return;
        }

        const categoryId = subcategoryResponse.data[0]?.category;
        const categoryName = subcategoryResponse.data[0]?.categoryName;

        if (!categoryId) {
          setError("Category not found for the selected subcategory.");
          setLoading(false);
          return;
        }

        console.log("Category ID associated with the subcategory:", categoryId);

        // Fetch all subcategories under the same category
        const subcategoriesResponse = await axios.get(
          `https://bytezle-server.vercel.app/subcategories/category/${categoryId}`
        );
        console.log("Subcategories response for the category:", subcategoriesResponse.data);

        if (!subcategoriesResponse.data || subcategoriesResponse.data.length === 0) {
          setError("No subcategories found for the selected category.");
          setLoading(false);
          return;
        }

        // Update states for categories and subcategories
        setCategories([{ _id: categoryId, name: categoryName }]);
        setSubcategories(subcategoriesResponse.data);

        console.log("Categories updated:", [{ _id: categoryId, name: categoryName }]);
        console.log("Subcategories updated:", subcategoriesResponse.data);
      } catch (err) {
        console.error("Error fetching categories or subcategories:", err);
        setError("Error fetching categories or subcategories.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCategoriesAndSubcategories();
  }, [searchParams]);

  return (
    <div className="p-4">
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Categories Section */}
      {!loading && !error && categories.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Select a Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category._id}
                className="btn btn-primary rounded-lg py-2 px-4"
                onClick={() => router.push(`?category=${category._id}`)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories Section */}
      {!loading && !error && subcategories.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Subcategories:</h3>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((subcat) => (
              <button
                key={subcat._id}
                className="btn btn-secondary rounded-lg py-2 px-4"
                onClick={() => router.push(`?subcategory=${encodeURIComponent(subcat.name)}`)}
              >
                {subcat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && subcategories.length === 0 && (
        <p className="text-gray-500">No subcategories available.</p>
      )}
    </div>
  );
};

export default FetchSubcategories;
