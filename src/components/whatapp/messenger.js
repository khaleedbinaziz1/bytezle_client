import { FaFacebookMessenger } from 'react-icons/fa';

export default function MessengerButton() {
  const pageId = '140669242459651'; // Your Facebook Page ID
  const messengerUrl = `https://m.me/${pageId}`; // Messenger URL for your Facebook page

  const handleClick = () => {
    window.location.href = messengerUrl; // Redirect to Messenger
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '0px',
      left: '78px', // Adjust positioning if needed to avoid overlap with WhatsApp button
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <button
        onClick={handleClick}
        style={{
          backgroundColor: '#0084ff', // Facebook Messenger blue color
          color: 'white',
          padding: '5px',
          borderRadius: '50%',
          fontSize: '20px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          width: '55px',
          height: '55px',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FaFacebookMessenger size={30} />
      </button>
    </div>
  );
}
