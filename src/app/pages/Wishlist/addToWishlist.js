import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../login/firebase/firebase';

// Pass a callback to update the wishlist length
const addToWishlist = async (productId, updateWishlistLength) => {
  const user = auth.currentUser;

  if (user) {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        wishlist: arrayUnion(productId),
      });

      // Update the wishlist length in the callback function
      if (updateWishlistLength) {
        updateWishlistLength();
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  } else {
    alert('Please log in to add to wishlist');
  }
};

export default addToWishlist;
