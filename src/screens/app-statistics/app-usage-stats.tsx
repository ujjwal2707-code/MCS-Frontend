import {
  View,
  Text,
  Image,
  StyleSheet,
  NativeModules,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledAppStats} from '../../../types/types';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import Loader from '@components/loader';
import CustomText from '@components/ui/custom-text';
import BackBtn from '@components/back-btn';

const {InstalledAppsStatistics} = NativeModules;

// const msToHoursMinutes = (ms: number) => {
//   const hours = Math.floor(ms / 3600000);
//   const minutes = Math.floor((ms % 3600000) / 60000);
//   if (hours === 0 && minutes > 0) {
//     return `${minutes} Mins`;
//   }
//   return `${hours} Hrs ${minutes} Mins`;
// };

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

const AppUsageStats: React.FC<RootScreenProps> = ({route, navigation}) => {
  const [apps, setApps] = useState<InstalledAppStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const appsData: InstalledAppStats[] =
          await InstalledAppsStatistics.getInstalledApps();
        const filteredApps = appsData.filter(item => item.dailyUsage > 0);
        filteredApps.sort((a, b) => b.dailyUsage - a.dailyUsage);
        setApps(filteredApps);
      } catch (error) {
        console.error('Error scanning apps:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <ScreenLayout>
      <ScreenHeader name="Active Time Statistics" />

      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={apps}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.appContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.icon ? (
                  <Image
                    source={{uri: `data:image/png;base64,${item.icon}`}}
                    style={styles.appIcon}
                  />
                ) : (
                  <Text style={styles.noIcon}>No Icon</Text>
                )}
                <CustomText
                  variant="h6"
                  fontFamily="Montserrat-Medium"
                  color="#fff">
                  {item.name}
                </CustomText>
              </View>
              <View>
                <CustomText
                  variant="h6"
                  color="#fff"
                  fontFamily="Montserrat-Medium">
                  {msToHoursMinutes(item.dailyUsage)}
                </CustomText>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
       <BackBtn />
    </ScreenLayout>
  );
};

export default AppUsageStats;

const styles = StyleSheet.create({
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    backgroundColor: '#707070',
    height: 1,
    marginVertical: 8,
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
  listContentContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#2337A8',
    marginTop: 10,
  },
});
