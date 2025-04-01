import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {NativeModules} from 'react-native';
import {WifiNetwork} from '../../../types/types';
import {RootScreenProps} from '../../navigation/types';
import {Paths} from '../../navigation/paths';
import FullScreenLoader from '../../components/full-screen-loader';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import Loader from '@components/loader';

const {WifiModule} = NativeModules;

const WifiSecurity = ({navigation}: RootScreenProps<Paths.WifiSecurity>) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [loading, setLoading] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message:
              'This app needs location access to scan for WiFi networks.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
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
        setLoading(true);
        await requestLocationPermission();
        const wifiNetworks: WifiNetwork[] = await WifiModule.scanWifiNetworks();
        setNetworks(wifiNetworks);
      } catch (error: any) {
        // console.error('Error scanning WiFi networks:', error);
        Alert.alert('Error scanning WiFi networks:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  console.log(networks);

  // const handleDisconnect = async () => {
  //   try {
  //     const result: boolean = await WifiModule.disconnect();
  //     console.log('Disconnected:', result);
  //   } catch (error) {
  //     console.error('Error disconnecting:', error);
  //   }
  // };

  const handleNetworkPress = (selectedNetwork: WifiNetwork) => {
    // navigation.navigate(Paths.WifiSecurityDetails, {wifi: selectedNetwork});
  };


  return (
    <ScreenLayout>
      <ScreenHeader name="Wifi Security" />
      <View style={{paddingVertical: 20}}>
        <CustomText
          variant="h5"
          color="#fff"
          fontFamily="Montserrat-Medium"
          style={{textAlign: 'center'}}>
          Available Networks
        </CustomText>
      </View>

      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={networks}
          keyExtractor={item => item.BSSID}
          contentContainerStyle={{paddingHorizontal: 15}}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleNetworkPress(item)}>
              <View style={styles.wifiItem}>
                <View style={styles.wifiItemRow}>
                  {item.SSID ? (
                    <CustomText variant="h6" color="#fff">
                      {item.SSID}
                    </CustomText>
                  ) : (
                    <CustomText variant="h6" color="#fff">
                      {item.BSSID}
                    </CustomText>
                  )}
                  <View
                    style={[
                      styles.badge,
                      item.isSecure ? styles.secure : styles.unsecure,
                    ]}>
                    <CustomText style={styles.badgeText}>
                      {item.isSecure ? 'Secure' : 'Unsecure'}
                    </CustomText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenLayout>
  );
};

export default WifiSecurity;

const styles = StyleSheet.create({
  wifiItem: {
    padding: 10,
    margin: 8,
    borderRadius: 20,
    backgroundColor: '#2337A8',
  },
  wifiItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  secure: {
    backgroundColor: '#22c55e',
  },
  unsecure: {
    backgroundColor: '#ef4444',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
  },
});
