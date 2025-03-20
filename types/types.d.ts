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