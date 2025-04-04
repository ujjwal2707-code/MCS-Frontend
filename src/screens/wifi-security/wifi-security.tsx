import {
  View,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {NativeModules} from 'react-native';
import {WifiNetwork} from '../../../types/types';
import {RootScreenProps} from '../../navigation/types';
import {Paths} from '../../navigation/paths';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import Loader from '@components/loader';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';

const {WifiModule} = NativeModules;

const WifiSecurity = ({navigation}: RootScreenProps<Paths.WifiSecurity>) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork>();
  const [openWifiDetails, setOpenWifiDetails] = useState(false);

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
        Alert.alert('Error scanning WiFi networks:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleNetworkPress = (selectedNetwork: WifiNetwork) => {
    setSelectedNetwork(selectedNetwork);
    setOpenWifiDetails(true);
  };

  return (
    <ScreenLayout style={{flex: 1}}>
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
                      N/A
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

      <WifiDetails
        isOpen={openWifiDetails}
        onClose={() => setOpenWifiDetails(false)}
        network={selectedNetwork!}
      />
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

interface WifiDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  network: WifiNetwork;
}
const WifiDetails = ({isOpen, onClose, network}: WifiDetailsProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['45%', '90%']}
      index={1}
      enablePanDownToClose={true} // Allows swipe down to close
      onClose={onClose}
      backgroundStyle={{backgroundColor: '#4E4E96'}}>
      <BottomSheetScrollView style={{flex: 1}}>
        <CustomText
          variant="h5"
          color="#fff"
          fontFamily="Montserrat-Bold"
          style={{textAlign: 'center', marginTop: 10}}>
          Wifi Security Details
        </CustomText>

        <CustomText
          variant="h5"
          color="#fff"
          fontFamily="Montserrat-Bold"
          style={{textAlign: 'center', marginTop: 10}}>
          {network.SSID ? network.SSID : 'N/A'}
        </CustomText>

        <View
          style={{
            paddingVertical: 10,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            gap: 5,
          }}>
          <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Medium">
            BSSID: {network.BSSID}
          </CustomText>
          <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Medium">
            Security Rating: {network.securityRating}
          </CustomText>
          <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Medium">
            Signal Level: {network.level} dBm
          </CustomText>
          <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Medium">
            Frequency: {network.frequency}
          </CustomText>
          <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Medium">
            Capabilities: {network.capabilities}
          </CustomText>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};
