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
  });
  const [name, setName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [isCouponChecked, setIsCouponChecked] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // New state


  const router = useRouter();
  const deliveryCharge = 150; // Delivery charge variable

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
          });

        } else {
          console.error('No such user document!');
        }

      }
    } catch (error) {
   
    }
  };


  const generateOrderID = () => {
    const uuid = uuidv4().replace(/-/g, '').substring(0, 8);
    return `odr${uuid}`;
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('http://localhost:500/coupons');
      if (res.ok) {
        return await res.json();
      } else {
        console.error('Failed to fetch coupons');
        return [];
      }
    } catch (error) {

      return [];
    }
  };

  const checkIfCouponUsed = async (email) => {
    try {
      const res = await fetch(`http://localhost:500/usedcoupons/${email}`);
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
      const res = await fetch('http://localhost:500/usedcoupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, couponCode })
      });

      if (res.ok) {

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
    setIsCouponChecked(true); // Set coupon check state to true
    if (validCoupon) {
      setIsCouponValid(true);
    } else {
      setIsCouponValid(false);
    }
  };


  const createOrder = async () => {
    const order = {
      order_id: orderId,

      deliveryCharge: isCouponValid ? 0 : deliveryCharge,
      name: shippingInfo.name,
      address: shippingInfo.location,
      division: shippingInfo.division,
      phone_no: shippingInfo.phoneNumber,
      products: cartDetails.items.map(item => ({

        product_id: item._id,

        product_name: item.name,
        price: item.price,
        quantity: item.quantity
      })),

      total_price: parseInt(cartDetails.total) + (isCouponValid ? 0 : deliveryCharge), // Waiving delivery charge if coupon is valid

      status: "Pending",
      timestamp: new Date().toISOString()
    };




    try {
      const res = await fetch('http://localhost:500/addorders', {
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
      const res = await fetch(`http://localhost:500/users/email/${email}`);
      if (res.ok) {
        const user = await res.json();
        return user._id; // Adjust according to your actual user schema
      } else {
        console.error('Failed to fetch user ID');
        return null;
      }
    } catch (error) {

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



      const res = await fetch(`http://localhost:500/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }) // Fix the request body
      });

      const data = await res.json();


      if (res.ok) {

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
    if (isPlacingOrder) return; // Prevent multiple clicks
    setIsPlacingOrder(true); // Disable button

    const areFieldsValid = () => {
      return (
        shippingInfo.name &&
        shippingInfo.location &&
        shippingInfo.division &&
        shippingInfo.phoneNumber
      );
    };

    if (!areFieldsValid()) {
      alert("Please fill out all required fields before placing the order.");
      setIsPlacingOrder(false); // Re-enable the button if validation fails
      return;
    }

    try {
      await createOrder();

      if (isCouponValid) {
        await recordCouponUsage(userEmail, couponCode);
      }

      // Clear the cart in Firebase
      clearCart();

      // Clear the cart in local storage and update local state
      localStorage.removeItem('cartDetails');
      setCartDetails({ items: [], total: 0 });

      // Redirect to completion page
      router.push('/pages/completion');
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsPlacingOrder(false); // Re-enable the button after the process is complete
    }
  };



  const handleCouponChange = (event) => {
    setCouponCode(event.target.value);
    setIsCouponChecked(false); // Reset coupon check state
    setIsCouponValid(false); // Reset coupon validation state
  };

  const generateOrderDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  return (
    <div className="checkout-container max-w-4xl mx-auto p-6 border border-gray-200 shadow-lg" style={{ marginTop: '150px' }}>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div>
          <div className="bg-gray-50 p-2 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                <input
                  type="text"
                  id="name"
                  className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder={'Enter your name'}
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location:</label>
                <textarea
                  id="location"
                  className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="Enter your location"
                  value={shippingInfo.location}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700">Division:</label>
                <select
                  id="division"
                  className="form-select mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                  value={shippingInfo.division}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, division: e.target.value })}
                >
                  <option value="">Select your division</option>
                  <option value="Chattogram">Chattogram</option>
                </select>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder={'Enter your phone number'}
                  value={shippingInfo.phoneNumber}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phoneNumber: e.target.value })}
                />
              </div>
            </form>

          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h3 className="text-xl font-semibold mb-4">Coupon Code</h3>
            <div className="flex">
              <input
                type="text"
                className="form-input flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={handleCouponChange}
              />
              <button
                onClick={validateCoupon}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
            {isCouponChecked && (
              isCouponValid ? (
                <p className="text-#FFD601-500 mt-2">Coupon applied successfully!</p>
              ) : (
                <p className="text-red-500 mt-2">Invalid coupon code</p>
              )
            )}
          </div>

          {/* <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-semibold">৳{parseInt(cartDetails.total) + (isCouponValid ? 0 : deliveryCharge)}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Delivery Charge: ৳{isCouponValid ? '0' : deliveryCharge}
            </p>
            <button
              onClick={placeOrder}
              className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none"
            >
              Place Order
            </button>
          </div> */}
        </div>


        <div>
          <h3 className="text-xl font-semibold mb-4 p-2">Order Summary</h3>
          {cartDetails.items.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <div className="w-16 h-16 relative">
                <Image src={item.images[0]} alt={item.name} layout="fill" objectFit="cover" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-gray-500">৳{item.price}</p>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}

          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">Total Cost of All Products:</span>
              <span className="text-lg font-semibold">৳{parseInt(cartDetails.total)}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">VAT:</span>
              <span className="text-lg font-semibold">৳ 0</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">Service Charge:</span>
              <span className="text-lg font-semibold">৳ 0</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">TAX:</span>
              <span className="text-lg font-semibold">৳ 0</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">Delivery Charge:</span>
              <span className="text-lg font-semibold">৳{isCouponValid ? '0' : deliveryCharge}</span>
            </div>


            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-semibold">৳{parseInt(cartDetails.total) + (isCouponValid ? 0 : deliveryCharge)}</span>
            </div>

            {/* <p className="text-sm text-gray-600 mb-4">
              Delivery Charge: ৳{isCouponValid ? '0' : deliveryCharge}
            </p> */}
            <button
              onClick={placeOrder}
              className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none"
              disabled={isPlacingOrder} // Disable button while placing order
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm">Order ID: {orderId}</p>
            <p className="text-sm">Date & Time: {generateOrderDateTime()}</p>
          </div>
        </div>





      </div>
    </div>
  );
};

export default withAuth(Checkout);