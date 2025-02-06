import React, { useState, useEffect } from 'react';
import { FaGoogle, FaTimes } from 'react-icons/fa';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from './firebase/firebase'; // Ensure to import your Firebase auth and Firestore instances
import { setDoc, doc } from 'firebase/firestore';
import { saveCart } from '../Shared/Cart/cartService'; // Import your saveCart function
import { getErrorMessage } from './errorMessages'; // Import your error message handler
import loginSideImage from '../../../images/Login-bg.svg'; // Example import for login side image

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    // Example: Perform any necessary operations with cartItems from localStorage
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      handleLoginSuccess(result.user);
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Example: Console log the logged in user's information


      // Fetch current user details after login
      const currentUser = auth.currentUser;
      if (currentUser) {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        await saveCart(currentUser.uid, cartItems);

        setToastMessage("Login successful!");
        setShowToast(true);
        setShowModal(false);
        setTimeout(() => {
          setShowToast(false);
        }, 1000);
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, {
          displayName: name,
          phoneNumber: phone
        });

        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        await saveCart(user.uid, cartItems);

        // Save user info to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name,
          email,
          phone
        });

        // Upload user data to MongoDB through your server
        const response = await fetch('https://bytezle-server.vercel.app/addusers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            name,
            email,
            phone
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setToastMessage("Sign up successful!");
          setShowToast(true);
          setShowModal(false);
          setTimeout(() => {
            setShowToast(false);
          }, 1000);
        } else {
          throw new Error(data.message);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err.code || err.message));
    }
  };


  const handleLoginSuccess = async (user) => {
    setToastMessage("Login successful!");
    setShowModal(false);
    setShowToast(true);

    // Retrieve cart items from localStorage (Example: Already shown in handleEmailLogin)

    // Save cart items to Firestore if needed (Example: Already shown in handleEmailLogin)

    setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };

  return (
    <>
    {showModal && (
      <dialog id="login_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative bg-white rounded-lg shadow-xl p-6 max-w-md">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => {
              setShowModal(false); // Immediately set to false
              setTimeout(() => setShowModal(true), 500); // Auto-reset to true after 5s
            }}
          >
            <FaTimes className="w-5 h-5" />
          </button>
  
          {/* Modal Title */}
          <h3 className="font-bold text-xl mb-4 text-gray-800">
            {isSignUp ? 'Sign Up' : 'Login'}
          </h3>
  
          {/* Modal Content */}
          <div className="space-y-4">
            {/* Google Login Button */}
            <button
              className="btn btn-block bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center py-2 rounded-lg transition-all"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="mr-2" /> Sign Up or Login with Google
            </button>
  
            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}
  
            {/* Email and Password Fields */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
  
            {/* Sign Up or Login Button */}
            {isSignUp ? (
              <button
                className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            ) : (
              <button
                className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
                onClick={handleEmailLogin}
              >
                Login
              </button>
            )}
  
            {/* Toggle Between Sign Up and Login */}
            <div className="mt-4 text-center text-sm text-gray-600">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => setIsSignUp(false)}
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign Up here
                  </span>
                </p>
              )}
            </div>
  
            {/* Error Message */}
            {error && (
              <div className="mt-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </dialog>
    )}
  
    {/* Toast Notification */}
    {showToast && (
      <div className="toast toast-center toast-middle animate-fade-in">
        <div className="alert alert-success bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <span>{toastMessage}</span>
        </div>
      </div>
    )}
  </>
  );
};

export default Login;
