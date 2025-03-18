export interface InstalledApp {
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
