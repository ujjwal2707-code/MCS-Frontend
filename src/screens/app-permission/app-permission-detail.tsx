import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledApp} from '../../../types/types';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import BackBtn from '@components/back-btn';
import {Tooltip} from 'react-native-paper';

// 🔹 Group similar permissions under user-friendly labels
const PERMISSION_GROUPS: {[label: string]: string[]} = {
  Location: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
  Camera: ['CAMERA'],
  Microphone: ['RECORD_AUDIO'],
  Contacts: ['READ_CONTACTS', 'WRITE_CONTACTS', 'GET_ACCOUNTS'],
  SMS: ['READ_SMS', 'SEND_SMS', 'RECEIVE_SMS', 'RECEIVE_MMS'],
  Phone: [
    'READ_PHONE_STATE',
    'CALL_PHONE',
    'READ_CALL_LOG',
    'WRITE_CALL_LOG',
    'ADD_VOICEMAIL',
    'USE_SIP',
    'PROCESS_OUTGOING_CALLS',
  ],
  Storage: ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
  Media: [
    'READ_MEDIA_IMAGES',
    'READ_MEDIA_VIDEO',
    'READ_MEDIA_AUDIO',
    'MEDIA_CONTENT_CONTROL',
  ],
  Notifications: ['POST_NOTIFICATIONS'],
  Calendar: ['READ_CALENDAR', 'WRITE_CALENDAR'],
  Sensors: ['BODY_SENSORS', 'ACTIVITY_RECOGNITION'],
  Bluetooth: ['BLUETOOTH_CONNECT', 'BLUETOOTH_ADMIN'],
  Network: ['ACCESS_NETWORK_STATE', 'CHANGE_NETWORK_STATE', 'INTERNET'],
};

const PERMISSION_DESCRIPTIONS: {[label: string]: string} = {
  Location: 'Access to device location',
  Camera: 'Use of the device camera',
  Microphone: 'Record audio through microphone',
  Contacts: 'Access and modify your contacts',
  SMS: 'Send and receive SMS/MMS',
  Phone: 'Access phone state and make calls',
  Storage: 'Read and write device storage',
  Media: 'Access media files like images and videos',
  Notifications: 'Send notifications',
  Calendar: 'Access calendar events',
  Sensors: 'Access body sensors and activity recognition',
  Bluetooth: 'Use Bluetooth features',
  Network: 'Access network state and internet',
};

// 🔹 Get grouped + deduplicated permission labels
function getGroupedPermissionLabels(
  permissions: InstalledApp['controllablePermissions'],
  showAll?: boolean,
): {label: string; description: string}[] {
  const granted = permissions
    .filter(p => p.granted)
    .map(p => p.name.split('.').pop() || '');

  const shownGroups = new Set<string>();
  const results: {label: string; description: string}[] = [];

  Object.entries(PERMISSION_GROUPS).forEach(([label, perms]) => {
    if (perms.some(p => granted.includes(p))) {
      if (!shownGroups.has(label)) {
        results.push({
          label,
          description: PERMISSION_DESCRIPTIONS[label] || '',
        });
        shownGroups.add(label);
      }
    }
  });

  if (showAll) {
    granted.forEach(p => {
      const isGrouped = Object.values(PERMISSION_GROUPS).some(group =>
        group.includes(p),
      );
      if (!isGrouped) {
        const label = p
          .split('_')
          .join(' ')
          .toLowerCase()
          .replace(/\b\w/g, c => c.toUpperCase());
        if (!shownGroups.has(label)) {
          results.push({label, description: ''});
          shownGroups.add(label);
        }
      }
    });
  }

  return results.sort((a, b) => a.label.localeCompare(b.label));
}

const AppPermissionDetail: React.FC<RootScreenProps> = ({route}) => {
  const {app} = route.params as {app: InstalledApp};
  // const [showAll, setShowAll] = useState(false);

  const grouped = getGroupedPermissionLabels(
    app.controllablePermissions,
    // showAll,
  );
  // const allGrouped = getGroupedPermissionLabels(
  //   app.controllablePermissions,
  //   true,
  // );

  const openAppSettings = (packageName: string) => {
    if (Platform.OS === 'android') {
      Linking.openURL(
        `intent://settings#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;data=package:${packageName};end`,
      ).catch(() => {
        console.warn('Unable to open app settings');
      });
    } else {
      Linking.openSettings().catch(() => {
        console.warn('Unable to open iOS settings');
      });
    }
  };

  return (
    <ScreenLayout>
      <ScreenHeader name={app.name} />
      <View style={{paddingVertical: 20}}>
        <CustomText
          variant="h5"
          color="#fff"
          fontFamily="Montserrat-Medium"
          style={{textAlign: 'center'}}>
          App Permissions List
        </CustomText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.pillContainer}>
          {grouped.map(({label, description}, index) => (
            <Tooltip
              title={description}
              enterTouchDelay={0}
              key={index.toString()}>
              <TouchableOpacity
                style={styles.pill}
                // onPress={() => openAppSettings(app.packageName)}
              >
                <CustomText
                  fontFamily="Montserrat-SemiBold"
                  color="#fff"
                  style={styles.pillText}>
                  {label.toUpperCase()}
                </CustomText>
              </TouchableOpacity>
            </Tooltip>
          ))}
        </View>

        {/* {allGrouped.length > grouped.length && (
          <TouchableOpacity
            onPress={() => setShowAll(!showAll)}
            style={{marginTop: 12}}>
            <CustomText style={{textAlign: 'center'}} color="#ccc">
              {showAll ? 'Show Less' : 'Show All Permissions'}
            </CustomText>
          </TouchableOpacity>
        )} */}
      </ScrollView>

      <BackBtn />
    </ScreenLayout>
  );
};

export default AppPermissionDetail;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 50,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  pill: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#2337A8',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  pillText: {
    fontSize: 14,
  },
});
