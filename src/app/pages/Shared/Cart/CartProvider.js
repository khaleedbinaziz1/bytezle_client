"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../login/firebase/firebase';
import { saveCart, getCart, clearCart } from './cartService';

const CartContext = createContext();
const CartStateContext = createContext();
const CartDetailsContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const useCartState = () => useContext(CartStateContext);
export const useCartDetails = () => useContext(CartDetailsContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartDetails, setCartDetails] = useState({ items: [], total: 0 });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCart();
        setCartItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems([]);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchCart();
      } else {
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addToCart = async (product, quantity) => {
    const existingItemIndex = cartItems.findIndex(item => item.cartId === product._id);
    const user = auth.currentUser;
 
    let updatedCartItems;

    if (existingItemIndex !== -1) {
      updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: updatedCartItems[existingItemIndex].quantity + quantity
      };
    } else {
      const newItem = {
        ...product,
        cartId: product._id,
        quantity: quantity
      };
      updatedCartItems = [...cartItems, newItem];
    }

    setCartItems(updatedCartItems);
    await saveCart(updatedCartItems);
  };

  const removeFromCart = async (cartId) => {
    const newCartItems = cartItems.filter(item => item.cartId !== cartId);
    setCartItems(newCartItems);
    await saveCart(newCartItems);
  };

  const updateItemQuantity = async (cartId, type) => {
    const newCartItems = cartItems.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
        if (newQuantity < 1) {
          return null; // Mark item for removal
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item !== null); // Remove items marked for removal

    setCartItems(newCartItems);
    await saveCart(newCartItems);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const saveCartDetails = (details) => {
    setCartDetails(details);
  };

  const totalPrice = Array.isArray(cartItems) 
    ? cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) 
    : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        totalPrice,
      }}
    >
      <CartStateContext.Provider
        value={{
          isCartOpen,
          toggleCart,
          itemCount: cartItems.length,
        }}
      >
        <CartDetailsContext.Provider
          value={{
            cartDetails,
            saveCartDetails,
          }}
        >
          {children}
        </CartDetailsContext.Provider>
      </CartStateContext.Provider>
    </CartContext.Provider>
  );
};
