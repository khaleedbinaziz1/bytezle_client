// Cart.js
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Corrected import from 'next/navigation'
import { useCart, useCartState } from './CartProvider';
import { FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import './Cart.css';
import basket from '../../../../images/shopping-cart.png'; // Adjusted path to image
import Image from 'next/image';
import { auth } from '../../login/firebase/firebase';
import { clearCart, saveCart } from './cartService';

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
    <div className={`cart-container ${isCartOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <span>{cartItems.length} ITEMS</span>
        <button className="close-button" onClick={toggleCart}>
          <FaTimes />
        </button>
      </div>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <Image src={basket} alt="basket" width={200} height={100} className="centered mt-10 pt-10" />
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.cartId} className="cart-item flex">
              <div className="quantity-controls">
                <button className="btn btn-sm btn-circle" onClick={() => handleQuantityChange(item.cartId, 'decrease')}>
                  <FaMinus />
                </button>
                <p className="pl-3 text-bold">{item.quantity}</p>
                <button className="btn btn-sm btn-circle" onClick={() => handleQuantityChange(item.cartId, 'increase')}>
                  <FaPlus />
                </button>
              </div>
              <Image src={item.images[0]} alt={item.name} className="item-image " width={50} height={50} />
              <div className="cart-item-details">
                <p className="item-name text-sm">{item.name}</p>
                <br />
                <p className="item-price text-primary">৳{(item.price * item.quantity).toFixed(0)}</p>
              </div>
              <button className="remove-button" onClick={() => removeFromCart(item.cartId)}>
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="cart-total">
        <h3>Total Price:</h3>
        <p>৳{totalPrice.toFixed(0)}</p>
      </div>
      <div className="checkout-container">
        <button
          className="btn btn-primary"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          Checkout ৳{totalPrice.toFixed(0)}
        </button>
      </div>
    </div>
  );
};

export default Cart;