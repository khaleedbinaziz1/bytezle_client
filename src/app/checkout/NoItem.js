import React from 'react';
import Link from 'next/link';

const NoItem = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-700">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/">
                    <span className="btn btn-primary">Return to Homepage</span>
                </Link>
            </div>
        </div>
    );
};

export default NoItem;
