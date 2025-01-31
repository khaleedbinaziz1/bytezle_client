import React from 'react';
import Image from 'next/image';
import bytezle from "../../../images/bytezle.png";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-16 text-start" style={{marginTop: '100px'}}>
      <div className="max-w-4xl mx-auto ">
        <Image src={bytezle} alt="Bytezle Logo" width={150} height={60} className="mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Bytezle</h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome to <strong>Bytezle</strong>, your ultimate destination for cutting-edge gadgets and tech innovations! At Bytezle, we believe that technology should be accessible, exciting, and transformative. Whether you're a tech enthusiast, a professional, or someone looking to simplify your daily life, we’ve got something for everyone.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
        <p className="text-lg text-gray-700 mb-6">
          Bytezle is more than just a gadget shop – we’re a team of passionate tech lovers dedicated to bringing you the latest and most reliable products from around the world. From smart home devices and wearables to gaming gear and productivity tools, we curate a wide range of gadgets that cater to your lifestyle and needs.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 mb-6">
          Our mission is simple: to empower you with the best technology that enhances your life. We strive to provide high-quality, innovative gadgets that are not only functional but also inspire creativity and efficiency. At Bytezle, we’re committed to helping you stay ahead in a fast-paced, tech-driven world.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Bytezle?</h2>
        <ul className="text-lg text-gray-700 mb-6 list-disc list-inside">
          <li><strong>Quality Assurance</strong>: Every product in our store is carefully selected and tested to ensure it meets our high standards.</li>
          <li><strong>Secure Transactions</strong>: Shop with confidence knowing that your data and payments are protected with the latest security measures.</li>
          <li><strong>Expert Support</strong>: Our team of tech experts is always here to assist you with product recommendations, troubleshooting, and more.</li>
          <li><strong>Fast Delivery</strong>: We understand the excitement of unboxing a new gadget, so we ensure quick and reliable delivery to your doorstep.</li>
        </ul>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
        <p className="text-lg text-gray-700 mb-6">
          We envision a world where technology seamlessly integrates into every aspect of life, making it smarter, easier, and more enjoyable. Bytezle is here to be your trusted partner on this journey, offering not just products but also insights, tips, and inspiration to help you make the most of your gadgets.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Bytezle Community</h2>
        <p className="text-lg text-gray-700 mb-6">
          Follow us on social media to stay updated on the latest tech trends, exclusive deals, and exciting giveaways. At Bytezle, we’re more than a shop – we’re a community of tech lovers who are passionate about innovation.
        </p>
        <p className="text-lg text-gray-700">
          Thank you for choosing Bytezle. Let’s explore the future of technology together!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;