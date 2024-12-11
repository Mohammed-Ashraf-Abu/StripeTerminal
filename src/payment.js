import {
  requestNeededAndroidPermissions,
  useStripeTerminal,
} from '@stripe/stripe-terminal-react-native';
import React, {useEffect} from 'react';
import {Platform, View} from 'react-native';
import Reader from './M2Reader';
import Normal from './normal';

const Payment = () => {
  const {initialize} = useStripeTerminal();

  useEffect(() => {
    const getPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await requestNeededAndroidPermissions({
            accessFineLocation: {
              title: 'Location Permission',
              message: 'Stripe Terminal needs access to your location',
              buttonPositive: 'Accept',
            },
          });
          if (granted) {
            initializeStripeTerminal();
          } else {
            console.error(
              'Location and BT services are required in order to connect to a reader.',
            );
          }
        } else {
          initializeStripeTerminal();
        }
      } catch (e) {
        console.error(e);
      }
    };

    const initializeStripeTerminal = async () => {
      try {
        await initialize();
        console.log('Stripe Terminal initialized');
      } catch (error) {
        console.error('Failed to initialize Stripe Terminal:', error);
      }
    };
    getPermission();
  }, []);

  return (
    <View>
      <Normal />
      <Reader />
    </View>
  );
};

export default Payment;
