"use client";

import React, { useState, useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../login/firebase/firebase';
import { useRouter } from 'next/navigation';

const errorMessages = {
  "auth/email-already-in-use": "The email address is already in use by another account.",
  "auth/invalid-email": "The email address is not valid.",
  "auth/operation-not-allowed": "Operation not allowed. Please contact support.",
  "auth/weak-password": "The password is too weak.",
  "auth/user-disabled": "The user account has been disabled by an administrator.",
  "auth/user-not-found": "There is no user record corresponding to this identifier. The user may have been deleted.",
  "auth/wrong-password": "The password is invalid or the user does not have a password.",
};

const getErrorMessage = (errorCode) => {
  return errorMessages[errorCode] || "An unknown error occurred. Please try again.";
};

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      setToastMessage("Login successful using Google!");
      setShowToast(true);
      setTimeout(() => {
        router.push("/checkout");
      }, 1000);
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('userEmail', email);

      setToastMessage("Login successful!");
      setShowToast(true);
      setTimeout(() => {
        router.push("/checkout");
      }, 1000);
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const response = await fetch('http://localhost:500/addusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage("Sign up successful!");
        setShowToast(true);
        setTimeout(() => {
          router.push("/checkout");
        }, 1000);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(getErrorMessage(err.code || err.message));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/30 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 transform transition-all duration-500 hover:scale-105">
        <h3 className="font-bold text-2xl text-center text-white">{isSignUp ? "Sign Up" : "Login"}</h3>
        <div className="space-y-4">
          <button
            className="btn btn-block bg-blue-600 text-white flex items-center justify-center py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="mr-2" /> Sign Up or Login with Google
          </button>

          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
          />

          {isSignUp ? (
            <button
              className="btn btn-primary w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          ) : (
            <button
              className="btn btn-primary w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              onClick={handleEmailLogin}
            >
              Login
            </button>
          )}

          <div className="text-center text-white">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <span
                  className="text-blue-200 cursor-pointer hover:text-blue-300 transition-all duration-300"
                  onClick={() => setIsSignUp(false)}
                >
                  Login here
                </span>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <span
                  className="text-blue-200 cursor-pointer hover:text-blue-300 transition-all duration-300"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up here
                </span>
              </p>
            )}
          </div>

          {error && <div className="text-red-500 text-center">{error}</div>}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-#FFD601-500 text-white p-4 rounded-lg shadow-lg animate-slide-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Authentication;