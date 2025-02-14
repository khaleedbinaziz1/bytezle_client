"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter for navigation
import { MdCheckCircle, MdShoppingCart } from 'react-icons/md';  // Import React Icons
import withAuth from '@/app/checkout/withAuth';
import Link from 'next/link';

const Completion = () => {




  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-black mb-6">
          <MdCheckCircle className="inline-block mr-2 text-green-500" /> Thank You for Your Purchase!
        </h1>
        <p className="text-gray-800 text-center text-lg mb-8">
          Your order has been successfully completed. We appreciate your business and hope you enjoy your purchase.
        </p>
        <div className="text-center space-y-4">
          <Link href="/pages/tracking" className="bg-primary text-black py-3 px-6 rounded-full w-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:bg-accent">
            <MdShoppingCart className="mr-2" /> Track Your Order
          </Link>
          <Link href="/" className="border-2 border-primary text-black py-3 px-6 rounded-full w-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:bg-indigo-600 hover:text-white">
            <MdShoppingCart className="mr-2" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Completion);
