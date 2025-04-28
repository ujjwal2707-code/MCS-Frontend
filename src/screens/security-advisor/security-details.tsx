import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RootScreenProps} from '@navigation/types';
import {Paths} from '@navigation/paths';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import {Linking} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '@components/ui/custom-button';
import BackBtn from '@components/back-btn';

type CheckItem = {
  label: string;
  passed: boolean;
};

type DetailInfo = {
  title: string;
  description: string;
  checks?: CheckItem[];
  steps?: string[];
  note?: string;
  buttonLabel?: string;
  result?: string;
};

const detailMap: Record<string, DetailInfo> = {
  rootStatus: {
    title: 'Root Status',
    description:
      'Android by default provides a lot of security mechanisms to safeguard your data and applications. But if you Root your device, all the default security mechanisms provided by Android become void. This increases the risk and your data may be stolen by attackers.\n\nMake sure that your device is not rooted. In case you find your device in a rooted state, do not use it to perform any financial transactions and immediately contact your device manufacturer for appropriate action.',
    checks: [
      {label: 'Test Keys', passed: false},
      {label: 'SU Exists', passed: false},
      {label: 'Super User App', passed: false},
    ],
    result: 'Not Rooted',
  },
  playProtect: {
    title: 'Google Play Protect',
    description:
      "All Android apps undergo rigorous security testing before appearing in Google Play Store. Google Play Protect scans 125 billion apps daily to ensure everything remains spot on. That way, no matter where you download an app from, you know it's been checked by Google Play Protect.",
    steps: [
      'Open the Google Play Store App.',
      'At the top right, tap the Profile icon.',
      'Tap Play Protect and then Settings.',
      'Turn Scan apps with Play Protect ON or OFF.',
    ],
    note: 'Google Play Protect is on by default, but you can turn it off. For better security, we recommend that you always keep Google Play Protect on.',
    // buttonLabel: "Go to Play Protect Settings",
  },
  usbDebugging: {
    title: 'USB Debugging',
    description:
      'USB debugging is often used by developers to communicate with the device over a USB connection. If USB debugging is enabled, it would be possible for the attackers to access your sensitive application data over USB. For security reasons, keep it disabled always.',
    steps: [
      'Tap on, Go To System Settings.',
      'Scroll down.',
      'Tap on USB Debugging option to disable USB Debugging.',
      'Turn Scan apps with Play Protect ON or OFF.',
    ],
    note: 'Not all models may support this feature.',
    buttonLabel: 'GO TO SYSTEM SETTINGS',
  },
  bluetooth: {
    title: 'Bluetooth',
    description:
      'Bluetooth is a mechanism to transfer data through your mobile device to other devices such as headphones, speakers, printers, laptops and smart phones.Keeping Bluetooth enabled always increases the risk of attackers connecting to your device and steal your sensitive data. So, make sure it is in disabled state always. Enable it only when in use and disable it after use.',
    steps: ['Tap on, Go To System Settings', 'Disable Bluetooth.'],
    note: 'Not all models may support this feature.',
    buttonLabel: 'GO TO SYSTEM SETTINGS',
  },
  lockScreen: {
    title: 'Lock Screen Status',
    description:
      'Screen Lock helps to secure the applications & users sensitive data from any unauthorized access to your device.If Screen Lock is disabled, anyone would be able to access your private data. So, for security & privacy purposes, set a lock on your screen immediately.',
    steps: [
      'Tap on, Go To System Settings',
      'Scroll down.',
      'Tap on Fingerprint, face & password.',
      'Set password.',
    ],
    note: 'Not all models may support this feature.',
    buttonLabel: 'GO TO SYSTEM SETTINGS',
  },
  encryption: {
    title: 'Device Encryption',
    description:
      'Device Encryption ensures that users sensitive data is encrypted when the device is in a locked state. It helps to prevent unauthorized access in case the device is stolen. The user is advised to check that the Device Encryption and Lock Screen are always enabled.',
    steps: [
      'Tap on, Go To System Settings',
      'Scroll down.',
      'Tap on Encryption & credentials.',
      'See the status of Encryption & credentials.',
    ],
    note: 'Not all models may support this feature.',
    buttonLabel: 'GO TO SYSTEM SETTINGS',
  },
  devMode: {
    title: 'Developer Status',
    description: `If the developer option is enabled, the users mobile device can be easily exploited.The attacker can connect the mobile device to other devices, and they can steal sensitive data. It is advised not to enable it until and unless there is an absolute need of enabling the same.`,
    steps: ['Tap on, Go To System Settings', 'Disable Developer Option.'],
    note: 'Not all models may support this feature.',
    buttonLabel: 'GO TO SYSTEM SETTINGS',
  },
  showPassword: {
    title: 'Show Password Status',
    description: `If the developer option is enabled, the users mobile device can be easily exploited.The attacker can connect the mobile device to other devices, and they can steal sensitive data. It is advised not to enable it until and unless there is an absolute need of enabling the same.`,
    steps: ['Tap on, Go To System Settings', 'Disable Developer Option.'],
    note: 'Not all models may support this feature.',
    buttonLabel: 'GO TO SYSTEM SETTINGS',
  },
  lockScreenNotifications: {
    title: 'Lock Screen Notification Status',
    description: `If the notifications are shown on the lock screen, anyone with access to your device may see them as well without unlocking. These notifications may contain sensitive data like financial OTPs, So, it is advised to keep LockScreen notification disabled.`,
    steps: [
      'Tap on, Go To System Settings',
      'Scroll down & tap on Lock Screen.',
      'Tap on Hide sensitive content.',
    ],
    note: 'Not all models may support this feature.',
    buttonLabel: 'GO TO SYSTEM SETTINGS',
  },
  nfc: {
    title: 'NFC Status',
    description: `NFC (Near Field Communication) is a mechanism to make contactless payments or transfer data through your mobile device.Keeping the NFC enabled always increases the risk levels. The attackers can connect to your device and steal sensitive data. Enable it only when in use and disable it immediately after use.`,
    // note: "NFC IS NOT PRESENT IN THE DEVICE.",
    buttonLabel: 'GO TO SYSTEM SETTINGS',
  },
};

