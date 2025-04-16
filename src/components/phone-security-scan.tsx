import {
  Dimensions,
  DimensionValue,
  Image,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import CustomText from './ui/custom-text';
import {NativeModules} from 'react-native';
import {InstalledApp} from 'types/types';
import CustomButton from './ui/custom-button';

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

const {AdsServices, SecurityCheckModule, HiddenAppsModule} = NativeModules as {
  AdsServices: {
    getInstalledApps: () => Promise<InstalledApp[]>;
    getAdsServices: () => Promise<AdsServiceInfo[]>;
  };
  SecurityCheckModule: SecurityCheckModuleType;
  HiddenAppsModule: {
    getHiddenApps: () => Promise<AppInfo[]>;
  };
};

const PhoneSecurityScan = () => {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [adsServices, setAdsServices] = useState<AdsServiceInfo[]>([]);
  const [appsWithAds, setAppsWithAds] = useState<AppWithAds[]>([]);
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [securityDataCount, setSecurityDataCount] = useState(0);
  const [hiddenApps, setHiddenApps] = useState<AppInfo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

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
    } catch (error) {
      console.error('Error checking security:', error);
    }
  }, []);

  useEffect(() => {
    checkSecurity();
  }, [checkSecurity]);

  // Count number of true security flags
  useEffect(() => {
    if (securityData) {
      const count = Object.values(securityData).filter(
        value => value === true,
      ).length;
      setSecurityDataCount(count);
      console.log(`Number of true properties: ${count}`);
    }
  }, [securityData]);

  // Fetch hidden apps
  useEffect(() => {
    const fetchHiddenApps = async () => {
      try {
        const apps = await HiddenAppsModule.getHiddenApps();
        setHiddenApps(apps);
      } catch (error) {
        console.error('Error fetching hidden apps:', error);
      }
    };
    fetchHiddenApps();
  }, []);

  // Compute the normalized scores and average rating in percentage
  const averageRatingPercentage = useMemo(() => {
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

    const weightedScore = (scoreAppsWithAds * 1 + scoreSecurity * 3 + scoreHiddenApps * 3) / 7;

    // Convert the weighted score (range 0 to 5) into a percentage (0 to 100)
    return (weightedScore / 5) * 100;
  }, [appsWithAds.length, securityDataCount, hiddenApps.length]);

  // const averageRatingPercentage = useMemo(() => {
  //   const maxAppsWithAds = 10;
  //   const maxSecurityIssues = 10;
  //   const maxHiddenApps = 10;

  //   const scoreAppsWithAds = Math.max(
  //     0,
  //     5 - (appsWithAds.length / maxAppsWithAds) * 5,
  //   );

  //   const scoreSecurity = Math.max(
  //     0,
  //     5 * ((maxSecurityIssues - securityDataCount) / maxSecurityIssues),
  //   );

  //   const scoreHiddenApps = Math.max(
  //     0,
  //     5 - (hiddenApps.length / maxHiddenApps) * 5,
  //   );

  //   const avgScore = (scoreAppsWithAds + scoreSecurity + scoreHiddenApps) / 3;

  //   // Convert the average score (0 to 5) into a percentage (0 to 100)
  //   return (avgScore / 5) * 100;
  // }, [appsWithAds.length, securityDataCount, hiddenApps.length]);

  // Handle modal visibility on button press

  const handleSecurePhonePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const securityRating = averageRatingPercentage.toFixed(2);

  return (
    <>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <CustomText variant="h7" color="white">
            You are
          </CustomText>
          <CustomText
            variant="h5"
            fontFamily="Montserrat-SemiBold"
            color="white">
            {securityRating}% Secure
          </CustomText>
        </View>
        <View style={styles.progressBarContainer}>
          <ProgressBar securityRating={securityRating} />
          <Image
            source={require('@assets/images/secure.png')}
            style={styles.shieldImage}
          />
        </View>
      </View>
      <View style={styles.scanButton}>
        <CustomButton title="SCAN" onPress={handleSecurePhonePress} />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={{
                paddingVertical: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
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

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 4,
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
                  fontSize={18}
                  fontFamily="Montserrat-Bold">
                  Hidden Apps: {hiddenApps.length}
                </CustomText>
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
}

const ProgressBar: React.FC<ProgressBarProps> = ({securityRating}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  // Parse the securityRating if it is a string (remove '%' if present)
  const ratingValue =
    typeof securityRating === 'string'
      ? parseFloat(securityRating.replace('%', ''))
      : securityRating;

  const fillWidth: DimensionValue = `${(ratingValue / 100) * 85 + 10}%`;

  return (
    <View style={styles.progressBar}>
      <View style={styles.progressBackground} />
      <View style={[styles.progressFill, {width: fillWidth}]} />
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
  progressBarContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  progressBar: {
    width: '100%',
    height: 8,
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
    backgroundColor: '#21e6c1', // #21e6c1
    borderRadius: 4,
    zIndex: 1,
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
    backgroundColor: '#2337A8',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
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
