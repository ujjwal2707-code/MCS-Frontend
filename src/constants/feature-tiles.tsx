import Ionicons from 'react-native-vector-icons/Ionicons';
import {Paths} from '../navigation/paths';
import { FeatureTileType } from 'types/types';

// Icons
import scanQr from '@assets/icons/scanqr.png';
import scanWeb from '@assets/icons/scanweb.png'
import wifiSecurity from '@assets/icons/wifusecurity.png'
import cyberNews from '@assets/icons/cybernews.png'
import otpSecurity from '@assets/icons/otpsecurity.png'
import dataBreach from '@assets/icons/databreach.png'
import appPermission from '@assets/icons/apppermission.png'
import securityAdvisor from '@assets/icons/securityadvisor.png'
import threatAnalyzer from '@assets/icons/threatanalyzer.png'

export const featureTilesData: FeatureTileType[] = [
  {
    id: '1',
    image:scanQr,
    label: 'Scan QR Code',
    route: Paths.ScanQr,
  },
  {
    id: '2',
    image: scanWeb,
    label: 'Scan URL',
    route: Paths.ScanUrl,
  },
  {
    id: '3',
    image:wifiSecurity,
    label: 'Wifi Security',
    route: Paths.WifiSecurity,
  },
  {
    id: '8',
    image:cyberNews,
    label: 'Cyber News',
    route: Paths.CyberNews,
  },
  {
    id: '9',
    image:otpSecurity,
    label: 'OTP Security',
    route: Paths.OtpSecurity,
  },
  {
    id: '10',
    image:dataBreach,
    label: 'Data Breach',
    route: Paths.DataBreach,
  },
  {
    id: '4',
    image:appPermission,
    label: 'App Permissions',
    route: Paths.AppPermission,
  },
  {
    id: '5',
    image:securityAdvisor,
    label: 'Security Advisor',
    route: Paths.SecurityAdvisor,
  },
  {
    id: '12',
    image:otpSecurity,
    label: 'Hidden Application',
    route: Paths.HiddenApps,
  },
  {
    id: '7',
    image:threatAnalyzer,
    label: 'Adware Scan',
    route: Paths.AdwareScan,
  },
  {
    id: '11',
    icon: <Ionicons name="stats-chart-outline" size={24} color="white" />,
    label: 'App Statistics',
    route: Paths.AppStatistics,
  },
  {
    id: '6',
    image:threatAnalyzer,
    label: 'Threat Analyzer',
    route: Paths.ThreatAdvisor,
  },
];
