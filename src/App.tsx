import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {NativeModules, Platform} from 'react-native';

const {InstalledApps} = NativeModules;

function App(): React.JSX.Element {
  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        // InstalledApps.getInstalledApps()
        //   .then(apps => {
        //     console.log('Installed apps:', apps);
        //     // apps is an array of objects with keys: packageName, name, icon, permissions
        //   })
        //   .catch(error => {
        //     console.error('Error fetching apps:', error);
        //   });
        try {
          const installedApps = await InstalledApps.getInstalledApps();
          console.log(installedApps);
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
      <Text style={styles.text}>Maha cyber safe</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default App;
