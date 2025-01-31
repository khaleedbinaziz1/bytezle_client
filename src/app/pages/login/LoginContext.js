"use client"
import React, { createContext, useContext, useState } from 'react';
import Login from './Login';

const LoginContext = createContext();

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};

export const LoginProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const showLoginModal = () => setIsLoginModalOpen(true);
  const hideLoginModal = () => setIsLoginModalOpen(false);

  return (
    <LoginContext.Provider value={{ isLoginModalOpen, showLoginModal, hideLoginModal }}>
      {children}
      <Login isOpen={isLoginModalOpen} onClose={hideLoginModal} />
    </LoginContext.Provider>
  );
};
