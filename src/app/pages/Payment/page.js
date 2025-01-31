// pages/payment.js
"use client"
import { useState } from 'react';
import axios from 'axios';

export default function Payment() {
  const [formData, setFormData] = useState({
    total_amount: '',
    cus_name: '',
    cus_email: '',
    cus_add1: '',
    cus_add2: '',
    cus_city: '',
    cus_state: '',
    cus_postcode: '',
    cus_country: '',
    cus_phone: '',
    cus_fax: '',
    ship_name: '',
    ship_add1: '',
    ship_add2: '',
    ship_city: '',
    ship_state: '',
    ship_postcode: '',
    ship_country: '',
    value_a: '',
    value_b: '',
    value_c: '',
    value_d: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/initiate-payment', formData);
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation error', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="total_amount" value={formData.total_amount} onChange={handleChange} placeholder="Total Amount" required />
      <input type="text" name="cus_name" value={formData.cus_name} onChange={handleChange} placeholder="Customer Name" required />
      <input type="email" name="cus_email" value={formData.cus_email} onChange={handleChange} placeholder="Customer Email" required />
      <input type="text" name="cus_add1" value={formData.cus_add1} onChange={handleChange} placeholder="Customer Address 1" required />
      <input type="text" name="cus_add2" value={formData.cus_add2} onChange={handleChange} placeholder="Customer Address 2" />
      <input type="text" name="cus_city" value={formData.cus_city} onChange={handleChange} placeholder="Customer City" required />
      <input type="text" name="cus_state" value={formData.cus_state} onChange={handleChange} placeholder="Customer State" />
      <input type="text" name="cus_postcode" value={formData.cus_postcode} onChange={handleChange} placeholder="Customer Postcode" required />
      <input type="text" name="cus_country" value={formData.cus_country} onChange={handleChange} placeholder="Customer Country" required />
      <input type="text" name="cus_phone" value={formData.cus_phone} onChange={handleChange} placeholder="Customer Phone" required />
      <input type="text" name="cus_fax" value={formData.cus_fax} onChange={handleChange} placeholder="Customer Fax" />
      <input type="text" name="ship_name" value={formData.ship_name} onChange={handleChange} placeholder="Shipping Name" />
      <input type="text" name="ship_add1" value={formData.ship_add1} onChange={handleChange} placeholder="Shipping Address 1" />
      <input type="text" name="ship_add2" value={formData.ship_add2} onChange={handleChange} placeholder="Shipping Address 2" />
      <input type="text" name="ship_city" value={formData.ship_city} onChange={handleChange} placeholder="Shipping City" />
      <input type="text" name="ship_state" value={formData.ship_state} onChange={handleChange} placeholder="Shipping State" />
      <input type="text" name="ship_postcode" value={formData.ship_postcode} onChange={handleChange} placeholder="Shipping Postcode" />
      <input type="text" name="ship_country" value={formData.ship_country} onChange={handleChange} placeholder="Shipping Country" />
      <input type="text" name="value_a" value={formData.value_a} onChange={handleChange} placeholder="Value A" />
      <input type="text" name="value_b" value={formData.value_b} onChange={handleChange} placeholder="Value B" />
      <input type="text" name="value_c" value={formData.value_c} onChange={handleChange} placeholder="Value C" />
      <input type="text" name="value_d" value={formData.value_d} onChange={handleChange} placeholder="Value D" />
      <button type="submit">Pay Now</button>
    </form>
  );
}
