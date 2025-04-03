import {
  TextInputProps,
  TouchableOpacityProps,
  ImageSourcePropType,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface FeatureTileType {
  id: string;
  icon?: IconNameReact.ComponentProps<typeof Ionicons>["name"];
  image?: ImageSourcePropType;
  label: string;
  route: NoParamsRoutes;
}

export interface InstalledApp {
  packageName: string;
  name: string;
  icon: string;
  permissions: string[];
  sha256: string;
}

export interface InstalledAppStats {
  receivedBytes: number;
  transmittedBytes: number;
  monthlyUsage: number;
  weeklyUsage: number;
  dailyUsage: number;
  lastUpdateDate: string;
  installerSource: string;
  lastUsageDate: string;
  version: string;
  installedOn: string;
  permissions: string[];
  packageName: string;
  sha256: string;
  isUpToDate: boolean;
  icon: string;
  name: string;
}

export interface InstalledAppAdsInfo {
  packageName: string;
  serviceName: string;
}

export interface WifiNetwork {
  SSID: string;
  BSSID: string;
  capabilities: string;
  frequency: number;
  level: number;
  timestamp: number;
  securityRating: number;
  isSecure: boolean;
}

export interface VirusTotalResponse {
  data: {
    id: string;
    type: string;
    links: {
      self: string;
      item: string;
    };
    attributes: {
      results: Record<string, EngineResult>;
      stats: {
        malicious: number;
        suspicious: number;
        undetected: number;
        harmless: number;
        timeout: number;
      };
      date: number;
      status: string; // completed,queued
    };
  };
  meta: {
    url_info: {
      id: string;
      url: string;
    };
    file_info: {
      sha256: string;
    };
  };
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
  textVariant?: 'primary' | 'default' | 'secondary' | 'danger' | 'success';
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}
