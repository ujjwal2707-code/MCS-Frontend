import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledApp} from '../../../types/types';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import BackBtn from '@components/back-btn';

function cleanPermission(permission: string): string {
  // const acronyms = new Set([
  //   'ID',
  //   'SMS',
  //   'GPS',
  //   'VPN',
  //   'NFC',
  //   'IMEI',
  //   'MMS',
  //   'APN',
  //   'USB',
  //   'WIFI',
  // ]);

  const lastSegment = permission.split('.').pop() || '';

  const formatted = lastSegment
    .split('_')
    // .map(word => {
    //   const upper = word.toUpperCase();
    //   return acronyms.has(upper)
    //     ? upper
    //     : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    // })
    .join(' ');

  return formatted;
}

const AppPermissionDetail: React.FC<RootScreenProps> = ({route}) => {
  const {app} = route.params as {app: InstalledApp};

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

      {/* <FlatList
        data={app.permissions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.appContainer}>
            <CustomText fontFamily="Montserrat-Medium" color="#fff">
              {cleanPermission(item)}
            </CustomText>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      /> */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.pillContainer}>
          {app.permissions.sort().map((permission, index) => (
            <View key={index.toString()} style={styles.pill}>
              <CustomText
                fontFamily="Montserrat-SemiBold"
                color="#fff"
                style={styles.pillText}>
                {cleanPermission(permission)}
              </CustomText>
            </View>
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
