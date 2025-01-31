import { db, auth } from '../../login/firebase/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export const saveCart = async (cartItems) => {
  const user = auth.currentUser;
  if (user) {
    await setDoc(doc(db, 'carts', user.uid), {
      items: cartItems,
      timestamp: serverTimestamp(),
    });
  }
};

export const getCart = async () => {
  const user = auth.currentUser;
  if (user) {
    const cartDoc = await getDoc(doc(db, 'carts', user.uid));
    if (cartDoc.exists) {
      const cartData = cartDoc.data();
      const cartAgeInDays = (new Date() - cartData.timestamp.toDate()) / (1000 * 60 * 60 * 24);
      if (cartAgeInDays <= 7) {
        return cartData.items;
      } else {
      
        await clearCart(); // Ensure to clear the cart when it's older than a week
        return [];
      }
    }
  }
  return [];
};

export const clearCart = async () => {
  const user = auth.currentUser;
  if (user) {
    await setDoc(doc(db, 'carts', user.uid), { items: [], timestamp: serverTimestamp() });
  }
};
