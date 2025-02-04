// Cart.js
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useCartState } from './CartProvider';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa'; // Removed FaTrash
import { auth } from '../../login/firebase/firebase';
import { clearCart, saveCart } from './cartService';
import Image from 'next/image';
import basket from '../../../../images/shopping-cart.png';

const Cart = () => {
  const { cartItems, removeFromCart, totalPrice, updateItemQuantity } = useCart();
  const { isCartOpen, toggleCart } = useCartState();
  const router = useRouter();

  const handleCheckout = () => {
    const user = auth.currentUser;
    const currentPath = window.location.pathname;
    if (user) {
      const cartDetails = { items: cartItems, total: totalPrice.toFixed(0) };
      localStorage.setItem('cartDetails', JSON.stringify(cartDetails));
      saveCart(cartItems);
      router.push('/checkout');
      toggleCart();
    } else {
      localStorage.setItem('redirectPath', currentPath);
      clearCart();
      router.push('/pages/Authentication');
    }
  };

  const handleQuantityChange = (cartId, type) => {
    updateItemQuantity(cartId, type);
  };

  return (
    <div
    className={`fixed inset-0 z-[1101] flex justify-end items-start transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
  >
    {/* Background overlay */}
    {isCartOpen && (
      <div
        onClick={toggleCart}
        className="absolute inset-0 bg-black opacity-0 z-40"
      />
    )}
  
    <div className="w-full h-full sm:w-80 bg-white shadow-xl  p-4 overflow-y-auto transform transition-all duration-300 ease-out z-50">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-sm text-white">{cartItems.length} ITEMS</span>
        <button
  onClick={toggleCart}
  className="bg-gray-200 hover:bg-gray-300 text-black hover:text-gray-400 transition duration-300 text-lg rounded-full p-4"
>
  <FaTimes />
</button>

      </div>
  
      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center space-y-2 " style={{marginTop: "80%"}}>
            <Image src={basket} alt="basket" width={150} height={75} />
            <p className="text-sm text-gray-400 ">Your cart is empty. Add some items!</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.cartId}
              className="flex justify-between items-center p-3 bg-gray-600 rounded-lg shadow-md hover:scale-105 transform transition duration-300 ease-in-out"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <button
                    className="bg-gray-600 text-white p-1 rounded-full hover:bg-gray-500 transition duration-300"
                    onClick={() => handleQuantityChange(item.cartId, 'decrease')}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-sm font-semibold text-white">{item.quantity}</span>
                  <button
                    className="bg-gray-600 text-white p-1 rounded-full hover:bg-gray-500 transition duration-300"
                    onClick={() => handleQuantityChange(item.cartId, 'increase')}
                  >
                    <FaPlus />
                  </button>
                </div>
  
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg shadow-md"
                  width={48}
                  height={48}
                />
  
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {item.name.split(' ').slice(0, 2).join(' ')}
                  </p>
                  <p className="text-xs text-gray-400">৳{(item.price * item.quantity).toFixed(0)}</p>
                </div>
              </div>
  
              <button
                onClick={() => removeFromCart(item.cartId)}
                className="text-gray-400 hover:text-gray-500 transition duration-300"
              >
                <FaTimes size={18} />
              </button>
            </div>
          ))
        )}
      </div>
  
      <div className="flex justify-between items-center mt-4">
        <span className="text-lg font-semibold text-white">Total:</span>
        <span className="text-lg font-semibold text-yellow-400">৳{totalPrice.toFixed(0)}</span>
      </div>
  
      <div className="mt-4">
        <button
          className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold text-sm rounded-lg hover:scale-105 transition duration-300 ease-in-out disabled:bg-gray-600"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          Checkout (৳{totalPrice.toFixed(0)})
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default Cart;