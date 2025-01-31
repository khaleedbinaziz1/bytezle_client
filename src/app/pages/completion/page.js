"use client";
import withAuth from '@/app/checkout/withAuth';
import Link from 'next/link';
import { useEffect } from 'react';

const Completion = () => {
  useEffect(() => {
    console.log("Completion page mounted");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-#FFD601-500 mb-4">
          Thank You for Your Purchase!
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Your order has been successfully completed. We appreciate your business and hope you enjoy your purchase.
        </p>
        <div className="text-center">
          <Link href="/pages/tracking" className="btn btn-primary w-full mb-2">
            Track Your Order
          </Link>
          <Link href="/" className="btn btn-outline w-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Completion);