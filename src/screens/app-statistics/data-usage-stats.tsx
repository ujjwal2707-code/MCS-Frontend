import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';
import React from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledAppStats} from '../../../types/types';

const DataUsageStats: React.FC<RootScreenProps> = ({route}) => {
  const {apps} = route.params as {apps: InstalledAppStats[]};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{display: 'flex', alignItems: 'center'}}>
        <Text style={{color: 'green', fontSize: 18}}>Transmitted Bytes</Text>
        <Text style={{color: 'red', fontSize: 18}}>Recieved Bytes</Text>
      </View>
      {apps.map((app, index) => (
        <View key={index} style={styles.appContainer}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
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

          <View>
            <Text style={{color: 'green', fontSize: 18}}>
              {app.transmittedBytes.toFixed(2)} MB
            </Text>
            <Text style={{color: 'red', fontSize: 18}}>
              {app.receivedBytes.toFixed(2)} MB
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default DataUsageStats;

const styles = StyleSheet.create({
  container: {
    padding: 6,
    paddingVertical: 10,
  },
  appContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    lineHeight: 50,
  },
  appName: {
    fontSize: 16,
  },
});
