import { useState, useEffect } from 'react';

const InfoSection = () => {
    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        const getProductCount = async () => {
            try {
                const res = await fetch('https://bytezle-server.vercel.app/products');
                const data = await res.json();
                setProductCount(data.length);
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        getProductCount();
    }, []);

    return (
        <section className="bg-gradient-to-r from-[#FACF2B] to-[#FB565B] py-6 px-4 text-center text-white">
            <div className="max-w-screen-md mx-auto space-y-4">
                <h2 className="text-xl font-extrabold leading-tight">
                    {productCount}+ Amazing Products
                </h2>
                <p className="text-sm max-w-md mx-auto">
                    Pay 20% to Confirm Order, rest on delivery.

                </p>
         
            </div>
        </section>
    );
};

export default InfoSection;
