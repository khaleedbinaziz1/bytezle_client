"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import withAuth from './withAuth';
import { db, auth } from '../pages/login/firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { clearCart } from '../pages/Shared/Cart/cartService';

const Checkout = ({ user }) => {
  const [cartDetails, setCartDetails] = useState({ items: [], total: 0 });
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    location: '',
    phoneNumber: '',
    email:'',
    zone: '',
  });
  const [name, setName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [isCouponChecked, setIsCouponChecked] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [zones, setZones] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const router = useRouter();



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserEmail(user.email);
        fetchUserDetailsByEmail(user.email);
      } else {
        setUserEmail(null);
        setName('');
        setShippingInfo({
          name: '',
          location: '',
          phoneNumber: '',
          email:'',
          zone: '',
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setOrderId(generateOrderID());
  }, []);

  useEffect(() => {
    const savedCartDetails = localStorage.getItem('cartDetails');
    if (savedCartDetails) {
      setCartDetails(JSON.parse(savedCartDetails));
    }
  }, []);

  useEffect(() => {
    fetchZones();
    generateTimeSlots();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await fetch('https://bytezle-server.vercel.app/zone');
      if (res.ok) {
        const data = await res.json();
        setZones(data[0].zones);
      } else {
        console.error('Failed to fetch zones');
      }
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Define the fixed times for the slots
    const slotTimes = [11, 13, 16, 19]; // 11 AM, 1 PM, 4 PM, 7 PM in 24-hour format

    // Start from today or the next day if all slots for today are passed
    let startTime = new Date(now);
    startTime.setHours(0, 0, 0, 0); // Reset to the start of the day

    // Check if all slots for today are passed (current time is after 7 PM)
    const isNextDay = currentHour >= 19;

    // If all slots for today are passed, move to the next day
    if (isNextDay) {
      startTime.setDate(startTime.getDate() + 1); // Move to the next day
    }

    // Generate slots for the current day or next day
    for (const hour of slotTimes) {
      const slotTime = new Date(startTime);
      slotTime.setHours(hour, 0, 0, 0); // Set the hour for the slot

      // Check if the slot is at least 3 hours ahead of the current time
      const timeDifference = (slotTime - now) / (1000 * 60 * 60); // Difference in hours
      if (timeDifference < 3) {
        continue; // Skip this slot if it's less than 3 hours ahead
      }

      // Format the slot as "11 AM, 28/01/2025"
      const formattedSlot = `${slotTime.toLocaleTimeString([], { hour: '2-digit', hour12: true }).replace(':00', '').padStart(5, '0')}, ${slotTime.toLocaleDateString('en-GB')}`;
      slots.push(formattedSlot);
    }

    // Generate slots for the next day as well
    const nextDayStartTime = new Date(startTime);
    nextDayStartTime.setDate(nextDayStartTime.getDate() + 1); // Move to the next day

    for (const hour of slotTimes) {
      const slotTime = new Date(nextDayStartTime);
      slotTime.setHours(hour, 0, 0, 0); // Set the hour for the slot

      // Format the slot as "11 AM, 29/01/2025"
      const formattedSlot = `${slotTime.toLocaleTimeString([], { hour: '2-digit', hour12: true }).replace(':00', '').padStart(5, '0')}, ${slotTime.toLocaleDateString('en-GB')}`;
      slots.push(formattedSlot);
    }

    setTimeSlots(slots);
  };
  const fetchUserDetailsByEmail = async (email) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setShippingInfo({
            name: userData.name || '',
            location: userData.address || '',
            phoneNumber: userData.phone || '',
            email: userData.email || '',
            zone: userData.zone || '',
          });
        } else {
          console.error('No such user document!');
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const generateOrderID = () => {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 8);
    return `odr${uuid}`;
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('https://bytezle-server.vercel.app/coupons');
      if (res.ok) {
        return await res.json();
      } else {
        console.error('Failed to fetch coupons');
        return [];
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  };

  const checkIfCouponUsed = async (email) => {
    try {
      const res = await fetch(`https://bytezle-server.vercel.app/usedcoupons/${email}`);
      if (res.ok) {
        const data = await res.json();
        return data.used;
      } else {
        console.error('Failed to check coupon usage');
        return false;
      }
    } catch (error) {
      console.error('Error checking coupon usage:', error);
      return false;
    }
  };

  const recordCouponUsage = async (email, couponCode) => {
    try {
      const res = await fetch('https://bytezle-server.vercel.app/usedcoupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, couponCode })
      });

      if (res.ok) {
        // Coupon usage recorded successfully
      } else {
        console.error('Failed to record coupon usage');
      }
    } catch (error) {
      console.error('Error recording coupon usage:', error);
    }
  };

  const validateCoupon = async () => {
    const hasUsedCoupon = await checkIfCouponUsed(userEmail);
    if (hasUsedCoupon) {
      setIsCouponValid(false);
      setIsCouponChecked(true);
      return;
    }

    const coupons = await fetchCoupons();
    const validCoupon = coupons.find(coupon => coupon.code === couponCode);
    setIsCouponChecked(true);
    if (validCoupon) {
      setIsCouponValid(true);
    } else {
      setIsCouponValid(false);
    }
  };

  const createOrder = async () => {
    const selectedZone = zones.find(zone => zone.name === shippingInfo.zone);
    // const deliveryCharge = cartDetails.total > 2000 ? 0 : (selectedZone ? selectedZone.delivery_charge : 0);
    const deliveryCharge = selectedZone.delivery_charge;


    const order = {
      order_id: orderId,
      deliveryCharge: isCouponValid ? 0 : deliveryCharge,
      name: shippingInfo.name,
      address: shippingInfo.location,
      zone: shippingInfo.zone,
      phone_no: shippingInfo.phoneNumber,
      email:shippingInfo.email,
      products: cartDetails.items.map(item => ({
        product_id: item._id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      product_total: Math.round(cartDetails.total),
      total_price: Math.round(parseInt(cartDetails.total) + (isCouponValid ? 0 : deliveryCharge) ),
      status: "Pending",
      timestamp: new Date().toISOString(),



    };

    try {
      const res = await fetch('https://bytezle-server.vercel.app/addorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (res.ok) {
        await updateTrackRecord(orderId);
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserIdByEmail = async (email) => {
    try {
      const res = await fetch(`https://bytezle-server.vercel.app/users/email/${email}`);
      if (res.ok) {
        const user = await res.json();
        return user._id;
      } else {
        console.error('Failed to fetch user ID');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  };

  const updateTrackRecord = async (orderId) => {
    try {
      const userId = await fetchUserIdByEmail(userEmail);
      if (!userId) {
        toast.error('Failed to update track record: User not found');
        return;
      }

      const res = await fetch(`https://bytezle-server.vercel.app/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await res.json();

      if (res.ok) {
        // Track record updated successfully
      } else {
        console.error('Failed to update track record');
        toast.error('Failed to update track record');
      }
    } catch (error) {
      console.error('Error updating track record:', error);
      toast.error('An error occurred while updating the track record');
    }
  };

  const placeOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);

    const areFieldsValid = () => {
      return (
        shippingInfo.name &&
        shippingInfo.location &&
        shippingInfo.zone &&
        shippingInfo.phoneNumber &&
        shippingInfo.email

      );
    };

    if (!areFieldsValid()) {
      alert("Please fill out all required fields before placing the order.");
      setIsPlacingOrder(false);
      return;
    }

    try {
      await createOrder();

      if (isCouponValid) {
        await recordCouponUsage(userEmail, couponCode);
      }

      clearCart();
      localStorage.removeItem('cartDetails');
      setCartDetails({ items: [], total: 0 });

      router.push('/pages/completion');
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleCouponChange = (event) => {
    setCouponCode(event.target.value);
    setIsCouponChecked(false);
    setIsCouponValid(false);
  };

  const generateOrderDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  return (
<div className="checkout-container max-w-6xl mx-auto p-8 mt-16">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
    {/* Shipping Information Section */}
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 space-y-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Information</h3>
      
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name:</label>
          <input
            type="text"
            id="name"
            className="form-input mt-1 block w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            placeholder="Enter your full name"
            value={shippingInfo.name}
            onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            className="form-input mt-1 block w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            placeholder="Enter your phone number"
            value={shippingInfo.phoneNumber}
            onChange={(e) => setShippingInfo({ ...shippingInfo, phoneNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address:</label>
          <input
            type="email"
            id="email"
            className="form-input mt-1 block w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            placeholder="Enter your email"
            value={shippingInfo.email}
            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="text-sm font-medium text-gray-700">Shipping Address:</label>
          <textarea
            id="location"
            className="form-input mt-1 block w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            placeholder="Enter your full address"
            value={shippingInfo.location}
            onChange={(e) => setShippingInfo({ ...shippingInfo, location: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="zone" className="text-sm font-medium text-gray-700">Area/Zone:</label>
          <select
            id="zone"
            className="form-select mt-1 block w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            value={shippingInfo.zone}
            onChange={(e) => setShippingInfo({ ...shippingInfo, zone: e.target.value })}
            required
          >
            <option value="">Select Area</option>
            {zones.map((zone, index) => (
              <option key={index} value={zone.name}>{zone.name}</option>
            ))}
          </select>
        </div>
      </form>
    </div>

    {/* Order Summary Section */}
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 space-y-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h3>
      
      <div className="space-y-6">
        {cartDetails.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                <Image src={item.images[0]} alt={item.name} layout="fill" objectFit="cover" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                <p className="text-gray-500">৳{item.price}</p>
                <p className="text-gray-400">Quantity: {item.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <div className="flex justify-between mb-4 text-gray-700">
          <span className="text-lg font-semibold">Total Cost of Products:</span>
          <span className="text-lg font-semibold">৳{parseInt(cartDetails.total)}</span>
        </div>

        <div className="flex justify-between mb-4 text-gray-700">
          <span className="text-lg font-semibold">Delivery Charge:</span>
          <span className="text-lg font-semibold">
            ৳{zones.find(zone => zone.name === shippingInfo.zone)?.delivery_charge || 'N/A'}
          </span>
        </div>

        <div className="flex justify-between mb-4 text-gray-800">
          <span className="text-lg font-semibold">Total Amount:</span>
          <span className="text-lg font-semibold">
            ৳{Math.round(
              parseInt(cartDetails.total) +
              (isCouponValid ? 0 : (zones.find(zone => zone.name === shippingInfo.zone)?.delivery_charge || 0))
            )}
          </span>
        </div>

        <div>
          <button
            onClick={placeOrder}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-300"
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>

      {/* Order Information */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="text-sm text-gray-500">Order ID: {orderId}</p>
        <p className="text-sm text-gray-500">Date & Time: {generateOrderDateTime()}</p>
      </div>
    </div>
  </div>
</div>

  );
};

export default withAuth(Checkout);