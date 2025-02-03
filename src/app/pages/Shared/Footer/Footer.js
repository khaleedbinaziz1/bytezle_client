import React from 'react';
import bytezle from "../../../../images/bytezle.png";
import { FaFacebook, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { AiOutlineFileText, AiOutlineInfoCircle } from 'react-icons/ai';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { MdBusiness } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white">

      {/* Top Footer Section */}
      <footer className="py-16 px-4 sm:px-8 lg:px-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Contact Information Section */}
          <div className="space-y-6">
            <h6 className="text-2xl font-semibold text-primary">Contact Us</h6>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-primary text-2xl" />
              <span className="font-medium">Shatabdi Tower, Miakhan Nagar, Chittagong</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-primary text-2xl" />
              <span className="font-medium">01756-922708</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-primary text-2xl" />
              <span className="font-medium">bytezle@gmail.com</span>
            </div>
          </div>

          {/* Company Links Section */}
          <div className="space-y-6">
            <h6 className="text-2xl font-semibold text-primary">Company</h6>
            <Link href="/pages/AboutUs" className="block flex items-center space-x-2 font-medium hover:text-primary transition-colors duration-200">
              <AiOutlineInfoCircle className="text-primary text-xl" />
              <span>About Us</span>
            </Link>
            <Link href="/pages/FAQ" className="block flex items-center space-x-2 font-medium hover:text-primary transition-colors duration-200">
              <AiOutlineFileText className="text-primary text-xl" />
              <span>FAQ</span>
            </Link>
            <Link href="/pages/Terms" className="block flex items-center space-x-2 font-medium hover:text-primary transition-colors duration-200">
              <AiOutlineFileText className="text-primary text-xl" />
              <span>Terms & Conditions</span>
            </Link>
            <Link href="/pages/Contact" className="block flex items-center space-x-2 font-medium hover:text-primary transition-colors duration-200">
              <MdBusiness className="text-primary text-xl" />
              <span>Contact</span>
            </Link>
          </div>

          {/* Our Commitment Section */}
          <div className="space-y-6">
            <h6 className="text-2xl font-semibold text-primary">Our Commitment</h6>
            <div className="flex items-center space-x-4">
              <RiSecurePaymentLine className="text-primary text-2xl" />
              <span className="font-medium">Secure Transactions</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaCheckCircle className="text-primary text-2xl" />
              <span className="font-medium">Quality Assurance</span>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-6">
            <h6 className="text-2xl font-semibold text-primary">Follow Us</h6>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook className="text-blue-500 hover:text-blue-400 text-3xl transition-colors duration-200" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="text-pink-500 hover:text-pink-400 text-3xl transition-colors duration-200" />
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* Bottom Footer Section */}
      <footer className="border-t border-gray-700 py-6">
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
        </div>
      </footer>
    </div>
  );
};

export default Footer;
