import {
  View,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

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
import CustomButton from '@components/ui/custom-button';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {WifiModule} = NativeModules;

const WifiSecurity = ({navigation}: RootScreenProps<Paths.WifiSecurity>) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [connectedNetwork, setConnectedNetwork] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork>();
  const [openWifiDetails, setOpenWifiDetails] = useState(false);
  const [openWifiSetting, setOpenWifiSetting] = useState(false);
  const appState = useRef(AppState.currentState);

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

  const fetchWifiData = useCallback(async () => {
    try {
      setLoading(true);
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        CustomToast.showError('Location permission denied');
        setNetworks([]);
        setConnectedNetwork(null);
        return;
      }

      const connectedWifiInfo = await WifiModule.getCurrentWifiInfo();

      if (connectedWifiInfo?.SSID) {
        setConnectedNetwork(connectedWifiInfo);
        setOpenWifiSetting(false); // Close modal if connected

        try {
          const wifiNetworks: WifiNetwork[] =
            await WifiModule.scanWifiNetworks();
          setNetworks(wifiNetworks);
        } catch (scanError) {
          console.error('Scan error:', scanError);
          CustomToast.showError('Failed to scan networks');
        }
      } else {
        setConnectedNetwork(null);
        setNetworks([]);
        setOpenWifiSetting(true);
      }
    } catch (error: any) {
      CustomToast.showError('Error fetching WiFi networks');
      setNetworks([]);
      setConnectedNetwork(null);
      setOpenWifiSetting(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle app state changes to detect when user returns from settings
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // User returned to app - check connection status
        fetchWifiData();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [fetchWifiData]);

  useFocusEffect(
    useCallback(() => {
      fetchWifiData();
    }, [fetchWifiData]),
  );

  const handleNetworkPress = (selectedNetwork: WifiNetwork) => {
    setSelectedNetwork(selectedNetwork);
    setOpenWifiDetails(true);
  };

  const handleOpenSetting = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:WIFI');
    } else {
      Linking.sendIntent('android.settings.WIFI_SETTINGS');
    }

    // Set timeout to check connection status after user returns
    setTimeout(fetchWifiData, 1000);
  }, [fetchWifiData]);

  // Close modal automatically when network connects
  useEffect(() => {
    if (connectedNetwork && openWifiSetting) {
      setOpenWifiSetting(false);
    }
  }, [connectedNetwork, openWifiSetting]);

  return (
    <ScreenLayout style={{flex: 1}}>
      <ScreenHeader name="Wifi Security" />

      {/* <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchWifiData}
        disabled={loading}>
        <Ionicons name="refresh" size={24} color="white" />
      </TouchableOpacity> */}

      {connectedNetwork && (
        <>
          <View style={{paddingVertical: 5, marginTop: 10}}>
            <CustomText
              variant="h5"
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
              marginVertical: 5,
              marginHorizontal: 20,
            }}
          />
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
        </>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : networks.length > 0 ? (
        <>
          <View style={{paddingVertical: 5}}>
            <CustomText
              variant="h5"
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
              marginVertical: 5,
              marginHorizontal: 20,
            }}
          />

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

          <WifiDetails
            isOpen={openWifiDetails}
            onClose={() => setOpenWifiDetails(false)}
            network={selectedNetwork!}
          />
        </>
      ) : (
        !loading && (
          <View style={styles.emptyContainer}>
            <CustomText
              variant="h5"
              fontFamily="Montserrat-Bold"
              style={{color: '#fff', textAlign: 'center'}}>
              No WiFi networks found.
            </CustomText>
          </View>
        )
      )}

      <Modal
        animationType="slide"
        transparent
        visible={openWifiSetting}
        onRequestClose={() => setOpenWifiSetting(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <CustomText
              variant="h5"
              style={styles.modalText}
              fontFamily="Montserrat-SemiBold"
              color="#fff">
              To use this feature please connect to WiFi Network
            </CustomText>
            <View style={styles.modalButtonContainer}>
              <CustomButton
                bgVariant="primary"
                textVariant="primary"
                title="Go to WiFi Settings"
                onPress={handleOpenSetting}
              />
              <CustomButton
                bgVariant='danger'
                textVariant='danger'
                title="Close"
                onPress={() => setOpenWifiSetting(false)}
                style={{marginTop: 10}}
              />
            </View>
          </View>
        </View>
      </Modal>

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
  refreshButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#2337A8',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  modalButtonContainer: {
    padding: 2,
    marginTop: 4,
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
