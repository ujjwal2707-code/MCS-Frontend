import {
  View,
  ListRenderItem,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {NativeModules} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import Loader from '@components/loader';
import CustomText from '@components/ui/custom-text';
import {RootScreenProps} from '@navigation/types';
import {Paths} from '@navigation/paths';
import AlertBox from '@components/alert-box';
import BackBtn from '@components/back-btn';
import {AlertContext} from '@context/alert-context';

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

const SecurityAdvisor = ({
  navigation,
}: RootScreenProps<Paths.SecurityAdvisor>) => {
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState(false);

  // Alert Box
  const {alertSettings, setAlertSetting} = useContext(AlertContext);
  const alertKey = 'securityAdvisor';
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
          label: 'Lock Screen Notify',
          enabled: securityData.lockScreenNotifications,
        },
      ]
    : [];

  const renderItem: ListRenderItem<SecurityItem> = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(Paths.SecurityDetails, {id: item.key})}
      style={styles.touchable}>
      <View style={styles.itemContainer}>
        <Ionicons
          name={item.enabled ? 'checkmark-circle' : 'close-circle'}
          size={24}
          color={item.enabled ? 'green' : 'red'}
        />
        <CustomText variant="h5" color="#fff">
          {item.label}
        </CustomText>
        <CustomText
          fontFamily="Montserrat-Bold"
          variant="h5"
          style={[
            styles.statusText,
            item.enabled ? styles.greenStatus : styles.redStatus,
          ]}>
          {item.enabled ? 'Enabled' : 'Disabled'}
        </CustomText>
      </View>

      <Ionicons name="chevron-forward-sharp" size={30} color="white" />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout>
      <ScreenHeader name="Security Advisor" />

      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={item => item.key}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 10,
            backgroundColor: '#2337A8',
            borderRadius: 20,
            marginTop: 20,
          }}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      )}

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
            Not all security threats are obvious, and users may overlook
            critical vulnerabilities. Personalized recommendations guide users
            on improving device security, app safety, and online protection.
          </CustomText>
        </AlertBox>
      )}

      <BackBtn />
    </ScreenLayout>
  );
};

export default SecurityAdvisor;

const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
  },
  greenStatus: {
    color: '#16a34a',
  },
  redStatus: {
    color: '#dc2626',
  },
  divider: {
    backgroundColor: '#707070',
    height: 1,
    marginVertical: 8,
  },
});
