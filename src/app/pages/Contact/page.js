'use client';

import React, { useRef, useState } from 'react';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [token] = useState(() => Math.floor(100000 + Math.random() * 900000)); // Generate a token on render

  const sendEmail = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    setSuccessMessage(''); // Clear previous success message

    try {
      await emailjs.sendForm(
        'service_2mpgm5f', // Replace with your EmailJS service ID
        'template_3qgoh8v', // Replace with your EmailJS template ID
        form.current,
        'KUH-Z0qTQVhVtbNV5' // Replace with your EmailJS public key
      );

      setSuccessMessage('Your message was sent successfully!');
      form.current.reset(); // Clear the form
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Failed to send the message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ marginTop: '120px' }}
    >
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Contact Bytezle</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We’re here to help! Whether you have a question about our products, need technical support, or just want to share feedback, feel free to reach out.
          </p>
        </div>
        <div className="card shadow-lg compact bg-base-100 p-8 rounded-lg">
          <div className="card-body">
            <h3 className="card-title text-xl font-semibold text-gray-900">Contact Information</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-gray-600" />
                <span className="font-bold">
                  Shatabdi Tower, Miakhan Nagar, Chittagong
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="text-gray-600" />
                <span className="font-bold">01756-922708</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-600" />
                <span className="font-bold">bytezle@gmail.com</span>
              </div>
            </div>

            <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">Send Us a Message</h3>
            <form ref={form} onSubmit={sendEmail} className="mt-4 space-y-4">
              {/* Hidden field for token */}
              <input type="hidden" name="token" value={token} />

              <div className="form-group">
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  className="form-control block w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  className="form-control block w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control block w-full p-2 mt-1 border border-gray-300 rounded-md"
                  rows="5"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className={`w-full py-2 px-4 text-white font-bold rounded-md ${
                  isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            {successMessage && (
              <p className="mt-4 text-center text-green-600 font-semibold">
                {successMessage} Your token number is <span className="font-bold">{token}</span>.
              </p>
            )}

            <h3 className="card-title mt-6 text-xl font-semibold text-gray-900">Find Us</h3>
            <div className="mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.0300467101592!2d91.86256949999999!3d22.3902247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad276ffb06c1c1%3A0xb82bdec753809c4c!2sAnura%20accessories!5e0!3m2!1sen!2sbd!4v1734096096232!5m2!1sen!2sbd"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;