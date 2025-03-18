import type {StackScreenProps} from '@react-navigation/stack';
import type {Paths} from '../navigation/paths';
import {InstalledApp, InstalledAppStats, WifiNetwork} from '../../types/types';

export type RootStackParamList = {
  [Paths.Home]: undefined;
  [Paths.ScanQr]: undefined;
  [Paths.ScanUrl]: undefined;
  [Paths.WifiSecurity]: undefined;
  [Paths.WifiSecurityDetails]: {wifi: WifiNetwork};
  [Paths.CyberNews]: undefined;
  [Paths.OtpSecurity]: undefined;
  [Paths.DataBreach]: undefined;
  [Paths.AppPermission]: undefined;
  [Paths.AppPermissionDetails]: {app: InstalledApp};
  [Paths.SecurityAdvisor]: undefined;
  [Paths.ThreatAdvisor]: undefined;
  [Paths.AdwareScan]: undefined;
  [Paths.AppStatistics]: undefined;
  [Paths.AppUsageStats]:{apps:InstalledAppStats[]};
  [Paths.DataUsageStats]:{apps:InstalledAppStats[]},
  [Paths.ActiveTimeDetails]:{app:InstalledAppStats}
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
