import {
  View,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';

import {NativeModules} from 'react-native';
import {WifiNetwork} from '../../../types/types';
import {RootScreenProps} from '../../navigation/types';
import {Paths} from '../../navigation/paths';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import Loader from '@components/loader';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import AlertBox from '@components/alert-box';
import BackBtn from '@components/back-btn';
import {AlertContext} from '@context/alert-context';
import {CustomToast} from '@components/ui/custom-toast';

const {WifiModule} = NativeModules;

const WifiSecurity = ({navigation}: RootScreenProps<Paths.WifiSecurity>) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [connectedNetwork, setConnectedNetwork] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork>();
  const [openWifiDetails, setOpenWifiDetails] = useState(false);

  // Alert Box
  const {alertSettings, setAlertSetting} = useContext(AlertContext);
  const alertKey = 'wifiSecurity';
  const [modalVisible, setModalVisible] = useState(true);
  const closeModal = () => {
    setModalVisible(false);
  };
  const handleDontShowAgain = () => {
    setAlertSetting(alertKey, true);
    closeModal();
  };
  useEffect(() => {
    setModalVisible(!alertSettings[alertKey]);
  }, [alertSettings[alertKey]]);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission Required',
          message: 'This app needs location access to scan for WiFi networks.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err: any) {
      console.error('Permission error:', err);
      CustomToast.showError('Failed to request location permission');
      return false;
    }
  };

  const fetchWifiData = async () => {
    try {
      setLoading(true);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        CustomToast.showError('Location permission denied');
        setNetworks([]);
        setConnectedNetwork(null);
        return;
      }

      const wifiNetworks: WifiNetwork[] = await WifiModule.scanWifiNetworks();
      setNetworks(wifiNetworks);

      const connectedWifiInfo = await WifiModule.getCurrentWifiInfo();

      if (connectedWifiInfo?.SSID) {
        setConnectedNetwork(connectedWifiInfo);
      } else {
        setConnectedNetwork(null);
      }
    } catch (error: any) {
      console.error('WiFi fetching error:', error);
      CustomToast.showError('Error fetching WiFi networks');
      setNetworks([]);
      setConnectedNetwork(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWifiData();
  }, []);

  const handleNetworkPress = (selectedNetwork: WifiNetwork) => {
    setSelectedNetwork(selectedNetwork);
    setOpenWifiDetails(true);
  };

  return (
    <ScreenLayout style={{flex: 1}}>
      <ScreenHeader name="Wifi Security" />
      <View style={{paddingVertical: 5, marginTop: 10}}>
        <CustomText
          variant="h6"
          color="#fff"
          fontFamily="Montserrat-Medium"
          style={{textAlign: 'center'}}>
          Connected To
        </CustomText>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: '#333',
          marginVertical: 10,
          marginHorizontal: 20,
        }}
      />

      {connectedNetwork ? (
        <TouchableOpacity
          onPress={() => handleNetworkPress(connectedNetwork)}
          style={{paddingHorizontal: 15}}>
          <View style={styles.wifiItem}>
            <View style={styles.wifiItemRow}>
              <CustomText variant="h6" color="#fff">
                {connectedNetwork?.SSID || 'N/A'}
              </CustomText>
              <View
                style={[
                  styles.badge,
                  connectedNetwork.isSecure ? styles.secure : styles.unsecure,
                ]}>
                <CustomText style={styles.badgeText}>
                  {connectedNetwork.isSecure ? 'Secure' : 'Unsecure'}
                </CustomText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={{paddingHorizontal: 15, marginTop: 10}}>
          <View
            style={{
              backgroundColor: '#1e1e1e',
              borderRadius: 12,
              padding: 15,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 5,
            }}>
            <CustomText variant="h6" color="#ccc" style={{textAlign: 'center'}}>
              Not connected to any WiFi network
            </CustomText>
          </View>
        </View>
      )}

      <View style={{paddingVertical: 5}}>
        <CustomText
          variant="h6"
          color="#fff"
          fontFamily="Montserrat-Medium"
          style={{textAlign: 'center'}}>
          Available Networks
        </CustomText>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: '#333',
          marginVertical: 10,
          marginHorizontal: 20,
        }}
      />

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

      {modalVisible && (
        <AlertBox
          isOpen={modalVisible}
          onClose={closeModal}
          onDontShowAgain={handleDontShowAgain}>
          <CustomText
            fontFamily="Montserrat-Medium"
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 20,
            }}>
            Unsecured WiFi networks expose your data to cybercriminals. Checking
            for vulnerabilities in networks helps detect fake hotspots and
            insecure connections, keeping your online activity private.
          </CustomText>
        </AlertBox>
      )}

      <BackBtn />
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

  const getEncryptionStatus = (capabilities: string) => {
    if (!capabilities) return {label: 'Unknown', color: '#FFA500'}; // Orange for unknown

    if (capabilities.includes('WPA3')) {
      return {label: 'Very Secure (WPA3)', color: '#4CAF50'}; // Green
    }
    if (capabilities.includes('WPA2')) {
      return {label: 'Secure (WPA2)', color: '#8BC34A'}; // Light Green
    }
    if (capabilities.includes('WPA')) {
      return {label: 'Moderately Secure (WPA)', color: '#FFC107'}; // Yellow
    }
    if (capabilities.includes('WEP')) {
      return {label: 'Weak Security (WEP)', color: '#FF5722'}; // Orange Red
    }
    if (capabilities.includes('ESS')) {
      return {label: 'Open Network (No Password)', color: '#F44336'}; // Red
    }

    return {label: 'Unknown', color: '#FFA500'};
  };

  const getSecurityRatingStyle = (rating: number) => {
    switch (rating) {
      case 5:
        return {label: 'Excellent', color: '#4CAF50', bg: '#E8F5E9'}; // Green
      case 4:
        return {label: 'Good', color: '#8BC34A', bg: '#F1F8E9'}; // Light Green
      case 3:
        return {label: 'Fair', color: '#FFC107', bg: '#FFF8E1'}; // Yellow
      case 2:
        return {label: 'Poor', color: '#FF9800', bg: '#FFF3E0'}; // Orange
      case 1:
      default:
        return {label: 'Critical', color: '#F44336', bg: '#FFEBEE'}; // Red
    }
  };

  const encryptionStatus = getEncryptionStatus(network.capabilities);
  const securityRatingInfo = getSecurityRatingStyle(network.securityRating);

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
          <View
            style={{
              backgroundColor: securityRatingInfo.bg,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 8,
              alignSelf: 'flex-start',
              marginVertical: 8,
            }}>
            <CustomText
              variant="h5"
              fontFamily="Montserrat-Bold"
              style={{
                color: securityRatingInfo.color,
                fontSize: 16,
              }}>
              Security Rating: {securityRatingInfo.label} (
              {network.securityRating}/5)
            </CustomText>
          </View>
          <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Medium">
            BSSID: {network.BSSID}
          </CustomText>

          {/* <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Medium">
            Signal Level: {network.level} dBm
          </CustomText>
          
          <CustomText variant="h5" color="#fff" fontFamily="Montserrat-Medium">
            Frequency: {network.frequency}
          </CustomText> */}
          <CustomText
            variant="h5"
            fontFamily="Montserrat-Medium"
            style={{color: encryptionStatus.color}}>
            Encryption: {encryptionStatus.label}
          </CustomText>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};
