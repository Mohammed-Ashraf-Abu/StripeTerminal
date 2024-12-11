import {SECRET_KEY} from '@env';
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const app = express();
const key = SECRET_KEY;
const stripe = Stripe(key);

app.use(express.json());
app.use(cors());
app.get('/hello111', async (req, res) => {
  res.status(200).json({message: 'helloo World'});
});
app.post('/create-payment-intent1', async (req, res) => {
  try {
    const {amount, currency} = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({error: error.message});
  }
});
app.post('/create-payment-intent2', async (req, res) => {
  try {
    const {amount, currency} = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card_present'],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({error: error.message});
  }
});

app.post('/connection_token', async (req, res) => {
  try {
    const connectionToken = await stripe.terminal.connectionTokens.create();
    res.json({secret: connectionToken.secret});
  } catch (error) {
    console.error('Error creating connection token:', error);
    res.status(500).json({error: error.message});
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
