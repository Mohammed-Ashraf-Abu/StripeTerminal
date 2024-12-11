import {View, Text, Button, Alert} from 'react-native';
import React from 'react';
import {useStripe} from '@stripe/stripe-react-native';
import axios from 'axios';
import {useConnectionHelper} from './connectionHelper';

export default function Normal() {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const {fetchPaymentIntentClientSecret} = useConnectionHelper();

  const openPaymentSheet = async () => {
    try {
      const clientSecret = await fetchPaymentIntentClientSecret();

      const res = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'apsal',
      });

      if (res.error) {
        console.error('Error initializing payment sheet:', res.error);
        Alert.alert('Error in initPaymentSheet part ');
        return;
      }
      const res2 = await presentPaymentSheet();

      if (res2.error) {
        console.error('Error presenting payment sheet:', res2.error);
        Alert.alert('Error in presentPaymentSheet ');
      } else {
        Alert.alert('Success', 'Your payment was successful!');
      }
    } catch (error) {
      Alert.alert(error);
    }
  };

  return (
    <View style={{margin: 20}}>
      <Button title="Pay Now" onPress={openPaymentSheet} />
    </View>
  );
}
