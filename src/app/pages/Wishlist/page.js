"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../login/firebase/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore'; 
import Image from 'next/image';
import { FaShoppingCart, FaTrash } from 'react-icons/fa'; 
import { useCart } from '../Shared/Cart/CartProvider';
import addToWishlist from '../Wishlist/addToWishlist';
import removeFromWishlist from '../Wishlist/removeFromWishlist'; 

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  
  const { addToCart } = useCart();

  const fetchWishlist = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const wishlist = data.wishlist || [];

          const productPromises = wishlist.map(id =>
            fetch(`https://bytezle-server.vercel.app/products/${id}`).then(res => res.json())
          );
          const products = await Promise.all(productPromises);

          setProducts(products);
        } else {
          console.log("No such document for user:", user.uid);
        }
      } else {
        console.log("No user currently logged in.");
      }
    } catch (error) {
      console.error('Error fetching wishlist or products:', error);
    } finally {
      setLoading(false);  
    }
  }, []);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        fetchWishlist();

        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, fetchWishlist);

        return () => {
          unsubscribeDoc(); 
        };
      } else {
        console.log("User signed out.");
      }
    });

    return () => {
      unsubscribeAuth(); 
    };
  }, [fetchWishlist]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleRemoveFromWishlist = async (product) => {
    try {
      await removeFromWishlist(product._id);
      setProducts(products.filter(p => p._id !== product._id));
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };

  const handleAddToCartAndRemoveFromWishlist = (product) => {
    handleAddToCart(product);
    handleRemoveFromWishlist(product);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 mt-40 border border-gray-300 rounded-lg shadow-md mb-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-800">My Wishlist</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div> 
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.length > 0 ? (
            products.map(product => (
              <div 
                key={product._id} 
                className="relative bg-white rounded-lg shadow-md transition-shadow duration-300 group"
              >
               <Image 
  src={product.images[0]} 
  alt={product.name} 
  width={300} 
  height={200} 
  className="w-full h-32 sm:h-40 object-contain rounded-t-lg group-hover:scale-105 transition-transform duration-300"
/>

                <div className="p-3 sm:p-4">
                <p className="font-bold text-gray-900 mb-2 text-base truncate-multiline">
                      {product.name
                        .toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </p>
                  <p className="text-sm sm:text-base font-bold text-#FFD601-600 mb-2 text-center">৳{product.price}</p>
                  <div className="flex justify-between space-x-2">
                    <button 
                      className="bg-#FFD601-500 hover:bg-#FFD601-600 text-white py-1 px-2 text-xs sm:text-sm rounded-md transition-all duration-300 z-10 relative"
                      onClick={() => handleAddToCartAndRemoveFromWishlist(product)}
                    >
                      <FaShoppingCart className="inline mr-1" /> 
                    </button>
                    <button 
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 text-xs sm:text-sm rounded-md transition-all duration-300 z-10 relative"
                      onClick={() => handleRemoveFromWishlist(product)}
                    >
                      <FaTrash className="inline mr-1" /> 
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full text-sm sm:text-lg">Your wishlist is empty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
