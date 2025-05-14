import {
  ActivityIndicator,
  Animated,
  Dimensions,
  DimensionValue,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import CustomText from './ui/custom-text';
import {NativeModules} from 'react-native';
import {InstalledApp} from 'types/types';
import CustomButton from './ui/custom-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigation/types';
import {Paths} from '@navigation/paths';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

interface AppInfo {
  appName: string;
  packageName: string;
}

interface AdsServiceInfo {
  packageName: string;
  serviceName: string;
}

interface AppWithAds {
  packageName: string;
  name: string;
  icon: string;
  ads: string[];
}

interface SecurityData {
  rootStatus: boolean;
  usbDebugging: boolean;
  bluetooth: boolean;
  nfc: boolean;
  playProtect: boolean;
  lockScreen: boolean;
  encryption: boolean;
  devMode: boolean;
  showPassword: boolean;
  lockScreenNotifications: boolean;
}

interface SecurityCheckModuleType {
  isRooted: () => Promise<boolean>;
  isUSBDebuggingEnabled: () => Promise<boolean>;
  isBluetoothEnabled: () => Promise<boolean>;
  isNFCEnabled: () => Promise<boolean>;
  isPlayProtectEnabled: () => Promise<boolean>;
  isLockScreenEnabled: () => Promise<boolean>;
  isDeviceEncrypted: () => Promise<boolean>;
  isDeveloperModeEnabled: () => Promise<boolean>;
  isShowPasswordEnabled: () => Promise<boolean>;
  isLockScreenNotificationsEnabled: () => Promise<boolean>;
}

const {
  AdsServices,
  SecurityCheckModule,
  HiddenAppsModule,
  DeviceSecurityModule,
} = NativeModules as {
  AdsServices: {
    getInstalledApps: () => Promise<InstalledApp[]>;
    getAdsServices: () => Promise<AdsServiceInfo[]>;
  };
  SecurityCheckModule: SecurityCheckModuleType;
  HiddenAppsModule: {
    getHiddenApps: () => Promise<AppInfo[]>;
  };
  DeviceSecurityModule: {
    checkRiskyConnection: () => Promise<boolean>;
    getPermissionMisuseList: () => Promise<
      Array<{
        appName: string;
        packageName: string;
        permissions: string[];
      }>
    >;
    getPermissionMisuseCount: () => Promise<number>;
    getOutdatedAppsCount: () => Promise<number>;
  };
};

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  Paths.Home
>;

const PhoneSecurityScan = () => {
  const navigation = useNavigation<NavigationProps>();
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [adsServices, setAdsServices] = useState<AdsServiceInfo[]>([]);
  const [appsWithAds, setAppsWithAds] = useState<AppWithAds[]>([]);
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [securityDataCount, setSecurityDataCount] = useState(0);
  const [hiddenApps, setHiddenApps] = useState<AppInfo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [displayRating, setDisplayRating] = useState(0);
  const ratingAnim = useRef(new Animated.Value(0)).current;

  const [isAppsLoaded, setIsAppsLoaded] = useState(false);
  const [isSecurityLoaded, setIsSecurityLoaded] = useState(false);
  const [isHiddenAppsLoaded, setIsHiddenAppsLoaded] = useState(false);

  const [animationResetTrigger, setAnimationResetTrigger] = useState(0);

  const [riskyConnection, setRiskyConnection] = useState(false);
  const [permissionMisuse, setPermissionMisuse] = useState<
    Array<{
      appName: string;
      packageName: string;
      permissions: string[];
    }>
  >([]);
  const [permissionMisuseCount, setPermissionMisuseCount] = useState(0);
  const [outdatedAppsCount, setOutdatedAppsCount] = useState(0);
  const [isDeviceSecurityLoaded, setIsDeviceSecurityLoaded] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // Fetch installed apps and ads services concurrently
  useEffect(() => {
    const fetchAdsData = async () => {
      try {
        const [installedApps, adsData] = await Promise.all([
          AdsServices.getInstalledApps(),
          AdsServices.getAdsServices(),
        ]);
        setApps(installedApps);
        setAdsServices(adsData);
        setIsAppsLoaded(true);
      } catch (error) {
        console.error('Error fetching apps or ads services:', error);
      }
    };
    fetchAdsData();
  }, []);

  // Group apps with ads whenever apps or adsServices update
  useEffect(() => {
    if (apps.length && adsServices.length) {
      const groupedAds = adsServices.reduce(
        (acc: {[key: string]: string[]}, service) => {
          if (!acc[service.packageName]) {
            acc[service.packageName] = [];
          }
          acc[service.packageName].push(service.serviceName);
          return acc;
        },
        {} as {[key: string]: string[]},
      );
      const combined = apps
        .filter(app => groupedAds[app.packageName])
        .map(app => ({
          packageName: app.packageName,
          name: app.name,
          icon: app.icon,
          ads: groupedAds[app.packageName],
        }));
      setAppsWithAds(combined);
    }
  }, [apps, adsServices]);

  // Check security settings concurrently using Promise.all
  const checkSecurity = useCallback(async () => {
    try {
      const [
        rootStatus,
        usbDebugging,
        bluetooth,
        nfc,
        playProtect,
        lockScreen,
        encryption,
        devMode,
        showPassword,
        lockScreenNotifications,
      ] = await Promise.all([
        SecurityCheckModule.isRooted(),
        SecurityCheckModule.isUSBDebuggingEnabled(),
        SecurityCheckModule.isBluetoothEnabled(),
        SecurityCheckModule.isNFCEnabled(),
        SecurityCheckModule.isPlayProtectEnabled(),
        SecurityCheckModule.isLockScreenEnabled(),
        SecurityCheckModule.isDeviceEncrypted(),
        SecurityCheckModule.isDeveloperModeEnabled(),
        SecurityCheckModule.isShowPasswordEnabled(),
        SecurityCheckModule.isLockScreenNotificationsEnabled(),
      ]);
      setSecurityData({
        rootStatus,
        usbDebugging,
        bluetooth,
        nfc,
        playProtect,
        lockScreen,
        encryption,
        devMode,
        showPassword,
        lockScreenNotifications,
      });
      setIsSecurityLoaded(true);
    } catch (error) {
      console.error('Error checking security:', error);
    }
  }, []);

  useEffect(() => {
    checkSecurity();
  }, [checkSecurity]);

  // Count number of Misconfigured settings.
  useEffect(() => {
    if (securityData) {
      const insecureWhenTrue = [
        'rootStatus',
        'usbDebugging',
        'nfc',
        'lockScreenNotifications',
        'bluetooth',
        'devMode',
      ];

      const insecureWhenFalse = [
        'playProtect',
        'lockScreen',
        'encryption',
        'showPassword',
      ];

      const insecureCount = [
        ...insecureWhenTrue.filter(
          key => securityData[key as keyof SecurityData] === true,
        ),
        ...insecureWhenFalse.filter(
          key => securityData[key as keyof SecurityData] === false,
        ),
      ].length;

      setSecurityDataCount(insecureCount);
    }
  }, [securityData]);

  // Fetch hidden apps
  useEffect(() => {
    const fetchHiddenApps = async () => {
      try {
        const apps = await HiddenAppsModule.getHiddenApps();
        setHiddenApps(apps);
        setIsHiddenAppsLoaded(true);
      } catch (error) {
        console.error('Error fetching hidden apps:', error);
      }
    };
    fetchHiddenApps();
  }, []);

  // Fetch Device Security Data
  useEffect(() => {
    const fetchDeviceSecurityData = async () => {
      try {
        const [isRisky, misuseCount, outdatedCount, misuseList] =
          await Promise.all([
            DeviceSecurityModule.checkRiskyConnection(),
            DeviceSecurityModule.getPermissionMisuseCount(),
            DeviceSecurityModule.getOutdatedAppsCount(),
            DeviceSecurityModule.getPermissionMisuseList(),
          ]);

        // console.log(
        //   isRisky,
        //   misuseCount,
        //   outdatedCount,
        //   misuseList,
        //   'riskyConnection,permissionMisuseCount,outdatedAppsCount,misuseList',
        // );

        setRiskyConnection(isRisky);
        setPermissionMisuse(misuseList);
        setPermissionMisuseCount(misuseCount);
        setOutdatedAppsCount(outdatedCount);
        setIsDeviceSecurityLoaded(true);
      } catch (error) {
        console.error('Error fetching device security data:', error);
      }
    };
    fetchDeviceSecurityData();
  }, []);

  // Compute the normalized scores and average rating in percentage
  const averageRatingPercentage = useMemo(() => {
    if (
      !isAppsLoaded ||
      !isSecurityLoaded ||
      !isHiddenAppsLoaded ||
      !isDeviceSecurityLoaded
    ) {
      return 0;
    }
    const maxAppsWithAds = 10;
    const maxSecurityIssues = 10;
    const maxHiddenApps = 10;

    const scoreAppsWithAds = Math.max(
      0,
      5 - (appsWithAds.length / maxAppsWithAds) * 5,
    );
    const scoreSecurity = Math.max(
      0,
      5 * ((maxSecurityIssues - securityDataCount) / maxSecurityIssues),
    );
    const scoreHiddenApps = Math.max(
      0,
      5 - (hiddenApps.length / maxHiddenApps) * 5,
    );
    const scoreRisky = riskyConnection ? 0 : 5;

    const weightedScore =
      (scoreAppsWithAds * 1 +
        scoreSecurity * 3 +
        scoreHiddenApps * 3 +
        scoreRisky * 2 ) /
      (1 + 3 + 3 + 2 );

    const percentage = (weightedScore / 5) * 100;
    return Math.max(percentage, 20);
  }, [
    appsWithAds.length,
    securityDataCount,
    hiddenApps.length,
    riskyConnection,
    isAppsLoaded,
    isSecurityLoaded,
    isHiddenAppsLoaded,
    isDeviceSecurityLoaded,
  ]);

  const handleSecurePhonePress = async () => {
    setIsScanning(true);
    try {
      // Re-fetch all data sources
      const [
        installedApps,
        adsData,
        hiddenAppsData,
        isRisky
      ] = await Promise.all([
        AdsServices.getInstalledApps(),
        AdsServices.getAdsServices(),
        HiddenAppsModule.getHiddenApps(),
        DeviceSecurityModule.checkRiskyConnection()
      ]);

      // Update apps and ads services state
      setApps(installedApps);
      setAdsServices(adsData);
      setHiddenApps(hiddenAppsData);
      setRiskyConnection(isRisky);

      // Re-check security settings
      const securityResults = await Promise.all([
        SecurityCheckModule.isRooted(),
        SecurityCheckModule.isUSBDebuggingEnabled(),
        SecurityCheckModule.isBluetoothEnabled(),
        SecurityCheckModule.isNFCEnabled(),
        SecurityCheckModule.isPlayProtectEnabled(),
        SecurityCheckModule.isLockScreenEnabled(),
        SecurityCheckModule.isDeviceEncrypted(),
        SecurityCheckModule.isDeveloperModeEnabled(),
        SecurityCheckModule.isShowPasswordEnabled(),
        SecurityCheckModule.isLockScreenNotificationsEnabled(),
      ]);

      // Update security data state
      setSecurityData({
        rootStatus: securityResults[0],
        usbDebugging: securityResults[1],
        bluetooth: securityResults[2],
        nfc: securityResults[3],
        playProtect: securityResults[4],
        lockScreen: securityResults[5],
        encryption: securityResults[6],
        devMode: securityResults[7],
        showPassword: securityResults[8],
        lockScreenNotifications: securityResults[9],
      });
      setIsAppsLoaded(true);
      setIsHiddenAppsLoaded(true);
      setIsSecurityLoaded(true);
      setIsDeviceSecurityLoaded(true);

      // Trigger animations by resetting and updating rating
      ratingAnim.setValue(0);
      setAnimationResetTrigger(prev => prev + 1);
      Animated.timing(ratingAnim, {
        toValue: averageRatingPercentage,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    } catch (error) {
      console.error('Error during scan:', error);
    } finally {
      setIsScanning(false);
      setModalVisible(true);
    }
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const securityRating = averageRatingPercentage.toFixed(2);

  useEffect(() => {
    if (averageRatingPercentage > 0) {
      ratingAnim.setValue(0); // Reset animation to 0
      Animated.timing(ratingAnim, {
        toValue: averageRatingPercentage,
        duration: 1500,
        useNativeDriver: false,
      }).start();
      const listener = ratingAnim.addListener(({value}) => {
        setDisplayRating(value);
      });
      return () => {
        ratingAnim.removeListener(listener);
      };
    }
  }, [averageRatingPercentage]);

  return (
    <>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <CustomText variant="h7" color="white">
            You are
          </CustomText>
          <View style={styles.animatedTextContainer}>
            <CustomText
              variant="h5"
              fontFamily="Montserrat-SemiBold"
              color="white">
              {displayRating.toFixed(2)}% Secure
            </CustomText>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <ProgressBar
            securityRating={securityRating}
            resetTrigger={animationResetTrigger}
          />
          <Animated.Image
            source={require('@assets/images/secure.png')}
            style={[
              styles.shieldImage,
              {
                transform: [{scale: pulseAnim}],
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.scanButton}>
        {isScanning ? (
          <ActivityIndicator size="large" color="#21e6c1" />
        ) : (
          <CustomButton title="SCAN" onPress={handleSecurePhonePress} />
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={{
                paddingVertical: 10,
                display: 'flex',
                gap: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('@assets/icons/adwarescan.png')}
                    style={styles.icon}
                  />
                  <CustomText
                    variant="h5"
                    color="#fff"
                    fontSize={16}
                    fontFamily="Montserrat-Bold">
                    Apps with Ads: {appsWithAds.length}
                  </CustomText>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate(Paths.AdwareScan)}>
                  <Ionicons name="arrow-redo-sharp" size={30} color="white" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('@assets/icons/securityadv.png')}
                    style={styles.icon}
                  />
                  <CustomText
                    variant="h5"
                    color="#fff"
                    fontSize={16}
                    fontFamily="Montserrat-Bold">
                    Misconfigured Setting: {securityDataCount}
                  </CustomText>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate(Paths.SecurityAdvisor)}>
                  <Ionicons name="arrow-redo-sharp" size={30} color="white" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('@assets/icons/hiddenapps.png')}
                    style={styles.icon}
                  />
                  <CustomText
                    variant="h5"
                    color="#fff"
                    fontSize={16}
                    fontFamily="Montserrat-Bold">
                    Hidden Apps: {hiddenApps.length}
                  </CustomText>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate(Paths.HiddenApps)}>
                  <Ionicons name="arrow-redo-sharp" size={30} color="white" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  padding: 6,
                  marginTop: 10,
                }}>
                <View
                  style={{
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                  }}>
                  <Ionicons
                    name={riskyConnection ? 'warning' : 'shield-checkmark'}
                    size={30}
                    color={riskyConnection ? '#ff4444' : '#21e6c1'}
                  />
                  {riskyConnection ? (
                    <CustomText
                      variant="h5"
                      color="#fff"
                      fontSize={16}
                      numberOfLine={2}
                      fontFamily="Montserrat-Bold">
                      Risky Network Connection
                    </CustomText>
                  ) : (
                    <CustomText
                      variant="h5"
                      color="#fff"
                      fontSize={16}
                      numberOfLine={2}
                      fontFamily="Montserrat-Bold">
                      Secure Wifi Connection
                    </CustomText>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate(Paths.WifiSecurity)}>
                  <Ionicons name="arrow-redo-sharp" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <CustomButton
              title="Close"
              bgVariant="danger"
              textVariant="danger"
              onPress={handleCloseModal}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PhoneSecurityScan;

interface ProgressBarProps {
  securityRating: number | string;
  resetTrigger: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  securityRating,
  resetTrigger,
}) => {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const numericRating = parseFloat(String(securityRating));
    if (!containerWidth) return;

    // Reset animation on every resetTrigger change
    fillAnim.setValue(0);
    const targetWidth = (numericRating / 100) * (containerWidth * 0.85);

    Animated.timing(fillAnim, {
      toValue: targetWidth,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [resetTrigger, containerWidth, securityRating]);

  return (
    <View
      style={styles.progressBar}
      onLayout={event => setContainerWidth(event.nativeEvent.layout.width)}>
      <View style={styles.progressBackground} />
      <Animated.View style={[styles.progressFill, {width: fillAnim}]}>
        <LinearGradient
          colors={['#21e6c1', '#1acba3']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    position: 'absolute',
    top: 20,
    bottom: 80,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 8,
    marginLeft: 50,
  },
  animatedTextContainer: {
    position: 'relative',
    marginTop: 4,
  },
  progressBarContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  progressBar: {
    width: '100%',
    height: 12,
    position: 'relative',
    overflow: 'visible',
  },
  progressBackground: {
    position: 'absolute',
    left: '15%', // Match shield overlap
    right: 0,
    height: '100%',
    backgroundColor: '#FF0000', // #FF0000
    borderRadius: 8,
  },
  progressFill: {
    position: 'absolute',
    left: '15%',
    height: '100%',
    // borderRadius: 4,
    zIndex: 1,
    shadowColor: '#21e6c1',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  progressEndIndicator: {
    position: 'absolute',
    right: -10,
    top: -6,
    zIndex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 2,
  },
  scanningContainer: {
    alignItems: 'center',
    padding: 20,
  },
  scanningText: {
    marginTop: 10,
    fontFamily: 'Montserrat-Medium',
  },
  shieldImage: {
    position: 'absolute',
    left: -15, // Original position
    top: -70, // Original position
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain',
    zIndex: 2, // Keep shield above everything
  },
  scanButton: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  // Modal style
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2337A8', // #2337A8
    padding: 20,
    borderRadius: 8,
    width: '90%',
    // alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
