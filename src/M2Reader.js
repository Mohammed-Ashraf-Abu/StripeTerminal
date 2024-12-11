/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  SafeAreaView,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useConnectionHelper} from './connectionHelper';

const Reader = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    findReader,
    disconnect,
    cancelDiscover,
    Reader,
    connectReader,
    collectPayment,
  } = useConnectionHelper();

  const RenderItem = ({item}) => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {item.map((reader, index) => {
          return (
            <View key={index} style={styles.readerList}>
              <Text>{reader.serialNumber}</Text>
              <Button title="Connect" onPress={() => connectReader(reader)} />
            </View>
          );
        })}
      </View>
    );
  };
  useEffect(() => {
    if (Reader.length > 0) {
      setLoading(false);
      console.log(Reader);
    }
  }, [Reader]);
  return (
    <SafeAreaView>
      <View style={{margin: 20}}>
        <Button
          title="Discover M2Reader"
          onPress={() => {
            setShow(!show);
            findReader(setShow);
          }}
        />
        <Button
          title="Cancel discover"
          onPress={() => {
            setShow(false);
            cancelDiscover();
          }}
        />
      </View>
      {show &&
        (loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <RenderItem item={Reader} />
        ))}
      <View style={{margin: 20}}>
        <Button
          title="Disconnect"
          onPress={() => {
            disconnect();
            setShow(false);
          }}
        />
      </View>
      <View style={{margin: 20}}>
        <Button
          title="Collect Payment"
          onPress={() => {
            collectPayment();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  readerList: {
    flexDirection: 'row',
    gap: 20,
    padding: 5,
    alignItems: 'center',
  },
});
export default Reader;
