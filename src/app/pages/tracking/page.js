"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../login/firebase/firebase";
import withAuth from "@/app/checkout/withAuth";
import Navbar from "../Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";
import {
  FaShoppingCart,
  FaTruck,
  FaCheckCircle,
  FaExclamationCircle,
  FaHourglass,
} from "react-icons/fa";

const Tracking = () => {
  const [userEmail, setUserEmail] = useState("");
  const [trackRecord, setTrackRecord] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserDetailsByEmail(user.email);
      } else {
        setUserEmail("");
        setTrackRecord([]);
        setOrders([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserDetailsByEmail = async (email) => {
    try {
      const res = await fetch(`https://bytezle-server.vercel.app/users/email/${email}`);
      if (res.ok) {
        const user = await res.json();
        const trackRecord = user.trackrecord || [];
        setTrackRecord(trackRecord);
        fetchOrders(trackRecord);
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchOrders = async (orderIds) => {
    try {
      const orders = await Promise.all(
        orderIds.map(async (orderId) => {
          const res = await fetch(`https://bytezle-server.vercel.app/orders/${orderId}`);
          if (res.ok) {
            const order = await res.json();

            // Fetch product details for each product in the order
            const productsWithImages = await Promise.all(
              order.products.map(async (product) => {
                const productRes = await fetch(
                  `https://bytezle-server.vercel.app/products/${product.product_id}`
                );
                if (productRes.ok) {
                  const productDetails = await productRes.json();
                  return {
                    ...product,
                    image: productDetails.images?.[0] || null, // Get the first image
                  };
                } else {
                  console.error(`Failed to fetch product with ID: ${product.product_id}`);
                  return product;
                }
              })
            );

            return { ...order, products: productsWithImages }; // Update products with images
          } else {
            console.error(`Failed to fetch order with ID: ${orderId}`);
            return null;
          }
        })
      );
      // Sort orders by timestamp (latest first)
      const sortedOrders = orders.filter((order) => order !== null).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const renderOrderStatusTimeline = (status) => {
    const steps = [
      { label: "Payment Processing", icon: <FaExclamationCircle />, color: "bg-yellow-500" },
      { label: "Order Confirmed", icon: <FaCheckCircle />, color: "bg-blue-500" },
      { label: "On the way", icon: <FaTruck />, color: "bg-orange-500" },
      { label: "Delivered", icon: <FaCheckCircle />, color: "bg-green-500" },
    ];

    const getStatusIndex = (status) => {
      switch (status) {
        case "Payment Processing":
          return 0;
        case "Order Confirmed":
          return 1;
        case "OnTheWay":
          return 2;
        case "Delivered":
          return 3;
        default:
          return -1;
      }
    };

    const currentIndex = getStatusIndex(status);

    return (
      <div className="relative w-full h-16">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              index === 0 ? "left-0" : index === 1 ? "left-1/3 -translate-x-1/3" : index === 2 ? "left-2/3 -translate-x-2/3" : "right-0"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                index <= currentIndex ? step.color : "bg-gray-300"
              }`}
            >
              {React.cloneElement(step.icon, {
                className: "text-white",
              })}
            </div>
            <p className="mt-2 text-xs text-center font-medium text-gray-600">{step.label}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen mt-20">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Order Tracking</h1>
        {loading ? (
          <div className="text-center text-xl text-gray-500">Loading your orders...</div>
        ) : userEmail ? (
          orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg shadow-lg bg-white hover:bg-gray-50 transition duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-gray-700">
                      Order ID:{" "}
                      <span className="font-bold text-indigo-600">{order.order_id}</span>
                    </p>
                    <p className="text-lg font-bold text-emerald-600">৳{order.total_price}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Ordered At: {new Date(order.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Location: {order.address}</p>
                  <p className="text-sm text-gray-500">Phone: {order.phone_no}</p>

                  <div className="mt-4">
                    <p className="font-semibold text-gray-600">Order Status:</p>
                    {renderOrderStatusTimeline(order.status)}
                  </div>

                  <div className="mt-4">
                    <p className="font-semibold text-gray-600">Products:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-500">
                      {order.products.map((product, idx) => (
                        <li key={idx} className="flex items-center space-x-4">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.product_name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium">{product.product_name}</p>
                            <p className="text-sm">৳{product.price} x {product.quantity}</p>

                            {/* Display Color */}
                            {product.color && (
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-600">Color:</span>
                                <div
                                  className="w-5 h-5 rounded-full"
                                  style={{ backgroundColor: product.color }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xl text-gray-500">No orders found.</p>
          )
        ) : (
          <h3 className="text-lg font-medium text-center text-gray-500">
            You are not logged in.
          </h3>
        )}
      </div>
    </div>
  );
};

export default withAuth(Tracking);
