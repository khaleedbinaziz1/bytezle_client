import Link from 'next/link';

export default function WhatsAppButton() {
  const phoneNumber = '01756922708'; // Replace with your phone number
  const message = 'Hello, I have a question about your services.'; // Replace with your message
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div>
      <Link href={whatsappUrl} passHref>
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#25D366',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Message us on WhatsApp
        </a>
      </Link>
    </div>
  );
}