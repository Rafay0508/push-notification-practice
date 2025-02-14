import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  requestUserPermission,
  onNotificationReceived,
} from './src/utils/PushNotification';

const App = () => {
  useEffect(() => {
    requestUserPermission();
    onNotificationReceived();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Firebase Push Notifications</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
