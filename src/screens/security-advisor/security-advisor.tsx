import {
  View,
  Text,
  ListRenderItem,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeModules} from 'react-native';
import FullScreenLoader from '../../components/full-screen-loader';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

interface SecurityItem {
  key: string;
  label: string;
  enabled: boolean;
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

const {SecurityCheckModule} = NativeModules as {
  SecurityCheckModule: SecurityCheckModuleType;
};

const SecurityAdvisor = () => {
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(false);

  console.log('====================================');
  console.log(securityData);
  console.log('====================================');

  const checkSecurity = async () => {
    try {
      setLoading(true);
      const rootStatus = await SecurityCheckModule.isRooted();
      const usbDebugging = await SecurityCheckModule.isUSBDebuggingEnabled();
      const bluetooth = await SecurityCheckModule.isBluetoothEnabled();
      const nfc = await SecurityCheckModule.isNFCEnabled();
      const playProtect = await SecurityCheckModule.isPlayProtectEnabled();
      const lockScreen = await SecurityCheckModule.isLockScreenEnabled();
      const encryption = await SecurityCheckModule.isDeviceEncrypted();
      const devMode = await SecurityCheckModule.isDeveloperModeEnabled();
      const showPassword = await SecurityCheckModule.isShowPasswordEnabled();
      const lockScreenNotifications =
        await SecurityCheckModule.isLockScreenNotificationsEnabled();

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSecurity();
  }, []);

  const listData: SecurityItem[] = securityData
    ? [
        {
          key: 'rootStatus',
          label: 'Root Access',
          enabled: securityData.rootStatus,
        },
        {
          key: 'usbDebugging',
          label: 'USB Debugging',
          enabled: securityData.usbDebugging,
        },
        {
          key: 'bluetooth',
          label: 'Bluetooth',
          enabled: securityData.bluetooth,
        },
        {key: 'nfc', label: 'NFC', enabled: securityData.nfc},
        {
          key: 'playProtect',
          label: 'Play Protect',
          enabled: securityData.playProtect,
        },
        {
          key: 'lockScreen',
          label: 'Lock Screen',
          enabled: securityData.lockScreen,
        },
        {
          key: 'encryption',
          label: 'Encryption',
          enabled: securityData.encryption,
        },
        {
          key: 'devMode',
          label: 'Developer Mode',
          enabled: securityData.devMode,
        },
        {
          key: 'showPassword',
          label: 'Show Password',
          enabled: securityData.showPassword,
        },
        {
          key: 'lockScreenNotifications',
          label: 'Lock Screen Notifications',
          enabled: securityData.lockScreenNotifications,
        },
      ]
    : [];

  const renderItem: ListRenderItem<SecurityItem> = ({item}) => (
    <TouchableOpacity
      // onPress={() =>
      //   router.push({ pathname: "/security/[id]", params: { id: item.key } })
      // }
      style={styles.touchable}>
      <View style={styles.itemContainer}>
        <Ionicons
          name={item.enabled ? 'checkmark-circle' : 'close-circle'}
          size={24}
          color={item.enabled ? 'green' : 'red'}
        />
        <Text style={styles.itemLabel}>{item.label}</Text>
      </View>
      <Text
        style={[
          styles.statusText,
          item.enabled ? styles.greenStatus : styles.redStatus,
        ]}>
        {item.enabled ? 'Enabled' : 'Disabled'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <FlatList
            data={listData}
            keyExtractor={item => item.key}
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 20}}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SecurityAdvisor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
  },
  safeArea: {
    height: '100%',
    width: '100%',
  },
  contentContainer: {
    paddingVertical: 20,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    marginLeft: 16,
    fontSize: 18,
    fontFamily: 'Rubik'
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Rubik-Bold',
  },
  greenStatus: {
    color: '#16a34a',
  },
  redStatus: {
    color: '#dc2626',
  },
});
