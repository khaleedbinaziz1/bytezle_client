import { Open_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./pages/Shared/Cart/CartProvider";
import Navbar from "./pages/Navbar/Navbar";
import Footer from "./pages/Shared/Footer/Footer";

// Using Open Sans font with lighter weights for a more subtle look
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"], // Light, regular, and medium weights
});

export const metadata = {
  title: "Bytezle | Best Gadget Store in Bangladesh",
  description: "Bytezle offers the latest gadgets and electronics in Bangladesh. Shop top-quality smartphones, laptops, accessories, and more at the best prices.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/public/favicon.ico" />

        {/* Open Graph Meta Tags (Facebook, Instagram, LinkedIn, WhatsApp) */}
        <meta property="og:title" content="Bytezle | Best Gadget Store in Bangladesh" />
        <meta property="og:description" content="Shop the latest gadgets and electronics in Bangladesh at the best prices!" />
        <meta property="og:image" content="https://bytezle.com/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://bytezle.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bytezle | Best Gadget Store in Bangladesh" />
        <meta name="twitter:description" content="Shop the latest gadgets and electronics in Bangladesh at the best prices!" />
        <meta name="twitter:image" content="https://bytezle.com/logo.png" />
        <meta name="twitter:url" content="https://bytezle.com" />

        {/* Facebook Pixel Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s) {
                if(f.fbq)return; n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n; n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', 'your-pixel-id'); // Replace 'your-pixel-id' with your actual Pixel ID
                fbq('track', 'PageView');
            `,
          }}
        />

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=your-pixel-id&ev=PageView&noscript=1"
          />
        </noscript>
      </head>

      <body className={openSans.className}>
        <CartProvider>
          <div className="fixed top-0 left-0 w-full z-50">
            <Navbar />
          </div>
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
