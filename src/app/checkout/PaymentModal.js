import React, { useState } from 'react';
import bkash from '../../images/bkash.svg';
import nagad from '../../images/nagad.svg';
import { clearCart } from '../pages/Shared/Cart/cartService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const PaymentModal = ({
  isOpen,
  onClose,
  totalCost,
  dueAmount,
  paymentOption,
  onConfirmPayment,
  totalPartialPrice,
  createOrder,  // Accept createOrder as a prop
}) => {
  const [money_phone_number, setMoney_phone_number] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');  // State for selected payment option
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmPayment(money_phone_number, selectedPayment); // Pass selected payment option
    onClose(); // Close the modal
    clearCart();
    localStorage.removeItem('cartDetails');

    // Call createOrder from props with money_phone_number
    createOrder(money_phone_number, selectedPayment); // Pass selected payment option

    router.push('/pages/completion', undefined, { shallow: true });
  };

  return (
    <div className="fixed inset-0 z-[1102] bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg sm:max-w-md md:max-w-lg">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6 border-b-2 border-gray-300 pb-4">পেমেন্ট বিস্তারিত</h2>

        {/* Display total cost and partial payment details if applicable */}
        <p className="text-sm sm:text-lg text-gray-800 mb-3">মোট খরচ: <strong>৳{totalCost}</strong></p>
        {paymentOption === 'partial' && (
          <>
            <p className="text-sm sm:text-lg text-gray-800 mb-3">অ্যাডভান্স পরিমাণ: <strong>৳{totalPartialPrice}</strong></p>
            <p className="text-sm sm:text-lg text-gray-800 mb-3">বাকি পরিমাণ: <strong>৳{dueAmount}</strong></p>
          </>
        )}

        {/* Information for payment */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <p className="text-sm sm:text-lg text-gray-800 mb-4">
            পেমেন্ট পাঠান নিম্নলিখিত নম্বরে: 
            <br /> <strong>bKash: 01756922708</strong>
            <br /> <strong>Nagad: 01756922708</strong>
          </p>
          <p className="text-sm sm:text-lg text-gray-700 mb-4">
            অর্ডার নিশ্চিত করতে, বিকাশ বা নগদ এর মাধ্যমে পেমেন্ট করুন এবং তারপর যে নম্বর থেকে টাকা পাঠানো হয়েছে তা এখানে প্রবেশ করুন।
          </p>
        </div>

        {/* Payment option selection */}
        <div className="mb-6">
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">পেমেন্ট অপশন নির্বাচন করুন:</label>
          <div className="flex flex-wrap justify-center sm:justify-start items-center space-x-4">
            <label htmlFor="bkash" className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300">
              <input
                type="radio"
                id="bkash"
                name="payment_option"
                value="bkash"
                checked={selectedPayment === 'bkash'}
                onChange={() => setSelectedPayment('bkash')}
                className="form-radio"
              />
              <Image src={bkash} alt="bKash" width={70} height={70} className="transform transition duration-200 hover:scale-110" />
            </label>

            <label htmlFor="nagad" className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300">
              <input
                type="radio"
                id="nagad"
                name="payment_option"
                value="nagad"
                checked={selectedPayment === 'nagad'}
                onChange={() => setSelectedPayment('nagad')}
                className="form-radio"
              />
              <Image src={nagad} alt="Nagad" width={70} height={70} className="transform transition duration-200 hover:scale-110" />
            </label>
          </div>
        </div>

        {/* Input field for phone number */}
        <div className="mb-6">
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">যে নম্বর থেকে টাকা পাঠানো হয়েছে তা প্রবেশ করুন:</label>
          <input
            type="tel"
            pattern="^[0-9]{11}$" // Ensures it's a phone number with 11 digits
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
            value={money_phone_number}
            onChange={(e) => setMoney_phone_number(e.target.value)}
            required
            placeholder="017XXXXXXXX"
          />
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-300 my-6"></div>

        {/* Buttons to cancel or confirm payment */}
        <div className="flex flex-wrap justify-center sm:justify-between items-center space-x-6 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500 focus:outline-none transition duration-300 transform hover:scale-105"
          >
            বাতিল
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none transition duration-300 transform hover:scale-105"
          >
            পেমেন্ট নিশ্চিত করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
