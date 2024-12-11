import React from 'react';
import {SafeAreaView, ScrollView, useColorScheme, View} from 'react-native';

import {StripeProvider} from '@stripe/stripe-react-native';
import {StripeTerminalProvider} from '@stripe/stripe-terminal-react-native';
import axios from 'axios';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import Payment from './src/payment';
import {PUBLISH_KEY} from '@env';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const fetchTokenProvider = async () => {
    const response = await axios.post(
      'https://b859-106-51-68-34.ngrok-free.app/connection_token',
    );
    console.log(response.data);
    return response.data.secret;
  };
  console.log(PUBLISH_KEY);
  return (
    <StripeTerminalProvider
      logLevel="verbose"
      tokenProvider={fetchTokenProvider}>
      <StripeProvider publishableKey={PUBLISH_KEY}>
        <SafeAreaView style={backgroundStyle}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
            <Header />
            <View
              style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
              }}>
              <Payment />
            </View>
          </ScrollView>
        </SafeAreaView>
      </StripeProvider>
    </StripeTerminalProvider>
  );
}

export default App;
