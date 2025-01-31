"use client";
import React, { useEffect, useState } from 'react';
import { auth } from '../login/firebase/firebase';
import withAuth from '@/app/checkout/withAuth';
import Navbar from '../Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';

const Tracking = () => {
  const [userEmail, setUserEmail] = useState('');
  const [trackRecord, setTrackRecord] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserEmail(user.email);
        fetchUserDetailsByEmail(user.email);
      } else {
        setUserEmail('');
        setTrackRecord([]);
        setOrders([]);
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
        console.error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchOrders = async (orderIds) => {
    try {
      const orders = await Promise.all(orderIds.map(async (orderId) => {
        const res = await fetch(`https://bytezle-server.vercel.app/orders/${orderId}`);
        if (res.ok) {
          return await res.json();
        } else {
          console.error(`Failed to fetch order with ID: ${orderId}`);
          return null;
        }
      }));
      setOrders(orders.filter(order => order !== null));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const renderOrderStatus = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <ul className="steps steps-xs">
            <li data-content="✓" className="step step-primary">Pending</li>
            <li className="step">On the way</li>
            <li className="step">Delivered</li>
          </ul>
        );
      case 'On the way':
        return (
          <ul className="steps steps-xs">
            <li data-content="✓" className="step step-primary">Pending</li>
            <li data-content="✓" className="step step-primary">On the way</li>
            <li className="step">Delivered</li>
          </ul>
        );
      case 'Delivered':
        return (
          <ul className="steps steps-xs">
            <li data-content="✓" className="step step-primary">Pending</li>
            <li data-content="✓" className="step step-primary">On the way</li>
            <li data-content="✓" className="step step-primary">Delivered</li>
          </ul>
        );
      default:
        return (
          <ul className="steps steps-xs">
            <li className="step">Pending</li>
            <li className="step">On the way</li>
            <li className="step">Delivered</li>
          </ul>
        );
    }
  };

  return (
    <div className="" style={{ marginTop: '160px' }}>

      <div className="tracking-container max-w-4xl mx-auto p-4 border border-gray-200 shadow-lg bg-white rounded-lg">
        <h1 className="text-2xl font-semibold mb-6">Order Tracking</h1>
        {userEmail ? (
          <>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice().reverse().map((order, index) => (
                  <div key={index} className="border p-3 rounded-lg shadow-sm">
                    <p className="text-md font-medium">Order ID: {order.order_id}</p>
                    <p>Total Price: ৳{order.total_price}</p>
                    <p>Ordered At: {new Date(order.timestamp).toLocaleString()}</p>
                    <p>Location: {order.address}</p>
                    <p>Phone: {order.phone_no}</p>
                    <div className="mt-2">
                      <p className="font-medium mb-1">Order Status:</p>
                      {renderOrderStatus(order.status)}
                    </div>
                    <div className="mt-2">
                      <p className="font-medium mb-1">Products:</p>
                      <ul className="list-disc list-inside">
                        {order.products.map((product, idx) => (
                          <li key={idx}>
                            {product.product_name} - ৳{product.price} x {product.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </>
        ) : (
          <h3 className="text-md font-semibold mb-4">You are not logged in.</h3>
        )}
      </div>

    </div>
  );
};

export default withAuth(Tracking);