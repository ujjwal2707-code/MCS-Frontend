import {View, Text, Platform, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';

import {NativeModules} from 'react-native';

const {WifiModule} = NativeModules;
interface WifiNetwork {
  SSID: string;
  BSSID: string;
  capabilities: string;
  frequency: number;
  level: number;
  timestamp: number;
  securityRating: number;
  isSecure: boolean;
}

const WifiSecurity = () => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [ip, setIp] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  console.log('====================================');
  console.log(networks);
  console.log('====================================');

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission Required",
            message:
              "This app needs location access to scan for WiFi networks.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const init = async () => {
      try {
        await requestLocationPermission();
        const wifiNetworks: WifiNetwork[] = await WifiModule.scanWifiNetworks();
        setNetworks(wifiNetworks);
      } catch (error) {
        console.error('Error scanning WiFi networks:', error);
      }
    };
    init();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>WifiSecurity</Text>
    </View>
  );
};

export default WifiSecurity;
