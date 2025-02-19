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
        <link rel="icon" href="../../public/favicon.ico" />

        {/* Open Graph Meta Tags for Facebook and LinkedIn */}
        <meta property="og:title" content="bytezle" />
        <meta property="og:description" content="Your short description here." />
        <meta property="og:image" content="https://bytezle.com/path/to/your-image.jpg" />
        <meta property="og:url" content="https://bytezle.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="bytezle" />
        <meta name="twitter:description" content="Your short description here." />
        <meta name="twitter:image" content="https://bytezle.com/path/to/your-image.jpg" />
        <meta name="twitter:url" content="https://bytezle.com" />
        
        {/* Add other metadata as needed */}
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
