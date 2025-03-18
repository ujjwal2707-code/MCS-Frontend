export interface FeatureTileType {
  id: string;
  icon?: React.ReactNode;
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
  packageName: string;
  name: string;
  icon: string;
  permissions: string[];
  sha256: string;
  installerSource: string;
  installedOn: string;
  lastUsageDate: string;
  dailyUsage: number;
  weeklyUsage: number;
  monthlyUsage: number;
  transmittedBytes:number;
  receivedBytes:number;
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
