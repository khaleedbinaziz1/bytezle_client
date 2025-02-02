// Cart.js
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useCartState } from './CartProvider';
import { FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
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
      className={`fixed inset-0 z-50 flex justify-end items-center transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Background overlay, only visible when cart is open */}
      {isCartOpen && (
        <div
          onClick={toggleCart}
          className="absolute inset-0 bg- opacity-50 z-40"
        />
      )}

      <div className="w-full sm:w-96 bg-white shadow-xl rounded-l-3xl p-6 overflow-hidden transform transition-all duration-300 ease-out z-50">
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold text-lg text-gray-800">{cartItems.length} ITEMS</span>
          <button
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-700 transition duration-300 text-xl"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col justify-center items-center space-y-3">
              <Image src={basket} alt="basket" width={200} height={100} />
              <p className="text-lg text-gray-500">Your cart is empty. Add some items!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.cartId}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md hover:scale-105 transform transition duration-300 ease-in-out"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                      onClick={() => handleQuantityChange(item.cartId, 'decrease')}
                    >
                      <FaMinus />
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                      onClick={() => handleQuantityChange(item.cartId, 'increase')}
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                    width={50}
                    height={50}
                  />

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.name.split(' ').slice(0, 2).join(' ')}
                    </p>
                    <p className="text-xs text-gray-600">৳{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <span className="text-xl font-semibold text-gray-800">Total:</span>
          <span className="text-xl font-semibold text-yellow-500">৳{totalPrice.toFixed(0)}</span>
        </div>

        <div className="mt-6">
          <button
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold text-lg rounded-lg hover:scale-105 transition duration-300 ease-in-out disabled:bg-gray-300"
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
