import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {NativeModules} from 'react-native';
import {InstalledApp} from '../../types/types';

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

const PhoneScan = () => {
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

  // Compute the normalized scores and average rating
  const averageRating = useMemo(() => {
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

    return (scoreAppsWithAds + scoreSecurity + scoreHiddenApps) / 3;
  }, [appsWithAds.length, securityDataCount, hiddenApps.length]);

  // Handle modal visibility on button press
  const handleSecurePhonePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Secure your phone" onPress={handleSecurePhonePress} />
        {securityDataCount > 0 &&
          appsWithAds.length > 0 &&
          hiddenApps.length > 0 && (
            <Text style={styles.summaryText}>
              Average Security Rating: {averageRating.toFixed(2)} / 5
            </Text>
          )}
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Security Summary</Text>
            <Text style={styles.summaryText}>
              Apps with Ads: {appsWithAds.length}
            </Text>
            <Text style={styles.summaryText}>
              Misconfigured Settings: {securityDataCount}
            </Text>
            <Text style={styles.summaryText}>
              Hidden Apps: {hiddenApps.length}
            </Text>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    width: '70%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
    fontFamily: 'monospace',
  },
  summaryText: {
    fontSize: 18,
    color: '#333',
    marginVertical: 5,
    fontFamily: 'monospace',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'monospace',
  },
});

export default PhoneScan;
