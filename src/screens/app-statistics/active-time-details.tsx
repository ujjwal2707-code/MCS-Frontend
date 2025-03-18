import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {RootScreenProps} from '../../navigation/types';
import {InstalledAppStats} from '../../../types/types';

const ActiveTimeDetails: React.FC<RootScreenProps> = ({route}) => {
  const {app} = route.params as {app: InstalledAppStats};

  const msToHours = (ms: number) => (ms / 3600000).toFixed(2);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{app.name}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Installed on:</Text>
        <Text style={styles.value}>{app.installedOn}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Last Used Date :</Text>
        <Text style={styles.value}>{app.lastUsageDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Daily Usage:</Text>
        <Text style={styles.value}>{msToHours(app.dailyUsage)} h</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Weekly Usage:</Text>
        <Text style={styles.value}>{msToHours(app.weeklyUsage)} h</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Monthly Usage:</Text>
        <Text style={styles.value}>{msToHours(app.monthlyUsage)} h</Text>
      </View>
    </ScrollView>
  );
};

export default ActiveTimeDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: '#333',
  },
});
