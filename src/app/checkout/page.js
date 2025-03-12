"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import withAuth from './withAuth';
import { db, auth } from '../pages/login/firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { clearCart } from '../pages/Shared/Cart/cartService';
import PaymentModal from './PaymentModal';

const Checkout = ({ user }) => {
  const [cartDetails, setCartDetails] = useState({ items: [], total: 0 });
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    location: '',
    phoneNumber: '',
    email: '',
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
  const [productDetails, setProductDetails] = useState({});
  const router = useRouter();


  const token = '7628320322:AAHebFR7sKx5e8wtbF2fuWEMQlXzDBB1LR0';  // Replace with your bot's token
  const chatId = '6948540051';  // Replace with your chat ID or your bot's chat ID



  const [paymentOption, setPaymentOption] = useState('partial'); // To track payment option
  const [totalPartialPrice, setTotalPartialPrice] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // State to control modal visibility

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
          email: '',
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



  const createOrder = async (money_phone_number) => {
    const selectedZone = zones.find(zone => zone.name === shippingInfo.zone);
    const deliveryCharge = selectedZone.delivery_charge;

    const order = {
      order_id: orderId,
      deliveryCharge: isCouponValid ? 0 : deliveryCharge,
      name: shippingInfo.name,
      address: shippingInfo.location,
      zone: shippingInfo.zone,
      phone_no: shippingInfo.phoneNumber,
      money_phone_number: money_phone_number, // Save phone number as money_phone_number
      email: shippingInfo.email,
      totalPartialPrice: totalPartialPrice,
      dueAmount: dueAmount,

      products: cartDetails.items.map(item => ({
        product_id: item._id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color, // Store selected color during order creation
      })),
      product_total: Math.round(cartDetails.total),
      total_price: Math.round(parseInt(cartDetails.total) + (isCouponValid ? 0 : deliveryCharge)),
      status: "Payment Processing",
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch('https://bytezle-server.vercel.app/addorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (res.ok) {
        // Optionally, handle the response, e.g., order confirmation, etc.

        const message = `
        New order placed!
        Order ID: ${orderId}
        Customer Name: ${shippingInfo.name}
        Shipping Address: ${shippingInfo.location}
        Phone Number: ${shippingInfo.phoneNumber}
        Email: ${shippingInfo.email}
        Shipping Zone: ${shippingInfo.zone}
        
        Order Summary:
        ${cartDetails.items.map(item => `
        - ${item.quantity}x ${item.name} (${item.color ? item.color + ' Color' : ''}) (৳${item.price} each)
        `).join('')}
        
        Total Cost: ৳${totalCost}
        Delivery Charge: ৳${zones.find(zone => zone.name === shippingInfo.zone)?.delivery_charge || 'N/A'}
        Payment Option: ${paymentOption === 'full' ? 'Full Payment' : 'Partial Payment (Due: ৳' + dueAmount + ')'}
        `;
        
      
      await sendMessage(message);  // Send the message to the bot

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
        return user._id; // Return user ID if found
      } else {
        // If email does not exist, create a new user with the addusers API
        console.log('Email does not exist, creating new user');
        await addUser(email); // Create a new user with the provided email
        return null; // Return null indicating new user creation
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  };

  const addUser = async (email) => {
    try {
      const response = await fetch('https://bytezle-server.vercel.app/addusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: '', // Leave empty or set as required
          name: '', // Leave empty as per your request
          email,
          phone: '' // Leave empty as per your request
        }),
      });

      if (response.ok) {
        console.log('User created successfully');
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
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
        console.log('Track record updated successfully');
        return true; // Return true if track record is updated
      } else {
        console.error('Failed to update track record');
        toast.error('Failed to update track record');
        return false; // Return false if track record update fails
      }
    } catch (error) {
      console.error('Error updating track record:', error);
      toast.error('An error occurred while updating the track record');
      return false;
    }
  };


  const handleConfirmPayment = async (phoneNumber) => {
    // Handle the payment confirmation (e.g., log or send to backend)

    console.log('Phone Number:', phoneNumber);

    // // After payment, create the order
    // await createOrder(phoneNumber);

    // Record coupon usage if valid
    if (isCouponValid) {
      await recordCouponUsage(userEmail, couponCode);
    }
  };


  const sendWhatsAppMessage = (phoneNumber, message) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
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
      const userId = await fetchUserIdByEmail(userEmail);
  
      if (!userId) {
        await addUser(userEmail);
        const trackRecordUpdated = await updateTrackRecord(orderId);
        if (!trackRecordUpdated) {
          setIsPlacingOrder(false);
          return;
        }
      } else {
        const trackRecordUpdated = await updateTrackRecord(orderId);
        if (!trackRecordUpdated) {
          const message = `
          New order placed!
          Order ID: ${orderId}
          Customer Name: ${shippingInfo.name}
          Shipping Address: ${shippingInfo.location}
          Phone Number: ${shippingInfo.phoneNumber}
          Email: ${shippingInfo.email}
          Shipping Zone: ${shippingInfo.zone}
          
          Order Summary:
          ${cartDetails.items.map(item => `
          - ${item.quantity}x ${item.name} (${item.color ? item.color + ' Color' : ''}) (৳${item.price} each)
          `).join('')}
          
          Total Cost: ৳${totalCost}
          Delivery Charge: ৳${zones.find(zone => zone.name === shippingInfo.zone)?.delivery_charge || 'N/A'}
          Payment Option: ${paymentOption === 'full' ? 'Full Payment' : 'Partial Payment (Due: ৳' + dueAmount + ')'}
          `;
          
        
        await sendMessage(message);  // Send the message to the bot
          setIsPlacingOrder(false);
          return;
        }
      }
  
      await createOrder(); // Proceed with order creation

  
      clearCart();
      localStorage.removeItem('cartDetails');
      setCartDetails({ items: [], total: 0 });
  
      window.location.href = '/pages/completion';
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

  const openModal = () => {
    setIsPaymentModalOpen(true); // Open the payment modal
    setIsPlacingOrder(false);
  };

  useEffect(() => {
    const savedCartDetails = localStorage.getItem('cartDetails');
    if (savedCartDetails) {
      const cart = JSON.parse(savedCartDetails);
      setCartDetails(cart);
      fetchProductDetails(cart.items);  // Fetch details for each product
    }
  }, []);

  const fetchProductDetails = async (items) => {
    try {
      const productPromises = items.map(async (item) => {
        const res = await fetch(`https://bytezle-server.vercel.app/products/${item._id}`);
        if (res.ok) {
          const productData = await res.json();
          setProductDetails((prevDetails) => ({
            ...prevDetails,
            [item._id]: productData,  // Store product details with _id as key
          }));
        } else {
          console.error(`Failed to fetch product details for ${item._id}`);
        }
      });

      await Promise.all(productPromises);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };




  // Calculate total partial price when component renders or cart changes
  useEffect(() => {
    const totalPartial = cartDetails.items.reduce((total, item) => {
      const productData = productDetails[item._id];
      return total + (productData ? parseInt(productData.partial) * item.quantity : 0);
    }, 0);

    setTotalPartialPrice(totalPartial);
  }, [cartDetails.items, productDetails]);

  // Calculate total cost including delivery charge
  const totalCost = Math.round(
    parseInt(cartDetails.total) +
    (isCouponValid ? 0 : (zones.find(zone => zone.name === shippingInfo.zone)?.delivery_charge || 0))
  );

  const dueAmount = paymentOption === 'partial' ? totalCost - totalPartialPrice : 0;

  // Send a message to the bot
  // Send a message to the Telegram bot
  const sendMessage = async (message) => {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
    const formData = new FormData();
    formData.append('chat_id', chatId);  // Your chat ID
    formData.append('text', message);    // The message content
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log('Message sent:', data);  // Log the response for debugging
  
      if (!response.ok) {
        console.error('Failed to send message:', data);  // Log any errors from the response
      }
    } catch (error) {
      console.error('Error sending message:', error);  // Log the error if the fetch fails
    }
  };
  
  

  return (
    <div className="checkout-container max-w-4xl mx-auto p-6 border border-gray-200 shadow-lg" style={{ marginTop: '150px' }}>
      <div className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white p-6 rounded-lg shadow-lg text-center mb-3">
        <h2 className="text-2xl font-semibold">You're Almost There!</h2>
        <p className="mt-2 text-lg">Complete your order and get ready to enjoy your purchase!</p>

      </div>

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
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder={'Enter your phone number'}
                  value={shippingInfo.phoneNumber}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phoneNumber: e.target.value })}
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
                <label htmlFor="zone" className="block text-sm font-medium text-gray-700">Zone:</label>
                <div className="mt-1">
                  {zones.map((zone, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`zone-${index}`}
                        name="zone"
                        value={zone.name}
                        checked={shippingInfo.zone === zone.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zone: e.target.value })}
                        className="mr-2"
                      />
                      <label htmlFor={`zone-${index}`} className="text-sm text-gray-700">{zone.name}</label>
                    </div>
                  ))}
                </div>
              </div>


            </form>
          </div>
          {/* 
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
          </div> */}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 p-2">Order Summary</h3>
          {cartDetails.items.map((item, index) => {
            const productData = productDetails[item._id]; // Access product details by _id

            return (
              <div key={index} className="flex items-center mb-4">
                <div className="w-16 h-16 relative">
                  <Image src={item.images[0]} alt={item.name} width={200} height={200} />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold">{item.name}</p>

                  <p className="text-gray-500">৳{item.price}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>

                  {/* Display color swatch */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Color: </span>
                    <div
                      className="w-6 h-6 rounded border border-gray-300 shadow-md"
                      style={{ backgroundColor: item.color }}
                    ></div>
                  </div>


                </div>
              </div>
            );
          })}

          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">Total Cost of All Products:</span>
              <span className="text-lg font-semibold">৳{parseInt(cartDetails.total)}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">Delivery Charge:</span>
              <span className="text-lg font-semibold">
                ৳{zones.find(zone => zone.name === shippingInfo.zone)?.delivery_charge}
              </span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-semibold">
                ৳{totalCost}
              </span>
            </div>

           {/* Payment Option Selection */}
<div className="mb-4 mt-10">
  <label className="text-lg font-semibold">Payment Option:</label>
  <div>
    <label className="mr-4">
      <input
        type="radio"
        name="paymentOption"
        value="full"
        checked={paymentOption === 'full'}
        onChange={() => setPaymentOption('full')}
        required
      />
      Full Payment
    </label>
    <label>
      <input
        type="radio"
        name="paymentOption"
        value="partial"
        checked={paymentOption === 'partial'}
        onChange={() => setPaymentOption('partial')}
      />
      Payment to confirm order
    </label>
  </div>
</div>


            {/* Show partial payment amount and due amount if partial payment is selected */}
            {paymentOption === 'partial' && (
              <>
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold">Advance Amount:</span>
                  <span className="text-lg font-semibold">৳{totalPartialPrice}</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold">Due Amount:</span>
                  <span className="text-lg font-semibold">৳{dueAmount}</span>
                </div>
              </>
            )}

            <button
              onClick={openModal}
              className="w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-300 focus:outline-none"

              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            totalCost={totalCost}
            dueAmount={dueAmount}
            paymentOption={paymentOption}
            onConfirmPayment={handleConfirmPayment}
            totalPartialPrice={totalPartialPrice}
            placeOrder={placeOrder}
            createOrder={createOrder}  // Pass createOrder as a prop
          />


        </div>
      </div>
    </div>
  );
};

export default Checkout;