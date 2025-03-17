import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RootScreenProps} from '../../navigation/types';
import {ScrollView} from 'react-native-gesture-handler';
import { InstalledApp } from '../../../types/types';

const AppPermissionDetail: React.FC<RootScreenProps> = ({route}) => {
  const { app } = route.params as { app: InstalledApp };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{app.name}</Text>
        <Text style={styles.subtitle}>{app.packageName}</Text>
        <Text style={styles.heading}>Permissions:</Text>
        {app.permissions.map(permission => (
          <Text key={permission} style={styles.permission}>
            {permission}
          </Text>
        ))}
    </ScrollView>
  );
};

export default AppPermissionDetail;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {fontSize: 24, fontWeight: 'bold'},
  subtitle: {fontSize: 16, color: '#666', marginBottom: 16},
  heading: {fontSize: 18, marginTop: 16, marginBottom: 8},
  permission: {fontSize: 20, marginBottom: 4},
});
