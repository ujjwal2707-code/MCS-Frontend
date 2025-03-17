export interface InstalledApp {
  packageName: string;
  name: string;
  icon: string;
  permissions: string[];
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
