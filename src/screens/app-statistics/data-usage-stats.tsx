import {
  View,
  Text,
  Image,
  StyleSheet,
  NativeModules,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledAppStats} from '../../../types/types';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import Loader from '@components/loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackBtn from '@components/back-btn';
import {Paths} from '@navigation/paths';

const {InstalledAppsStatistics} = NativeModules;

const DataUsageStats: React.FC<RootScreenProps> = ({route, navigation}) => {
  const [apps, setApps] = useState<InstalledAppStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // First check if we have permission
        const hasPermission =
          await InstalledAppsStatistics.checkUsageStatsPermission();
        if (!hasPermission) {
          InstalledAppsStatistics.openUsageAccessSettings();
          return;
        }

        const appsData: InstalledAppStats[] =
          await InstalledAppsStatistics.getInstalledApps();
        // Filter out apps with no data usage and sort by weekly usage (received + transmitted)
        const filteredAndSortedApps = appsData
          .filter(app => {
            const totalUsage =
              app.weeklyDataUsage.received + app.weeklyDataUsage.transmitted;
            return totalUsage > 0;
          })
          .sort((a, b) => {
            const aTotal =
              a.weeklyDataUsage.received + a.weeklyDataUsage.transmitted;
            const bTotal =
              b.weeklyDataUsage.received + b.weeklyDataUsage.transmitted;
            return bTotal - aTotal;
          });
        setApps(filteredAndSortedApps);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAppPress = (selectedApp: InstalledAppStats) => {
    navigation.navigate(Paths.DataUsageDetails, {app: selectedApp});
  };

  return (
    <>
      <ScreenLayout>
        <ScreenHeader name="Network Usage Statistics" />

        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={apps}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => handleAppPress(item)}>
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
                    <Ionicons
                      name="chevron-forward-sharp"
                      size={30}
                      color="#FFF"
                    />
                  </View>
                  {/* <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                    <Ionicons name="arrow-up" size={20} color="green" />
                    <CustomText color="#fff" fontFamily="Montserrat-SemiBold">
                      {item.transmittedBytes.toFixed(2)} mb
                    </CustomText>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                    <Ionicons name="arrow-down" size={20} color="red" />
                    <CustomText color="#fff" fontFamily="Montserrat-SemiBold">
                      {item.receivedBytes.toFixed(2)} mb
                    </CustomText>
                  </View>
                </View> */}
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
        <BackBtn />
      </ScreenLayout>
    </>
  );
};

export default DataUsageStats;

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
