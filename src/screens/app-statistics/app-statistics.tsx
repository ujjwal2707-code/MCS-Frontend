import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'

import { NativeModules } from 'react-native';
import { InstalledApp } from '../../../types/types';

const { InstalledAppsStatistics } = NativeModules;

const AppStatistics = () => {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  console.log('====================================');
  console.log(permissionGranted,apps);
  console.log('====================================');

  // useEffect(() => {
  //   const loadApps = async () => {
  //     try {
  //       const appsData: InstalledApp[] = await InstalledAppsStatistics.getInstalledApps();
  //       setApps(appsData);
  //     } catch (error:any) {
  //       if (error.code === 'PERMISSION_DENIED') {
  //         // Permission is not granted. You can prompt the user to enable it,
  //         // for example by showing a message or navigating to the settings.
  //         console.error("Usage stats permission is not granted.");
  //       } else {
  //         console.error('Error loading apps:', error);
  //       }
  //     }
  //   };
  //   loadApps();
  // }, []);
  useEffect(() => {
    const checkPermissionAndLoadApps = async () => {
      try {
        // Check if usage stats permission is granted
        const hasPermission: boolean = await InstalledAppsStatistics.checkUsageStatsPermission();
        setPermissionGranted(hasPermission);

        if (!hasPermission) {
          // If permission is missing, user is automatically navigate to settings
          // await InstalledAppsStatistics.openUsageAccessSettings();
          Alert.alert(
            "Warning",
            "Usage stats permission not granted. Please enable it in settings."
          );
          return;
        }

        // If permission is granted, load your apps data
        const appsData: InstalledApp[] = await InstalledAppsStatistics.getInstalledApps();
        setApps(appsData);
      } catch (error) {
        console.error('Error loading apps:', error);
      }
    };

    checkPermissionAndLoadApps();
  }, []);

  return (
    <View>
      <Text>AppStatistics</Text>
    </View>
  )
}

export default AppStatistics