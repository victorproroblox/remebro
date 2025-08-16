import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID, // 👈 tomará el valor del .env
  currency: 'MXN',
  intent: 'capture', // opcional
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <App />
    </PayPalScriptProvider>
  </React.StrictMode>
);
