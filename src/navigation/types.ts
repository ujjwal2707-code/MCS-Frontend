import type {StackScreenProps} from '@react-navigation/stack';
import type {Paths} from '../navigation/paths';
import {
  InstalledApp,
  InstalledAppAdsInfo,
  InstalledAppStats,
  WifiNetwork,
} from '../../types/types';

export type RootStackParamList = {
  [Paths.SplashScreen]: undefined;
  [Paths.Register]: undefined;
  [Paths.Login]: undefined;
  [Paths.VerifyEmail]: {email: string};
  [Paths.ForgetPassword]: undefined;
  MainTabs: undefined;
  [Paths.Profile]: undefined;
  [Paths.Contact]: undefined;
  [Paths.PrivacyPolicy]: undefined;
  [Paths.Home]: undefined;
  [Paths.ScanQr]: undefined;
  [Paths.ScanUrl]: undefined;
  [Paths.ScanWebUrl]: undefined;
  [Paths.ScanPaymentUrl]: undefined;
  [Paths.ScanAppUrl]: undefined;
  [Paths.WifiSecurity]: undefined;
  [Paths.WifiSecurityDetails]: {wifi: WifiNetwork};
  [Paths.CyberNews]: undefined;
  [Paths.OtpSecurity]: undefined;
  [Paths.DataBreach]: undefined;
  [Paths.AppPermission]: undefined;
  [Paths.AppPermissionDetails]: {app: InstalledApp};
  [Paths.SecurityAdvisor]: undefined;
  [Paths.SecurityDetails]:{id:string};
  [Paths.ThreatAdvisor]: undefined;
  [Paths.AdwareScan]: undefined;
  [Paths.AdsList]: {app: InstalledApp; ads: string[]};
  [Paths.AppStatistics]: undefined;
  [Paths.AppUsageStats]: undefined;
  [Paths.DataUsageStats]: undefined;
  [Paths.ActiveTimeDetails]: {app: InstalledAppStats};
  [Paths.AppUpdates]: undefined;
  [Paths.AppUpdatesDetails]: {app: InstalledAppStats}
  [Paths.HiddenApps]: undefined;
};

export type NoParamsRoutes = {
  [K in keyof RootStackParamList]: RootStackParamList[K] extends undefined
    ? K
    : never;
}[keyof RootStackParamList];

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
