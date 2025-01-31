"use client";
import React from 'react';

const FAQ = () => {
    const faqs = [
        {
            question: "What is Bytezle?",
            answer: (
                <p className="text-gray-600 text-sm">
                    Bytezle is your go-to online destination for the latest gadgets and tech innovations. We offer a curated selection of high-quality products, from smart home devices and wearables to gaming gear and productivity tools, all at competitive prices.
                </p>
            ),
        },
        {
            question: "How can I place an order on Bytezle?",
            answer: (
                <p className="text-gray-600 text-sm">
                    Placing an order is easy! Simply browse our product categories, select the items you want, and proceed to checkout. Enter your delivery details, choose a payment method, and confirm your order.
                </p>
            ),
        },
        {
            question: "Is shopping on Bytezle safe?",
            answer: (
                <p className="text-gray-600 text-sm">
                    Absolutely! We prioritize your security and privacy. Our website uses advanced encryption to protect your data, and all transactions are processed securely.
                </p>
            ),
        },
        {
            question: "What types of products does Bytezle offer?",
            answer: (
                <p className="text-gray-600 text-sm">
                    Bytezle offers a wide range of tech products, including smart home devices, wearables, gaming accessories, headphones, and much more. Explore our shop to discover the latest innovations.
                </p>
            ),
        },
        {
            question: "What payment methods are accepted?",
            answer: (
                <p className="text-gray-600 text-sm">
                    We accept all major credit and debit cards, as well as popular digital payment methods like PayPal. Cash on delivery is also available in select regions.
                </p>
            ),
        },
        {
            question: "How can I get discounts or promotions?",
            answer: (
                <p className="text-gray-600 text-sm">
                    Stay tuned to our website, app, and social media channels for the latest deals and promotions. We also offer exclusive discounts for newsletter subscribers and app users.
                </p>
            ),
        },
        {
            question: "What areas does Bytezle deliver to?",
            answer: (
                <p className="text-gray-600 text-sm">
                    Bytezle delivers to a wide range of locations. Enter your address during checkout to confirm if we deliver to your area.
                </p>
            ),
        },
        {
            question: "Can I schedule a delivery for a specific time?",
            answer: (
                <p className="text-gray-600 text-sm">
                    Yes, you can choose your preferred delivery time slot during checkout. We offer flexible delivery options to suit your schedule.
                </p>
            ),
        },
        {
            question: "What should I do if there’s an issue with my order?",
            answer: (
                <p className="text-gray-600 text-sm">
                    If you encounter any issues with your order, please contact our customer support team via the app, website, or email. We’re here to help and will resolve your concerns promptly.
                </p>
            ),
        },
        {
            question: "How do I track my order?",
            answer: (
                <p className="text-gray-600 text-sm">
                    You can track your order in real-time through the Bytezle app or website. Once your order is confirmed, you’ll receive updates on its status and estimated delivery time.
                </p>
            ),
        },
    ];

    return (
        <div className="p-6 shadow-lg rounded-lg w-full mx-auto" style={{ marginTop: '150px' }}>
            <div className="text-left mb-5">
                <div className="flex items-center">
                    <div className="">
                        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
                        <div style={{ width: '100px', borderBottom: '#50AA1B 8px solid' }}></div>
                        <div style={{ width: '50px', borderBottom: '#FF534D 8px solid' }}></div>
                    </div>
                </div>
                <hr className="border-t-1 border-gray-300 mt-2" />
            </div>
            <div className="join join-vertical w-full rounded-none">
                {faqs.map((faq, index) => (
                    <div key={index} className="collapse collapse-arrow join-item border-base-300 border">
                        <input type="radio" name="my-accordion-4" defaultChecked={index === 0} />
                        <div className="collapse-title text-lg font-medium">{faq.question}</div>
                        <div className="collapse-content">
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;