import {useStripeTerminal} from '@stripe/stripe-terminal-react-native';
import axios from 'axios';
import {useState, useEffect, useRef} from 'react';
import {Alert} from 'react-native';

export const useConnectionHelper = () => {
  const [Reader, setReaders] = useState([]);

  const {
    discoverReaders,
    cancelDiscovering,
    disconnectReader,
    connectBluetoothReader,
    retrievePaymentIntent,
    collectPaymentMethod,
    confirmPaymentIntent,
  } = useStripeTerminal({
    onUpdateDiscoveredReaders: async readers => {
      setReaders(readers);
      // if (readers && readers.length > 0) {
      //   await cancelDiscovering();
      // }
    },
    onFinishDiscoveringReaders: () => {
      console.log('Finished discovering readers');
    },
  });
  const amount = 100;
  const amountInCent = amount * 100;

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const response = await axios.post(
        'https://b859-106-51-68-34.ngrok-free.app/create-payment-intent1',
        {
          amount: amountInCent,
          currency: 'usd',
        },
      );
      const {clientSecret} = response.data;
      return clientSecret;
    } catch (error) {
      console.error('Error fetching client secret:', error);
      Alert.alert('Error', 'Unable to fetch payment details.');
    }
  };
  const fetchPaymentIntent = async () => {
    try {
      const response = await axios.post(
        'https://b859-106-51-68-34.ngrok-free.app/create-payment-intent2',
        {
          amount: amountInCent,
          currency: 'usd',
        },
      );
      const {clientSecret} = response.data;
      return clientSecret;
    } catch (error) {
      console.error('Error fetching client secret:', error);
      Alert.alert('Error', 'Unable to fetch payment details.');
    }
  };
  const findReader = async setShow => {
    const discoveryTimeout = 30000;

    try {
      console.log('Starting discovery process...');

      const discoveryPromise = discoverReaders({
        discoveryMethod: 'bluetoothScan',
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Discovery timeout')),
          discoveryTimeout,
        ),
      );

      const {readers, error} = await Promise.race([
        discoveryPromise,
        timeoutPromise,
      ]);

      // if (error) {
      //   console.error('Error during reader discovery:', error);
      //   Alert.alert('Error', 'Reader discovery failed.');
      //   return;
      // }
    } catch (err) {
      if (err.message === 'Discovery timeout') {
        try {
          await cancelDiscovering();
          Alert.alert('Timeout', 'Discovery process timed out.');
          setShow(false);
        } catch (cancelError) {
          Alert.alert(
            'Error',
            'Failed to cancel discovery process.',
            cancelError,
          );
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred during discovery.');
      }
    }
  };

  const disconnect = async () => {
    await disconnectReader();
    Alert.alert('Disconnected Successfully');
  };

  const cancelDiscover = async () => {
    try {
      await cancelDiscovering();
      setReaders([]);
      Alert.alert('Discovery cancelled');
    } catch (err) {
      Alert.alert(err);
    }
  };

  const connectReader = async item => {
    try {
      const {reader, error} = await connectBluetoothReader({
        reader: item,
        locationId: item.locationId,
      });
      if (error) {
        console.log('connectBluetoothReader error', error);
        return;
      }
      Alert.alert('Reader Connected Successfully');
      console.log('Reader connected successfully', reader);
    } catch (err) {
      Alert.alert(err);
    }
  };

  const collectPayment = async () => {
    try {
      const clientSecret = await fetchPaymentIntent();
      console.log('Client Secret:', clientSecret);

      const {paymentIntent: retrieveIntent, errorR} =
        await retrievePaymentIntent(clientSecret);
      console.log('Retrieved Intent:', retrieveIntent);

      if (!retrieveIntent || errorR) {
        console.error('Error in retrievePaymentIntent:', errorR);
        Alert.alert('Error', 'Failed to retrieve payment intent.');
        return;
      }

      const result = await collectPaymentMethod({
        paymentIntent: retrieveIntent,
      });
      if (result.error) {
        console.error('Error in collectPaymentMethod:', result.error);
        Alert.alert('Error', 'Failed to collect payment method.');
        return;
      }
      console.log('Collect Intent:', result);

      const resultsss = await confirmPaymentIntent({
        paymentIntent: retrieveIntent,
      });
      if (resultsss.error) {
        console.error('Error in confirmPaymentIntent:', resultsss.error);
        Alert.alert('Error', 'Payment confirmation failed.');
        return;
      }
      console.log('Confirm Intent:', resultsss);

      Alert.alert('Success', 'Payment processed successfully!');
    } catch (exception) {
      console.error('Unexpected error:', exception);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return {
    findReader,
    disconnect,
    cancelDiscover,
    Reader,
    connectReader,
    fetchPaymentIntentClientSecret,
    collectPayment,
    fetchPaymentIntent,
  };
};
