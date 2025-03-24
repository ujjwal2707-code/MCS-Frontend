import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  NativeModules,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledAppStats} from '../../../types/types';
import {Paths} from '../../navigation/paths';
import FullScreenLoader from '../../components/full-screen-loader';

const {InstalledAppsStatistics} = NativeModules;

const AppUsageStats: React.FC<RootScreenProps> = ({route, navigation}) => {
  const [apps, setApps] = useState<InstalledAppStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const appsData: InstalledAppStats[] =
          await InstalledAppsStatistics.getInstalledApps();
        setApps(appsData);
      } catch (error) {
        console.error('Error scanning WiFi networks:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {apps.map((app, index) => (
        <TouchableOpacity
          key={index.toString()}
          onPress={() =>
            navigation.navigate(Paths.ActiveTimeDetails, {app: app})
          }>
          <View style={styles.appContainer}>
            {app.icon ? (
              <Image
                source={{uri: `data:image/png;base64,${app.icon}`}}
                style={styles.appIcon}
              />
            ) : (
              <Text style={styles.noIcon}>No Icon</Text>
            )}
            <Text style={styles.appName}>{app.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default AppUsageStats;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  appIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  noIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    textAlign: 'center',
    lineHeight: 50, // Center text vertically if no icon
  },
  appName: {
    fontSize: 16,
  },
});
