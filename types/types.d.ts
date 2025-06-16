import {
  TextInputProps,
  TouchableOpacityProps,
  ImageSourcePropType,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface FeatureTileType {
  id: string;
  icon?: IconNameReact.ComponentProps<typeof Ionicons>['name'];
  image?: ImageSourcePropType;
  label: string;
  route: NoParamsRoutes;
}

export type ControllablePermission = {
  name: string;
  granted: boolean;
  description: string;
  dangerous: boolean;
};

export interface InstalledApp {
  packageName: string;
  name: string;
  icon: string;
  controllablePermissions: ControllablePermission[];
  sha256: string;
}

export interface DataUsage {
  received: number;
  transmitted: number;
}
export interface InstalledAppStats {
  weeklyDataUsage: DataUsage;
  monthlyUsage: number;
  weeklyUsage: number;
  monthlyDataUsage: DataUsage;
  dailyUsage: number;
  lastUpdateDate: string; // ISO date string
  installerSource: string;
  lastUsageDate: string; // Could be an empty string if never used
  version: string;
  installedOn: string; // ISO date string
  permissions: string[];
  dailyDataUsage: DataUsage;
  packageName: string;
  sha256: string;
  isUpToDate: boolean;
  icon: string; // base64-encoded image
  name:string;
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

export interface ScanURLResult {
  stats: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    timeout: number;
  };
  meta: {
    url_info: {
      id: string;
      url: string;
    };
  };
  scanners: {
    malicious: string[];
    suspicious: string[];
    undetected: string[];
    harmless: string[];
    timeout: string[];
  };
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

// Domain reputation
interface BlacklistEngine {
  name: string;
  detected: boolean;
  reference: string;
  confidence: 'low' | 'high';
  elapsed_ms: number;
}

interface Blacklists {
  engines: Record<string, BlacklistEngine>;
  detections: number;
  engines_count: number;
  detection_rate: string;
  scan_time_ms: number;
}

interface ServerDetails {
  ip: string;
  reverse_dns: string;
  continent_code: string;
  continent_name: string;
  country_code: string;
  country_name: string;
  region_name: string;
  city_name: string;
  latitude: number;
  longitude: number;
  isp: string;
  asn: string;
}

interface SecurityChecks {
  is_most_abused_tld: boolean;
  is_domain_ipv4_assigned: boolean;
  is_domain_ipv4_private: boolean;
  is_domain_ipv4_loopback: boolean;
  is_domain_ipv4_reserved: boolean;
  is_domain_ipv4_valid: boolean;
  is_domain_blacklisted: boolean;
  is_uncommon_host_length: boolean;
  is_uncommon_dash_char_count: boolean;
  is_uncommon_dot_char_count: boolean;
  website_popularity: 'low' | 'medium' | 'high' | string;
  is_uncommon_clickable_domain: boolean;
  is_risky_category: boolean;
}

interface RiskScore {
  result: number;
}

interface Nameserver {
  name: string;
  ipv4: string;
  ipv6: string;
}

interface DomainInfo {
  domain_creation_date: string;
  domain_age_in_days: number;
  domain_age_in_months: number;
  domain_age_in_years: number;
  owner_organization: string;
  owner_country: string;
  owner_state_province: string;
  registrar: string;
  registrar_abuse_email: string;
  dnssec: string;
  nameservers: Nameserver[];
}

export interface DomainReputationResponse {
  host: string;
  blacklists: Blacklists;
  server_details: ServerDetails;
  security_checks: SecurityChecks;
  risk_score: RiskScore;
  domain_info: DomainInfo;
  timestamp: string;
}


// Text Input
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

// Button
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

