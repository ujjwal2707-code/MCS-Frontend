import type { StackScreenProps } from '@react-navigation/stack';
import type { Paths } from '../navigation/paths';

export type RootStackParamList = {
  [Paths.Home]: undefined;
  [Paths.ScanQr]:undefined;
  [Paths.ScanUrl]:undefined;
  [Paths.WifiSecurity]:undefined;
  [Paths.AppPermission]: undefined;
  [Paths.SecurityAdvisor]:undefined;
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
