import React, { useState } from 'react';
import { FaFacebookMessenger, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'; // Messenger, Call, and WhatsApp icons
import { IoChatboxOutline } from 'react-icons/io5'; // Chat bubble icon

const ChatBubble = () => {
  const [showBubbles, setShowBubbles] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Track hover state for pulse effect

  // WhatsApp
  const phoneNumber = '8801756922708'; // Replace with your phone number (International format)
  const message = 'Hello, I have a question about your services.'; // Replace with your message
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Phone Call
  const callUrl = `tel:+${phoneNumber}`;

  // Messenger
  const messengerUrl = `https://m.me/${140669242459651}`; // Replace with your Facebook Messenger link

  const handleWhatsappClick = () => {
    window.location.href = whatsappUrl; // Redirect to WhatsApp URL directly
  };

  const handleCallClick = () => {
    window.location.href = callUrl; // Redirect to Call URL
  };

  const handleMessengerClick = () => {
    window.location.href = messengerUrl; // Redirect to Facebook Messenger URL
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Main Chat Bubble (Click to open the others) */}
      <div
        onClick={() => setShowBubbles(!showBubbles)}
        onMouseOver={() => setIsHovered(true)}  // Enable hover animation
        onMouseOut={() => setIsHovered(false)} // Disable hover animation
        style={{
          backgroundColor: '#F8CF27', // WhatsApp green
          color: 'white',
          padding: '15px',
          borderRadius: '50%',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          width: '60px',
          height: '60px',
          zIndex: 1100,
          animation: !isHovered && !showBubbles ? 'pulse 1.5s infinite' : 'none', // Only pulse when not open
        }}
      >
        <IoChatboxOutline size={30} />
      </div>

      {/* WhatsApp Button */}
      {showBubbles && (
        <div
          onClick={handleWhatsappClick}
          style={{
            backgroundColor: '#25D366',
            color: 'white',
            padding: '15px',
            borderRadius: '50%',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            width: '60px',
            height: '60px',
            opacity: showBubbles ? '1' : '0',
            transform: showBubbles ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.2s',
            zIndex: 1050,
          }}
        >
          <FaWhatsapp size={30} />
        </div>
      )}

      {/* Messenger Button */}
      {showBubbles && (
        <div
          onClick={handleMessengerClick}
          style={{
            backgroundColor: '#0084ff', // Facebook Messenger blue
            color: 'white',
            padding: '15px',
            borderRadius: '50%',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            width: '60px',
            height: '60px',
            opacity: showBubbles ? '1' : '0',
            transform: showBubbles ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.4s',
            zIndex: 1040,
          }}
        >
          <FaFacebookMessenger size={30} />
        </div>
      )}

     

      {/* Add pulse animation for main bubble only */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBubble;
