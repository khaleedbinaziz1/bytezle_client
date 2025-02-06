"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import bytezle from '../../../images/bytezle.png';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaRegHeart, FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import Searchbar from './Searchbar';
import { useCartState } from '../Shared/Cart/CartProvider';
import Login from '../../pages/login/Login';
import { auth, signOut } from '../login/firebase/firebase';
import shoppingCart from '../../../images/shopping-cart.png';
import userImage from '../../../images/user.png';
import Cart from '../Shared/Cart/Cart';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../login/firebase/firebase'; // Assuming db is your Firestore instance
import Sidebar from '../Sidebar/Sidebar';

const Navbar = () => {
  const { isCartOpen, toggleCart, itemCount } = useCartState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [wishlistLength, setWishlistLength] = useState(0);
  const sidebarRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [imagePreview, setImagePreview] = useState('');


  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email);
        fetchUserData(user.uid); // Fetch user data when authenticated

        // Set interval to fetch wishlist length every 1 second
        const intervalId = setInterval(() => {

          fetchWishlistLength(user.uid); // Fetch wishlist length when authenticated
        }, 1000); // 1000 milliseconds = 1 second

        // Clean up interval on component unmount or when user changes
        return () => {
          clearInterval(intervalId);
          unsubscribe();
        };
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
        setImagePreview(''); // Clear image preview when not authenticated
        setWishlistLength(0); // Clear wishlist length when not authenticated
      }
    });

    // Clean up subscription when the component unmounts
    return () => unsubscribe();
  }, []);


  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setImagePreview(userData.image || ''); // Set image preview from user data
      } else {

      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchWishlistLength = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const wishlist = data.wishlist || [];
        setWishlistLength(wishlist.length); // Set wishlist length
      } else {

      }
    } catch (error) {
      console.error('Error fetching wishlist length:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUserEmail(null);
      setImagePreview(''); // Clear image preview on bytezleut

      setWishlistLength(0); // Clear wishlist length on bytezleut
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
<div className=''>
    <Cart isOpen={isCartOpen} toggleCart={toggleCart} />
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={toggleSidebar} // Close sidebar when overlay is clicked
        ></div>
      )}
  
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-0 bg-base-100 w-64 sm:w-56 md:w-60 shadow-lg transition-transform transform z-[1000] duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <Sidebar />
      </div>
    </>
  
    <div className={`navbar bg-base-100 flex flex-wrap md:flex-nowrap justify-between items-center shadow-md relative top-[-0px] ${isMobileView ? 'pt-0 pb-0 mt-0 mb-0 top-[-25px]' : 'pt-0 pb-0 mt-0 mb-0'}`}>
      <div className="navbar-start flex items-center">
        {isMobileView && (
       <div 
       className="cursor-pointer z-[1100] pt-2 flex items-center"
       onClick={toggleSidebar}
     >
       {isSidebarOpen ? (
         <FaTimes className="text-2xl -top-1 relative" />
       ) : (
         <FaBars className="text-2xl -top-1 relative" />
       )}
     </div>
     
        )}
        <Link href="/" className="flex items-center p-6">
          <Image src={bytezle} alt="bytezle" width="120" height="60" />
        </Link>
      </div>
  
      <div className="navbar-center w-8/12 hidden md:flex z-[900]">
        <Searchbar />
      </div>
  
      <div className="navbar-end flex items-center space-x-3 relative z-10">
        <div className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-100 rounded transition duration-150 ease-in-out">
          <Link href="/pages/Wishlist" className="flex items-center text-gray-900">
          <span className="absolute top-0 text-xs font-semibold inline-flex items-center justify-center px-1.5 py-0.5 text-white bg-red-600 rounded-full">
              {wishlistLength}
            </span>
            <FaHeart color="#F8D026" size={28} />
          
          </Link>
        </div>
  
        <div className="relative cursor-pointer" onClick={toggleCart}>
          <Image src={shoppingCart} alt="cart" width='40' height='40' />
          {itemCount < 1 ? (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs text-white bg-red-600 rounded-full">0</span>
          ) : (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs text-white bg-red-600 rounded-full">
              {itemCount}
            </span>
          )}
        </div>
  
        {isAuthenticated ? (
          <div className="flex-none gap-2 z-[10000]">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-8 rounded-full">
                  <Image
                    src={userImage}
                    alt='user'
                    width='20'
                    height='20'
                    className='rounded-full ring ring-primary'
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[10000] mt-2 w-48 p-2 shadow"
              >
                <li>
                  <a href='/pages/Profile' className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li><Link href='/pages/tracking'>Track Orders</Link></li>
                <li onClick={handleLogOut}><a>Log out</a></li>
              </ul>
            </div>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm hover:btn-outline" onClick={() => document.getElementById('login_modal').showModal()}>
            Login
          </button>
        )}
      </div>
  
      {isMobileView && (
        <div className="w-full md:hidden relative top-[-20px]">
          <Searchbar />
        </div>
      )}
      <Login />
    </div>
  </div>
  );
};

export default Navbar;