const SecurityDetails = ({route}: RootScreenProps<Paths.SecurityDetails>) => {
  const {id} = route.params;

  const detail = detailMap[id ?? ''] || null;

  const handleSystemSettingsPress = () => {
    let action = '';

    switch (id) {
      case 'bluetooth':
        action = 'android.settings.BLUETOOTH_SETTINGS';
        break;
      case 'usbDebugging':
        action = 'android.settings.APPLICATION_DEVELOPMENT_SETTINGS';
        break;
      case 'lockScreen':
      case 'encryption':
      case 'showPassword':
      case 'lockScreenNotifications':
        action = 'android.settings.SECURITY_SETTINGS';
        break;
      case 'devMode':
        action = 'android.settings.APPLICATION_DEVELOPMENT_SETTINGS';
        break;
      case 'nfc':
        action = 'android.settings.NFC_SETTINGS';
        break;
      default:
        console.log('No system settings action defined for this item.');
        return;
    }

    Linking.sendIntent(action);
  };

  return (
    <ScreenLayout>
      <ScreenHeader name={detail.title} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CustomText variant="h5" color="#fff">
          {detail.description}
        </CustomText>

        {detail.checks && (
          <View style={styles.checksContainer}>
            {detail.checks.map((check, index) => (
              <View key={index} style={styles.checkRow}>
                <CustomText style={styles.checkLabel}>{check.label}</CustomText>
                <Ionicons
                  name={check.passed ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={check.passed ? 'green' : 'red'}
                />
              </View>
            ))}
          </View>
        )}

        {detail.result && (
          <CustomText
            variant="h5"
            color="#fff"
            fontFamily="Montserrat-Bold"
            style={{marginTop: 10}}>
            Result: {detail.result}
          </CustomText>
        )}

        {detail.steps && (
          <View style={styles.stepsContainer}>
            <CustomText fontFamily="Montserrat-Bold" style={styles.stepsTitle}>
              Steps to turn {detail.title} ON or OFF
            </CustomText>
            {detail.steps.map((step, index) => (
              <CustomText
                fontFamily="Montserrat-Medium"
                key={index}
                style={styles.stepText}>
                {index + 1}) {step}
              </CustomText>
            ))}
          </View>
        )}

        {detail.note && (
          <CustomText
            variant="h6"
            color="red"
            style={{marginTop: 10}}>{`NOTE:- ${detail.note}`}</CustomText>
        )}

        {detail.buttonLabel && (
          <CustomButton
            bgVariant="secondary"
            textVariant='secondary'
            title={detail.buttonLabel}
            onPress={handleSystemSettingsPress}
            style={{marginTop: 20}}
          />
        )}
      </ScrollView>
      <BackBtn />
    </ScreenLayout>
  );
};

export default SecurityDetails;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    paddingBottom: 10,
  },
  checksContainer: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  checkLabel: {
    color: 'white',
    fontSize: 20,
  },
  stepsContainer: {
    marginTop: 24,
  },
  stepsTitle: {
    color: 'white',
    marginBottom: 8,
    fontSize: 20,
  },
  stepText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 4,
  },
});
