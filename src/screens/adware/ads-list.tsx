import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RootScreenProps} from '@navigation/types';
import {Paths} from '@navigation/paths';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import BackBtn from '@components/back-btn';

function cleanAds(permission: string): string {
  const lastSegment = permission.split('.').pop() || '';

  const formatted = lastSegment
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split('_')
    .join(' ')
    .toUpperCase();

  return formatted;
}

const AdsList = ({route}: RootScreenProps<Paths.AdsList>) => {
  const {app, ads} = route.params;

  return (
    <ScreenLayout>
      <ScreenHeader name={app.name} />
      <View style={{paddingVertical: 20}}>
        <CustomText
          variant="h5"
          color="#fff"
          fontFamily="Montserrat-Medium"
          style={{textAlign: 'center'}}>
          Ads List
        </CustomText>
      </View>
      {/* <FlatList
        data={ads}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.appContainer}>
            <CustomText fontFamily="Montserrat-Medium" color="#fff">
              {cleanAds(item)}
            </CustomText>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      /> */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.pillContainer}>
          {ads.map((item, index) => (
            <View key={index.toString()} style={styles.pill}>
              <CustomText
                fontFamily="Montserrat-SemiBold"
                color="#fff"
                style={styles.pillText}>
                {cleanAds(item)}
              </CustomText>
            </View>
          ))}
        </View>
      </ScrollView>
      <BackBtn />
    </ScreenLayout>
  );
};

export default AdsList;

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
