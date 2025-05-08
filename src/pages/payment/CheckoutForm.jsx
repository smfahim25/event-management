// CheckoutForm.js
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Fetch clientSecret from the backend on component mount
    const fetchClientSecret = async () => {
      const { data } = await axios.post('http://localhost:3000/create-payment-intent', {
        amount: 1000, // Amount in cents (e.g., $10.00)
        currency: 'usd',
      });
      setClientSecret(data.clientSecret);
    };
    fetchClientSecret();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error('Payment error:', error);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || !clientSecret}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
