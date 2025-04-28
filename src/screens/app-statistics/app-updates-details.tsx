import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {RootScreenProps} from '@navigation/types';
import {Paths} from '@navigation/paths';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import {Card, Divider} from 'react-native-paper';
import CustomText from '@components/ui/custom-text';
import BackBtn from '@components/back-btn';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '@components/ui/custom-button';

const convertDateString = (dateStr: string): string => {
  // Optional: Replace space with "T" if necessary
  const isoDateStr = dateStr.includes(' ')
    ? dateStr.replace(' ', 'T')
    : dateStr;
  const date = new Date(isoDateStr);

  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-indexed month
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const AppUpdatesDetails = ({
  route,
}: RootScreenProps<Paths.AppUpdatesDetails>) => {
  const {app} = route.params;
  console.log(app);

  const handlePlayStore = (packageName: string) => {
    const marketUrl = `market://details?id=${packageName}`;

    // First, try to open the Play Store app
    Linking.openURL(marketUrl).catch(err => {
      console.log('Could not open Play Store app, falling back to browser');
      const webUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
      Linking.openURL(webUrl);
    });
  };
  return (
    <ScreenLayout>
      <ScreenHeader name={app.name} />

      <Card style={styles.card}>
        <Card.Content>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {app.icon ? (
              <Image
                source={{uri: `data:image/png;base64,${app.icon}`}}
                style={styles.appIcon}
              />
            ) : (
              <Text style={styles.noIcon}>No Icon</Text>
            )}
            <CustomText
              variant="h6"
              fontFamily="Montserrat-Medium"
              color="#fff">
              {app.name}
            </CustomText>
          </View>
          <Divider style={styles.divider} />

          <View style={{display: 'flex'}}>
            <CustomText
              variant="h5"
              fontFamily="Montserrat-Medium"
              color="#fff">
              Downloaded On: {convertDateString(app.installedOn)}
            </CustomText>
            <CustomText
              variant="h5"
              fontFamily="Montserrat-Medium"
              color="#fff">
              Last Updated On: {convertDateString(app.lastUpdateDate)}
            </CustomText>
            <CustomText
              variant="h5"
              fontFamily="Montserrat-Medium"
              color="#fff"
              style={{marginTop: 10}}>
              Version: {app.version}
            </CustomText>

            <CustomButton
              title="Check For Update"
              bgVariant="primary"
              textVariant="primary"
              IconRight={() => (
                <Ionicons name="logo-google-playstore" size={24} color="blue" />
              )}
              onPress={() => handlePlayStore(app.packageName)}
              style={{marginTop: 10}}
            />

            {/* {app.isUpToDate ? (
              <CustomText
                variant="h5"
                fontFamily="Montserrat-Medium"
                color="#fff">
                App is up to date.
              </CustomText>
            ):(
              <CustomText
                variant="h5"
                fontFamily="Montserrat-Medium"
                color="#fff">
                App is not up to date.
              </CustomText>
            )} */}
          </View>
        </Card.Content>
      </Card>
      <BackBtn />
    </ScreenLayout>
  );
};

export default AppUpdatesDetails;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#2337A8', // #2337A8 // #4E4E96 // #2337A8
    marginTop: 20,
    padding: 10,
  },
  appIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  noIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    textAlign: 'center',
    lineHeight: 50,
  },
  divider: {
    backgroundColor: '#707070',
    height: 1,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playStoreButton: {
    marginRight: 10, // Space between button and chevron
  },
});
