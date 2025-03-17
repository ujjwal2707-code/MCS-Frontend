import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {RootScreenProps} from '../../navigation/types';
import {WifiNetwork} from '../../../types/types';

const WifiSecurityDetails: React.FC<RootScreenProps> = ({route}) => {
  const {wifi} = route.params as {wifi: WifiNetwork};

  console.log('====================================');
  console.log(wifi);
  console.log('====================================');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{wifi.SSID}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>BSSID:</Text>
        <Text style={styles.value}>{wifi.BSSID}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Security Rating:</Text>
        <Text style={styles.value}>{wifi.securityRating}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Signal Level:</Text>
        <Text style={styles.value}>{wifi.level} dBm</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Frequency:</Text>
        <Text style={styles.value}>{wifi.frequency} MHz</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Capabilities:</Text>
        <Text style={styles.value}>{wifi.capabilities}</Text>
      </View>
    </ScrollView>
  );
};

export default WifiSecurityDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16
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
