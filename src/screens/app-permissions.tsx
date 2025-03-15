import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet
} from 'react-native';
import {NativeModules, Platform} from 'react-native';
import FullScreenLoader from '../components/full-screen-loader';

interface InstalledApp {
  packageName: string;
  name: string;
  icon: string;
  permissions: string[];
}

interface InstalledAppsModule {
  getInstalledApps: () => Promise<InstalledApp[]>;
}

const {InstalledApps} = NativeModules as {InstalledApps: InstalledAppsModule};

const AppPermissions = () => {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(false);
  console.log(apps);
  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        try {
          setLoading(true);
          const installedApps = await InstalledApps.getInstalledApps();
          setApps(installedApps);
        } catch (error) {
          console.error('Error fetching apps:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn('Listing installed apps is not supported on iOS.');
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
        <View key={index.toString()} style={styles.appContainer}>
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
      ))}
    </ScrollView>
  );
};

export default AppPermissions;

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
