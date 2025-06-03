import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import React from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledAppStats} from '../../../types/types';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import {Card, Divider} from 'react-native-paper';
import CustomText from '@components/ui/custom-text';
import BackBtn from '@components/back-btn';

const ActiveTimeDetails: React.FC<RootScreenProps> = ({route}) => {
  const {app} = route.params as {app: InstalledAppStats};

  const msToHours = (ms: number) => (ms / 3600000).toFixed(2);

  const msToHoursMinutes = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    if (hours > 0) {
      return `${hours} Hrs ${minutes} Mins`;
    } else if (minutes > 0) {
      return `${minutes} Mins ${seconds} Secs`;
    } else {
      return `${seconds} Secs`;
    }
  };

  const convertDateString = (dateStr: string): string => {
    const isoDateStr = dateStr.includes(' ')
      ? dateStr.replace(' ', 'T')
      : dateStr;
    const date = new Date(isoDateStr);

    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-indexed month
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <ScreenLayout>
        <ScreenHeader />

        <Card style={styles.card}>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {app.icon ? (
                <Image
                  source={{uri: `data:image/png;base64,${app.icon}`}}
                  style={styles.appIcon}
                />
              ) : (
                <Text style={styles.noIcon}>No Icon</Text>
              )}
              <CustomText
                variant="h3"
                fontFamily="Montserrat-Bold"
                color="#fff">
                {app.name}
              </CustomText>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.cardItemContainer}>
              <CustomText
                color="#FFF"
                variant="h5"
                fontFamily="Montserrat-Regular">
                Last Used Date
              </CustomText>
              <CustomText
                color="#FFF"
                variant="h5"
                fontFamily="Montserrat-Regular">
                {convertDateString(app.lastUsageDate)}
              </CustomText>
            </View>

            <View style={styles.cardItemContainer}>
              <CustomText
                color="#FFF"
                variant="h5"
                fontFamily="Montserrat-Regular">
                Daily Usage
              </CustomText>
              <CustomText
                color="#FFF"
                variant="h5"
                fontFamily="Montserrat-Regular">
                {msToHoursMinutes(app.dailyUsage)}
              </CustomText>
            </View>

            <View style={styles.cardItemContainer}>
              <CustomText
                color="#FFF"
                variant="h5"
                fontFamily="Montserrat-Regular">
                Weekly Usage
              </CustomText>
              <CustomText
                color="#FFF"
                variant="h5"
                fontFamily="Montserrat-Regular">
                {msToHoursMinutes(app.weeklyUsage)}
              </CustomText>
            </View>

            <View style={styles.cardItemContainer}>
              <CustomText
                color="#FFF"
                variant="h5"
                fontFamily="Montserrat-Regular">
                Monthly Usage
              </CustomText>
              <CustomText
                color="#FFF"
                variant="h5"
                fontFamily="Montserrat-Regular">
                {msToHoursMinutes(app.monthlyUsage)}
              </CustomText>
            </View>
          </Card.Content>
        </Card>
      </ScreenLayout>
      <BackBtn />
    </>
  );
};

export default ActiveTimeDetails;

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
  cardItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
