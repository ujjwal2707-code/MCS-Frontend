import type {RootStackParamList} from '../navigation/types';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Paths} from '../navigation/paths';

import {
  Home,
  AppPermission,
  AppPermissionDetails,
  ScanQr,
  ScanUrl,
  SecurityAdvisor,
  WifiSecurity,
  ThreatAdvisor,
  AdwareScan,
  AppStatistics,
  HiddenApps,
} from '../screens';
const Stack = createStackNavigator<RootStackParamList>();

const ApplicationNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: true}}>
          <Stack.Screen component={Home} name={Paths.Home} />
          <Stack.Screen component={ScanQr} name={Paths.ScanQr} />
          <Stack.Screen component={ScanUrl} name={Paths.ScanUrl} />
          <Stack.Screen component={WifiSecurity} name={Paths.WifiSecurity} />
          <Stack.Screen component={AppPermission} name={Paths.AppPermission} />
          <Stack.Screen component={AppPermissionDetails} name={Paths.AppPermissionDetails} />
          <Stack.Screen
            component={SecurityAdvisor}
            name={Paths.SecurityAdvisor}
          />
          <Stack.Screen component={ThreatAdvisor} name={Paths.ThreatAdvisor} />
          <Stack.Screen component={AdwareScan} name={Paths.AdwareScan} />
          <Stack.Screen component={AppStatistics} name={Paths.AppStatistics} />
          <Stack.Screen component={HiddenApps} name={Paths.HiddenApps} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;
