import {
  View,
  Text,
  ScrollView,
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
import CustomText from '@components/ui/custom-text';
import Loader from '@components/loader';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {InstalledAppsStatistics} = NativeModules;

const DataUsageStats: React.FC<RootScreenProps> = ({route}) => {
  const [apps, setApps] = useState<InstalledAppStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const appsData: InstalledAppStats[] =
          await InstalledAppsStatistics.getInstalledApps();
        const filteredApps = appsData.filter(item => item.receivedBytes > 0);
        filteredApps.sort((a, b) => b.receivedBytes - a.receivedBytes);
        setApps(filteredApps);
        // setApps(appsData);
      } catch (error) {
        console.error('Error scanning WiFi networks:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <>
      <ScreenLayout>
        <ScreenHeader name="Data Usage Stats" />

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
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  {/* <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Ionicons name="arrow-up" size={30} color="green" />
                    <CustomText color="#fff">
                      {item.transmittedBytes.toFixed(2)} mb
                    </CustomText>
                  </View> */}
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                    <Ionicons name="arrow-down" size={20} color="red" />
                    <CustomText color="#fff">
                      {item.receivedBytes.toFixed(2)} mb
                    </CustomText>
                  </View>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
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
