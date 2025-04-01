import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledApp} from '../../../types/types';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';

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

      <FlatList
        data={app.permissions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.appContainer}>
            <CustomText fontFamily="Montserrat-Medium" color="#fff">
              {item}
            </CustomText>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </ScreenLayout>
  );
};

export default AppPermissionDetail;

const styles = StyleSheet.create({
  appContainer: {
    padding:5
  },
  divider: {
    backgroundColor: '#FFF',
    height: 1,
    marginVertical: 8,
  },
});
