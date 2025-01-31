import React from 'react';
import bytezle from "../../../../images/bytezle.png";
import appStoreImage from "../../../../images/app-store.svg"; // Replace with actual path
import playStoreImage from "../../../../images/play-store.svg"; // Replace with actual path
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaCheckCircle, FaShieldAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Main Footer Section */}
      <footer className="footer py-12 px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Section */}
          <div className="space-y-4">
            <h6 className="text-xl font-bold text-primary">Contact</h6>
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-primary text-xl" />
              <span className="font-medium">Shatabdi Tower, Miakhan Nagar, Chittagong</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-primary text-xl" />
              <span className="font-medium">01756-922708</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-primary text-xl" />
              <span className="font-medium">bytezle@gmail.com</span>
            </div>
          </div>

          {/* Company Links Section */}
          <div className="space-y-4">
            <h6 className="text-xl font-bold text-primary">Company</h6>
            <Link href="/pages/AboutUs" className="block font-medium hover:text-primary transition-colors duration-200">About Us</Link>
            <Link href="/pages/FAQ" className="block font-medium hover:text-primary transition-colors duration-200">FAQ</Link>
            <Link href="/pages/Terms" className="block font-medium hover:text-primary transition-colors duration-200">Terms & Conditions</Link>
            <Link href="/pages/Contact" className="block font-medium hover:text-primary transition-colors duration-200">Contact</Link>
          </div>

          {/* Our Promise Section */}
          <div className="space-y-4">
            <h6 className="text-xl font-bold text-primary">Our Commitment</h6>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-primary text-xl" />
              <span className="font-medium">Quality Assurance</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="text-primary text-xl" />
              <span className="font-medium">Secure Transactions</span>
            </div>
          </div>

          {/* App Store Links (Optional) */}
          <div className="space-y-4">
            <h6 className="text-xl font-bold text-primary">Download Our App</h6>
            <div className="flex space-x-4">
              <Link href="https://apps.apple.com/app/idYOUR_APP_ID" target="_blank" rel="noopener noreferrer">
                <Image src={appStoreImage} alt="Download on the App Store" width={120} height={40} className="hover:opacity-80 transition-opacity duration-200" />
              </Link>
              <Link href="https://play.google.com/store/apps/details?id=YOUR_APP_ID" target="_blank" rel="noopener noreferrer">
                <Image src={playStoreImage} alt="Get it on Google Play" width={135} height={40} className="hover:opacity-80 transition-opacity duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Footer Section */}
      <footer className="footer border-t border-gray-700 py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 lg:px-16 space-y-4 md:space-y-0">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image src={bytezle} alt="Bytezle Logo" width={150} height={60} className="hover:opacity-80 transition-opacity duration-200" />
            </Link>
          </div>

          {/* Copyright Text */}
          <div className="text-center md:text-right font-medium">
            <p>&copy; {new Date().getFullYear()} bytezle.com All rights reserved.</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="text-blue-500 hover:text-blue-400 text-3xl transition-colors duration-200" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="text-pink-500 hover:text-pink-400 text-3xl transition-colors duration-200" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;