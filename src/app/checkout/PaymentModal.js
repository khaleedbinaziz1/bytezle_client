import React, { useState } from 'react';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';  // You can import icons you prefer
import { BsFillCreditCard2BackFill } from 'react-icons/bs'; // Example icon for payments
import { clearCart } from '../pages/Shared/Cart/cartService';
import { useRouter } from 'next/navigation';  // Updated import for useRouter

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
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmPayment(money_phone_number); // Existing payment confirmation
    onClose(); // Close the modal
    clearCart();
    localStorage.removeItem('cartDetails');

    // Call createOrder from props with money_phone_number
    createOrder(money_phone_number); // Ensure the phone number is passed

    router.push('/pages/completion', undefined, { shallow: true });
  };

  return (
    <div className="fixed inset-0 z-[1102] bg-black bg-opacity-50 flex justify-center items-center p-4">
  <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
    <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">পেমেন্ট বিস্তারিত</h2>

    {/* Display total cost and partial payment details if applicable */}
    <p className="text-lg text-gray-800 mb-2">মোট খরচ: <strong>৳{totalCost}</strong></p>
    {paymentOption === 'partial' && (
      <>
        <p className="text-lg text-gray-800 mb-2">অ্যাডভান্স পরিমাণ: <strong>৳{totalPartialPrice}</strong></p>
        <p className="text-lg text-gray-800 mb-2">বাকি পরিমাণ: <strong>৳{dueAmount}</strong></p>
      </>
    )}

 

    {/* Information for payment */}
    <p className="text-lg text-gray-800 mb-4">
      পেমেন্ট পাঠান নিম্নলিখিত নম্বরে: <strong>01756922708</strong>
    </p>

    <p className="text-lg text-gray-700 mb-4">
      অর্ডার নিশ্চিত করতে,বিকাশ বা নগদ এর মাধ্যমে পেমেন্ট করুন এবং তারপর যে নম্বর থেকে টাকা পাঠানো হয়েছে তা এখানে প্রবেশ করুন।
    </p>

    {/* Input field for phone number */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">আপনার ফোন নম্বর:</label>
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

    {/* Buttons to cancel or confirm payment */}
    <div className="flex justify-between items-center space-x-4">
      <button
        onClick={onClose}
        className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500 focus:outline-none transition duration-300"
      >
        বাতিল
      </button>
      <button
        onClick={handleConfirm}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none transition duration-300"
      >
        পেমেন্ট নিশ্চিত করুন
      </button>
    </div>
  </div>
</div>

  );
};

export default PaymentModal;
