import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';

// Request user permission for push notifications
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('FCM Permission Granted:', authStatus);
    getFcmToken();
  }
}

// Fetch & store FCM token
const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('Stored FCM Token:', fcmToken);

  if (!fcmToken) {
    try {
      const newToken = await messaging().getToken();
      if (newToken) {
        console.log('New FCM Token:', newToken);
        await AsyncStorage.setItem('fcmToken', newToken);
      }
    } catch (error) {
      console.log('FCM Token Error:', error);
    }
  }
};

// Foreground Notifications
export const onNotificationReceived = async () => {
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground Message:', remoteMessage);
    onDisplayNotification(remoteMessage);
  });
};

// Background & Killed State Notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Message:', remoteMessage);
  onDisplayNotification(remoteMessage);
});

async function onDisplayNotification(remoteMessage) {
  await notifee.requestPermission();

  // Cancel previous notifications
  await notifee.cancelAllNotifications();

  // Create a notification channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'New Message',
    body: remoteMessage.notification?.body || 'You have a new notification',
    android: {
      channelId,
      color: '#4caf50',
      importance: AndroidImportance.HIGH,
    },
  });

  console.log('Notification displayed');
}
