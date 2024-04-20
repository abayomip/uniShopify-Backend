import dotenv from 'dotenv';
import express from 'express';
import { Stripe } from 'stripe';
import bodyParser from 'body-parser';


// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = 3000;

// Initialize Stripe with your secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2020-08-27', // Specify the Stripe API version you want to use
});

// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoint to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
    console.log('Request received:', req.body);

  try {
    const { totalAmount } = req.body;

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'gbp', // Use 'gbp' for British Pound
    });

    // Send the client secret back to the client
    console.log('Client secret:', paymentIntent.client_secret);
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Error creating payment intent:', err.message);
    console.error('Error creating payment intent:', err.message);

    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
