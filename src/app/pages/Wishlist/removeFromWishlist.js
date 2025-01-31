import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../login/firebase/firebase';

const removeFromWishlist = async (productId) => { // Change parameter to productId
  const user = auth.currentUser;

  if (!user) {
    alert('Please log in to remove from wishlist');
    return;
  }

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      const currentWishlist = data.wishlist || [];

      // Check if productId is in the wishlist
      if (!currentWishlist.includes(productId)) { // Check against productId
        console.log('ID not found in wishlist:', productId);
        return;
      }

      // Update Firestore using arrayRemove
      await updateDoc(userDocRef, {
        wishlist: arrayRemove(productId) // Remove productId from wishlist
      });

    } else {
      console.log('No such document for user:', user.uid);
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    alert('Error removing product from wishlist');
  }
};

export default removeFromWishlist;
