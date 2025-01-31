"use client";
import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '../Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';

const SubcategoriesContent = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await axios.get(`https://bytezle-server.vercel.app/subcategories/category/${encodeURIComponent(category)}`);
                setSubcategories(response.data);
            } catch (err) {
                console.error('Error fetching subcategories:', err);
                setError('Failed to load subcategories. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchSubcategories();
        }
    }, [category]);

    if (loading) {
        return <div className="flex justify-center items-center h-40"><span className="loading loading-dots loading-lg"></span></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center text-lg font-semibold">{error}</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-xl shadow-lg">
            {subcategories.map((subcategory, index) => (
                <Link key={subcategory.id} href={`/pages/freshdeals?subcategory=${encodeURIComponent(subcategory.name)}`} passHref>
                    <div 
                        className="flex flex-col items-center bg-white border border-gray-200 rounded-xl shadow-md p-5 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-gray-100"
                    >
                        <img
                            src={subcategory.img}
                            alt={subcategory.name}
                            className="w-24 h-24 object-cover rounded-full mb-4 border border-gray-300"
                        />
                        <h2 className="text-lg font-semibold text-gray-800 text-center">{subcategory.name}</h2>
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
            <div className="container mx-auto my-16 p-6">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Explore Subcategories</h1>
                <Suspense fallback={<div className="text-center text-lg">Loading subcategories...</div>}>
                    <SubcategoriesContent />
                </Suspense>
            </div>
            <Footer />
        </>
    );
};

export default Subcategories;
