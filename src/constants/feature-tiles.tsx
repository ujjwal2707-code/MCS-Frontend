import {Paths} from '../navigation/paths';
import {FeatureTileType} from 'types/types';

// Icons
import scanQr from '@assets/icons/scanqrr.png';
import scanWeb from '@assets/icons/scanwebb.png';
import wifiSecurity from '@assets/icons/wifisec.png';
import cyberNews from '@assets/icons/cybernewss.png';
import otpSecurity from '@assets/icons/otpsec.png';
import dataBreach from '@assets/icons/databreachh.png';
import appPermission from '@assets/icons/appperm.png';
import securityAdvisor from '@assets/icons/securityadv.png';
import threatAnalyzer from '@assets/icons/threat.png';
import hiddenApps from '@assets/icons/hiddenapps.png';
import appStats from '@assets/icons/appstats.png';
import adwareScan from '@assets/icons/adwarescan.png';

export const featureTilesData: FeatureTileType[] = [
  {
    id: '1',
    image: scanQr,
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
    image: wifiSecurity,
    label: 'Wifi Security',
    route: Paths.WifiSecurity,
  },
  {
    id: '8',
    image: cyberNews,
    label: 'Cyber News',
    route: Paths.CyberNews,
  },
  {
    id: '9',
    image: otpSecurity,
    label: 'Check Forwardings',
    route: Paths.OtpSecurity,
  },
  {
    id: '10',
    image: dataBreach,
    label: 'Data Breach',
    route: Paths.DataBreach,
  },
  {
    id: '4',
    image: appPermission,
    label: 'App Permissions',
    route: Paths.AppPermission,
  },
  {
    id: '5',
    image: securityAdvisor,
    label: 'Security Advisor',
    route: Paths.SecurityAdvisor,
  },
  {
    id: '12',
    image: hiddenApps,
    label: 'Hidden Application',
    route: Paths.HiddenApps,
  },
  {
    id: '7',
    image: adwareScan,
    label: 'Adware Scan',
    route: Paths.AdwareScan,
  },
  {
    id: '11',
    image: appStats,
    label: 'App Statistics',
    route: Paths.AppStatistics,
  },
  {
    id: '6',
    image: threatAnalyzer,
    label: 'Threat Analyzer',
    route: Paths.ThreatAdvisor,
  },

  // {
  //   id: '7677',
  //   image: adwareScan,
  //   label: 'Adware Scan',
  //   route: Paths.AdwareScan,
  // },
  // {
  //   id: '1166778',
  //   image: appStats,
  //   label: 'App Statistics',
  //   route: Paths.AppStatistics,
  // },
  // {
  //   id: '656778',
  //   image: threatAnalyzer,
  //   label: 'Threat Analyzer',
  //   route: Paths.ThreatAdvisor,
  // },
];
