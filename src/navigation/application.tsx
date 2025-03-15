import type {RootStackParamList} from '../navigation/types';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Paths} from '../navigation/paths';

import {
  Home,
  AppPermission,
  ScanQr,
  ScanUrl,
  SecurityAdvisor,
  WifiSecurity,
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
          <Stack.Screen
            component={SecurityAdvisor}
            name={Paths.SecurityAdvisor}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;
