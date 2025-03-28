import type {RootStackParamList} from '../navigation/types';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Paths} from '../navigation/paths';

import {
  SplashScreen,
  Register,
  Login,
  VerifyEmail,
  ForgetPassword,
  Home,
  Profile,
  AppPermission,
  AppPermissionDetails,
  ScanQr,
  ScanUrl,
  ScanWebUrl,
  ScanPaymentURl,
  ScanAppUrl,
  SecurityAdvisor,
  WifiSecurity,
  WifiSecurityDetails,
  ThreatAdvisor,
  AdwareScan,
  AppStatistics,
  AppUsageStats,
  ActiveTimeDetails,
  DataUsageStats,
  AppUpdates,
  HiddenApps,
  CyberNews,
  OtpSecurity,
  DataBreach,
} from '../screens';
import {useAuth} from '../context/auth-context';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ApplicationNavigator = () => {
  const {token} = useAuth();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={Paths.SplashScreen}
          screenOptions={{headerShown: false}}>
          <Stack.Screen component={SplashScreen} name={Paths.SplashScreen} />
          {token ? (
            <>
              <Stack.Screen component={Home} name={Paths.Home} />
              <Stack.Screen component={Profile} name={Paths.Profile} />
              <Stack.Screen component={ScanQr} name={Paths.ScanQr} />
              <Stack.Screen component={ScanUrl} name={Paths.ScanUrl} />
              <Stack.Screen component={ScanWebUrl} name={Paths.ScanWebUrl} />
              <Stack.Screen
                component={ScanPaymentURl}
                name={Paths.ScanPaymentUrl}
              />
              <Stack.Screen component={ScanAppUrl} name={Paths.ScanAppUrl} />
              <Stack.Screen
                component={WifiSecurity}
                name={Paths.WifiSecurity}
              />
              <Stack.Screen
                component={WifiSecurityDetails}
                name={Paths.WifiSecurityDetails}
              />
              <Stack.Screen component={CyberNews} name={Paths.CyberNews} />
              <Stack.Screen component={OtpSecurity} name={Paths.OtpSecurity} />
              <Stack.Screen component={DataBreach} name={Paths.DataBreach} />
              <Stack.Screen
                component={AppPermission}
                name={Paths.AppPermission}
              />
              <Stack.Screen
                component={AppPermissionDetails}
                name={Paths.AppPermissionDetails}
              />
              <Stack.Screen
                component={SecurityAdvisor}
                name={Paths.SecurityAdvisor}
              />
              <Stack.Screen
                component={ThreatAdvisor}
                name={Paths.ThreatAdvisor}
              />
              <Stack.Screen component={AdwareScan} name={Paths.AdwareScan} />
              <Stack.Screen
                component={AppStatistics}
                name={Paths.AppStatistics}
              />
              <Stack.Screen
                component={AppUsageStats}
                name={Paths.AppUsageStats}
              />
              <Stack.Screen
                component={DataUsageStats}
                name={Paths.DataUsageStats}
              />
              <Stack.Screen
                component={ActiveTimeDetails}
                name={Paths.ActiveTimeDetails}
              />
              <Stack.Screen component={AppUpdates} name={Paths.AppUpdates} />
              <Stack.Screen component={HiddenApps} name={Paths.HiddenApps} />
            </>
          ) : (
            <>
              <Stack.Screen component={Login} name={Paths.Login} />
              <Stack.Screen component={Register} name={Paths.Register} />
              <Stack.Screen component={VerifyEmail} name={Paths.VerifyEmail} />
              <Stack.Screen
                component={ForgetPassword}
                name={Paths.ForgetPassword}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default ApplicationNavigator;
