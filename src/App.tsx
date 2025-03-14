import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {NativeModules, Platform} from 'react-native';

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

function App(): React.JSX.Element {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  console.log(apps);
  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        try {
          const installedApps = await InstalledApps.getInstalledApps();
          setApps(installedApps);
        } catch (error) {
          console.error('Error fetching apps:', error);
        }
      } else {
        console.warn('Listing installed apps is not supported on iOS.');
      }
    };
    init();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, padding: 30}}>
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
    </SafeAreaView>
  );
}

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

export default App;
