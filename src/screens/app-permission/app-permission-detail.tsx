import {
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledApp} from '../../../types/types';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import BackBtn from '@components/back-btn';

function cleanPermission(permission: string): string {
  const lastSegment = permission.split('.').pop() || '';
  const formatted = lastSegment.split('_').join(' ');
  return formatted;
}

const AppPermissionDetail: React.FC<RootScreenProps> = ({route}) => {
  const {app} = route.params as {app: InstalledApp};

  // const openAppSettings = () => {
  //   if (Platform.OS === 'android') {
  //     Linking.openURL(
  //       'intent://settings#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;data=package:' +
  //         app.packageName +
  //         ';end',
  //     ).catch(() => {
  //       console.warn('Unable to open app settings');
  //     });
  //   } else {
  //     Linking.openSettings().catch(() => {
  //       console.warn('Unable to open iOS settings');
  //     });
  //   }
  // };

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
          {app.controllablePermissions
            .filter(p => p.granted)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((p, index) => (
              <TouchableOpacity
                key={index.toString()}
                style={styles.pill}
                // onPress={openAppSettings}
              >
                <CustomText
                  fontFamily="Montserrat-SemiBold"
                  color="#fff"
                  style={styles.pillText}>
                  {cleanPermission(p.name)}
                </CustomText>

                {/* <CustomText
                  fontFamily="Montserrat-Bold"
                  style={[p.granted ? styles.granted : styles.denied]}>
                  {p.granted ? 'Granted' : 'Denied'}
                </CustomText> */}
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      <BackBtn />
    </ScreenLayout>
  );
};

export default AppPermissionDetail;

const styles = StyleSheet.create({
  appContainer: {
    padding: 5,
  },
  divider: {
    backgroundColor: '#FFF',
    height: 1,
    marginVertical: 8,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
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
  granted: {
    color: '#48BB78',
  },
  denied: {
    color: '#F56565',
  },
});
