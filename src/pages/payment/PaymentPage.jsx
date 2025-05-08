// PaymentPage.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Load Stripe outside of a component to avoid recreating on each render
const stripePromise = loadStripe('your-publishable-key-here');

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentPage;
