import {View, Text, NativeModules, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';

const {HiddenAppsModule} = NativeModules;

interface AppInfo {
  appName: string;
  packageName: string;
}

const HiddenApps = () => {
  const [hiddenApps, setHiddenApps] = useState<AppInfo[]>([]);

  console.log('====================================');
  console.log(hiddenApps);
  console.log('====================================');

  useEffect(() => {
    const init = async () => {
      try {
        const apps = await HiddenAppsModule.getHiddenApps();
        setHiddenApps(apps);
      } catch (error) {
        console.error('Error fetching hidden apps:', error);
      }
    };
    init();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hidden Apps</Text>
      {hiddenApps.length === 0 ? (
        <Text style={styles.message}>No hidden apps found.</Text>
      ) : (
        hiddenApps.map((app, index) => (
          <View key={index} style={styles.appContainer}>
            <Text style={styles.appName}>{app.appName}</Text>
            <Text style={styles.packageName}>{app.packageName}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default HiddenApps;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: 'gray',
  },
  appContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  appName: {
    fontSize: 18,
  },
  packageName: {
    fontSize: 14,
    color: 'gray',
  },
});