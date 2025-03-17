import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {NativeModules} from 'react-native';
import {WifiNetwork} from '../../../types/types';
import {RootScreenProps} from '../../navigation/types';
import {Paths} from '../../navigation/paths';
import FullScreenLoader from '../../components/full-screen-loader';

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
      } catch (error) {
        console.error('Error scanning WiFi networks:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // const handleDisconnect = async () => {
  //   try {
  //     const result: boolean = await WifiModule.disconnect();
  //     console.log('Disconnected:', result);
  //   } catch (error) {
  //     console.error('Error disconnecting:', error);
  //   }
  // };

  const handleNetworkPress = (selectedNetwork: WifiNetwork) => {
    navigation.navigate(Paths.WifiSecurityDetails, {wifi: selectedNetwork});
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerText}>📡 Available WiFi Networks</Text>
        <FlatList
          data={networks}
          keyExtractor={item => item.BSSID}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleNetworkPress(item)}>
              <View style={styles.wifiItem}>
                <View style={styles.wifiItemRow}>
                  <View>
                    <Text style={styles.wifiSSID}>{item.SSID}</Text>
                    <Text style={{color: 'red'}}>
                      Security Rating: {item.securityRating}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      item.isSecure ? styles.secure : styles.unsecure,
                    ]}>
                    <Text style={styles.badgeText}>
                      {item.isSecure ? 'Secure' : 'Unsecure'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default WifiSecurity;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
  },
  container: {
    paddingHorizontal: 6,
    paddingVertical: 24,
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  wifiItem: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android elevation
    elevation: 5,
  },
  wifiItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wifiSSID: {
    fontSize: 18,
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
    fontSize: 14
  },
});
